'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Pen } from '@/lib/line/pen';
import { drawTrace, type StripArea, type TraceColors } from '@/lib/line/drawTrace';

/*
  The line: a strip chart in the left rail, drawn by a pen that follows
  the pointer (see lib/line/pen.ts).

  It lives in the layout, so it keeps drawing across page changes. On an
  individual piece of writing it rests: it fades (see #line.resting in
  globals.css) and the paper stops advancing.
*/

/* The pen advances 60 times a second, whatever the screen's refresh rate. */
const TICK_IN_MILLISECONDS = 1000 / 60;

/* After a long pause (a hidden tab, say), catch up on at most this much time instead of racing through it. */
const LONGEST_CATCH_UP_IN_MILLISECONDS = 120;

/* A page change jumps the scroll position. Scroll events this soon after one are ignored. */
const PAGE_CHANGE_SETTLE_IN_MILLISECONDS = 150;

/* The strip sits this far in from the left edge of the name. */
const OFFSET_FROM_NAME_IN_PIXELS = 10;

/* The line starts this far below the name. */
const GAP_BELOW_NAME_IN_PIXELS = 7;

const FALLBACK_COLORS: TraceColors = { line: '#C9C4B6', pen: '#1B1A17' };

function isReadingPage(pathname: string): boolean {
  return pathname.startsWith('/writing/');
}

/* The line hangs from the site name in the nav, which is marked with data-line-anchor. */
function findSiteName(): HTMLElement | null {
  return document.querySelector('[data-line-anchor]');
}

/* At every screen width. On narrow screens globals.css moves the name out to the margin to make room. */
function placeStripUnderName(strip: HTMLElement): void {
  const siteName = findSiteName();
  if (!siteName) return;
  const nameLeftEdge = siteName.getBoundingClientRect().left;
  const stripLeftEdge = Math.round(nameLeftEdge + OFFSET_FROM_NAME_IN_PIXELS);
  strip.style.left = `${stripLeftEdge}px`;
}

/* Just below the name. Once the name scrolls away, the top of the window, so there is never a gap. */
function measureTopEdge(): number {
  const siteName = findSiteName();
  if (!siteName) return 0;
  const nameBottomEdge = siteName.getBoundingClientRect().bottom;
  return Math.max(0, nameBottomEdge + GAP_BELOW_NAME_IN_PIXELS);
}

/* Sizes the canvas in device pixels so the line stays sharp, while drawing code works in CSS pixels. */
function fitCanvasToStrip(
  strip: HTMLElement,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): { width: number; height: number } {
  const pixelRatio = window.devicePixelRatio || 1;
  const stripBox = strip.getBoundingClientRect();
  const width = Math.max(1, Math.round(stripBox.width));
  const height = Math.max(1, Math.round(stripBox.height));
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return { width, height };
}

/* Reads the colours from the CSS variables, so the line follows light and dark mode. */
function readTraceColors(): TraceColors {
  const rootStyle = getComputedStyle(document.documentElement);
  const lineColor = rootStyle.getPropertyValue('--trace').trim();
  const penColor = rootStyle.getPropertyValue('--ink').trim();
  return {
    line: lineColor || FALLBACK_COLORS.line,
    pen: penColor || FALLBACK_COLORS.pen,
  };
}

/*
  Calls onTick at a steady rate and onFrame once per screen refresh.
  Returns a function that stops the clock.
*/
function startClock(onTick: () => void, onFrame: () => void): () => void {
  let unspentMilliseconds = 0;
  let previousFrameTime = 0;
  let frameRequest = 0;

  function handleFrame(frameTime: number): void {
    const elapsedMilliseconds = frameTime - previousFrameTime;
    previousFrameTime = frameTime;
    unspentMilliseconds += Math.min(elapsedMilliseconds, LONGEST_CATCH_UP_IN_MILLISECONDS);
    while (unspentMilliseconds >= TICK_IN_MILLISECONDS) {
      onTick();
      unspentMilliseconds -= TICK_IN_MILLISECONDS;
    }
    onFrame();
    frameRequest = requestAnimationFrame(handleFrame);
  }

  frameRequest = requestAnimationFrame((firstFrameTime) => {
    previousFrameTime = firstFrameTime;
    handleFrame(firstFrameTime);
  });
  return () => cancelAnimationFrame(frameRequest);
}

export function Line() {
  const pathname = usePathname();
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRestingRef = useRef(isReadingPage(pathname));
  const lastPageChangeRef = useRef(0);

  useEffect(() => {
    isRestingRef.current = isReadingPage(pathname);
    lastPageChangeRef.current = performance.now();
  }, [pathname]);

  useEffect(() => {
    const strip = stripRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!strip || !canvas || !context) return;

    const pen = new Pen();
    const darkMode = matchMedia('(prefers-color-scheme: dark)');
    const prefersStillness = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const listeners = new AbortController();
    const listenerOptions = { passive: true, signal: listeners.signal };

    let colors = readTraceColors();
    let canvasSize = fitCanvasToStrip(strip, canvas, context);

    const redraw = (): void => {
      placeStripUnderName(strip);
      const area: StripArea = { ...canvasSize, topEdge: measureTopEdge() };
      drawTrace(context, pen.trace, area, colors);
    };

    const handleResize = (): void => {
      placeStripUnderName(strip);
      canvasSize = fitCanvasToStrip(strip, canvas, context);
      redraw();
    };

    const handleColorSchemeChange = (): void => {
      colors = readTraceColors();
      redraw();
    };

    let lastScrollY = window.scrollY;
    let lastPathname = window.location.pathname;

    const handleScroll = (): void => {
      const scrolledPixels = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;

      const pageJustChanged = window.location.pathname !== lastPathname;
      lastPathname = window.location.pathname;
      const timeSincePageChange = performance.now() - lastPageChangeRef.current;
      const pageStillSettling = timeSincePageChange < PAGE_CHANGE_SETTLE_IN_MILLISECONDS;
      if (pageJustChanged || pageStillSettling) return;

      pen.nudgeByScroll(scrolledPixels);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      pen.followPointer(event.clientX, window.innerWidth);
    };

    window.addEventListener('resize', handleResize, listenerOptions);
    darkMode.addEventListener('change', handleColorSchemeChange, listenerOptions);

    if (prefersStillness) {
      /* No motion: a flat trace, redrawn only when the layout moves. */
      window.addEventListener('scroll', redraw, listenerOptions);
      document.fonts?.ready.then(redraw);
      redraw();
      return () => listeners.abort();
    }

    window.addEventListener('scroll', handleScroll, listenerOptions);
    window.addEventListener('pointermove', handlePointerMove, listenerOptions);

    const advanceUnlessResting = (): void => {
      if (isRestingRef.current) return;
      pen.advance();
    };

    const stopClock = startClock(advanceUnlessResting, redraw);

    return () => {
      stopClock();
      listeners.abort();
    };
  }, []);

  const stripClassName = isReadingPage(pathname) ? 'resting' : undefined;

  return (
    <div id="line" ref={stripRef} className={stripClassName} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
