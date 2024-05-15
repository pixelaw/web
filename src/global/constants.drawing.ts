/**
 * @dev Size of a single drawn pixel at 100% zoom
 */
export const MAX_CELL_SIZE = 128;

/**
 * @dev Pixels in map (width and height)
 */
export const MAP_SIZE = 4294967295; // uint32 max

/**
 * @deprecated get rid of this, you don't want hardcoded canvas sizes
 */
export const CANVAS_WIDTH = 1850 * 2;

/**
 * @deprecated get rid of this, you don't want hardcoded canvas sizes
 */
export const CANVAS_HEIGHT = 860;

/**
 * @notice DrawPanel interaction constants
 */
export const INTERACTION = {
  MINZOOM: 5,
  MAXZOOM: 100,
  ZOOMSTEPS: 5,
  PANSPEED: 0.0075,
};
