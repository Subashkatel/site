/*
  The pen of the strip chart.

  On every tick the pen hears where the pointer was a few ticks ago (a
  delay line) and a spring pulls it toward that spot. The spring is
  deliberately underdamped: gentle movement is tracked closely, while
  fast movement overshoots, rings, and settles.

  Positions run from 0 (left edge of the strip) to 1 (right edge).
*/

const CENTRE = 0.5;

/* How many ticks late the pen hears where the pointer is. */
const DELAY_IN_TICKS = 10;

/* The spring pulling the pen toward the delayed target. */
const SPRING_STIFFNESS = 0.05;
const SPRING_DAMPING = 0.05;

/* The pen may ring a little past the strip's edges before bouncing back. */
const LOWEST_POSITION = -0.35;
const HIGHEST_POSITION = 1.35;
const SPEED_KEPT_AFTER_BOUNCE = 0.3;

/* Scrolling nudges the target. One big flick of the wheel is capped so it can't throw the pen. */
const LARGEST_SCROLL_STEP_IN_PIXELS = 120;
const TARGET_SHIFT_PER_SCROLLED_PIXEL = 0.0015;
const LOWEST_SCROLL_TARGET = 0.02;
const HIGHEST_SCROLL_TARGET = 0.98;

/* Enough history to fill the tallest screen. */
const TRACE_LENGTH_IN_TICKS = 2400;

function clamp(value: number, lowest: number, highest: number): number {
  return Math.max(lowest, Math.min(highest, value));
}

export class Pen {
  private target = CENTRE;
  private position = CENTRE;
  private velocity = 0;
  private recentTargets: number[] = [];

  /* Past positions, oldest first. It starts full so the paper is never blank. */
  readonly trace: number[] = new Array(TRACE_LENGTH_IN_TICKS).fill(CENTRE);

  followPointer(pointerX: number, windowWidth: number): void {
    this.target = pointerX / windowWidth;
  }

  nudgeByScroll(scrolledPixels: number): void {
    const cappedPixels = clamp(scrolledPixels, -LARGEST_SCROLL_STEP_IN_PIXELS, LARGEST_SCROLL_STEP_IN_PIXELS);
    const shiftedTarget = this.target + cappedPixels * TARGET_SHIFT_PER_SCROLLED_PIXEL;
    this.target = clamp(shiftedTarget, LOWEST_SCROLL_TARGET, HIGHEST_SCROLL_TARGET);
  }

  /* Moves the pen forward by one tick of the clock and records where it lands. */
  advance(): void {
    const delayedTarget = this.hearDelayedTarget();
    const springForce = SPRING_STIFFNESS * (delayedTarget - this.position);
    const dampingForce = SPRING_DAMPING * this.velocity;
    this.velocity += springForce - dampingForce;
    this.position += this.velocity;
    this.bounceOffLimits();
    this.recordPosition();
  }

  /* Returns the target from DELAY_IN_TICKS ticks ago, or the oldest one heard so far. */
  private hearDelayedTarget(): number {
    this.recentTargets.push(this.target);
    if (this.recentTargets.length > DELAY_IN_TICKS + 1) {
      this.recentTargets.shift();
    }
    return this.recentTargets[0];
  }

  private bounceOffLimits(): void {
    if (this.position < LOWEST_POSITION) {
      this.position = LOWEST_POSITION;
      this.velocity = Math.abs(this.velocity) * SPEED_KEPT_AFTER_BOUNCE;
    }
    if (this.position > HIGHEST_POSITION) {
      this.position = HIGHEST_POSITION;
      this.velocity = -Math.abs(this.velocity) * SPEED_KEPT_AFTER_BOUNCE;
    }
  }

  private recordPosition(): void {
    this.trace.push(this.position);
    if (this.trace.length > TRACE_LENGTH_IN_TICKS) {
      this.trace.shift();
    }
  }
}
