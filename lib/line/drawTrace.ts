/*
  Draws the pen's history as a strip chart. The newest position sits
  at the bottom of the strip, with the pen drawn as a dot, and older
  positions scroll upward like paper leaving a chart recorder.
*/

export type StripArea = {
  width: number;
  height: number;
  /* Where the line starts, in pixels from the top of the window. */
  topEdge: number;
};

export type TraceColors = {
  line: string;
  pen: string;
};

const CENTRE = 0.5;
const PAPER_SPEED_IN_PIXELS_PER_TICK = 0.85;

/* How far the pen swings from the centre at the edge positions 0 and 1, as a share of the strip's width. */
const SWING_AS_SHARE_OF_WIDTH = 0.4;

const PEN_DOT_RADIUS_IN_PIXELS = 2;

/* Keeps the 1px line fully inside the canvas instead of half-clipped at the edge. */
const HALF_PIXEL = 0.5;

function positionToX(position: number, width: number): number {
  const centreX = width / 2;
  const swingInPixels = width * SWING_AS_SHARE_OF_WIDTH;
  const offsetFromCentre = (position - CENTRE) * 2 * swingInPixels;
  const x = centreX + offsetFromCentre;
  return Math.max(HALF_PIXEL, Math.min(width - HALF_PIXEL, x));
}

export function drawTrace(
  context: CanvasRenderingContext2D,
  trace: number[],
  area: StripArea,
  colors: TraceColors,
): void {
  context.clearRect(0, 0, area.width, area.height);

  context.strokeStyle = colors.line;
  context.lineWidth = 1;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();

  /* Walk backward through time, from the newest position at the bottom up to the top edge. */
  for (let ticksAgo = 0; ticksAgo < trace.length; ticksAgo++) {
    const y = area.height - ticksAgo * PAPER_SPEED_IN_PIXELS_PER_TICK;
    if (y < area.topEdge) break;

    const position = trace[trace.length - 1 - ticksAgo];
    const x = positionToX(position, area.width);
    if (ticksAgo === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.stroke();

  const newestPosition = trace[trace.length - 1];
  const penX = positionToX(newestPosition, area.width);
  const penY = area.height - 1;
  context.fillStyle = colors.pen;
  context.beginPath();
  context.arc(penX, penY, PEN_DOT_RADIUS_IN_PIXELS, 0, Math.PI * 2);
  context.fill();
}
