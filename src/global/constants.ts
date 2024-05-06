export const PUBLIC_TORII: string =  "http://localhost:8080"

export const PUBLIC_NODE_URL: string = "http://localhost:5050"

export const PUBLIC_MANIFEST_URL: string = import.meta.env.PUBLIC_MANIFEST_URL

export const CORE_VERSION: string = import.meta.env.CORE_VERSION

export const BLOCK_TIME = 1_000

/**
 * @notice Size of a single drawn pixel
 */
export const MAX_CELL_SIZE = 128

/**
 * @notice Pixels in map (width and height)
 */
export const MAP_SIZE = 256

export const CANVAS_WIDTH = 1850
export const CANVAS_HEIGHT = 860

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000000'

/**
 * @notice Interaction constants
 */
export const INTERACTION = {
  MINZOOM: 5,
  MAXZOOM: 100,
  ZOOMSTEPS: 5
}