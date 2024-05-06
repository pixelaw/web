import { useCallback } from 'react'
import { CellDatum } from '@/components/shared/DrawPanel.tsx'
import { felt252ToString } from '@/global/utils'
import { Vector2 } from 'threejs-math';

type TDrawContext = {
  ctx: CanvasRenderingContext2D;
  pixelSize: number;
}

export type TPixel = {
  position: [number,number];
  color: string;
  text: string;
  needsAttention?: boolean;
}

// const DrawPixelText = (context: TDrawContext, pixel: TPixel) => {
//   const {ctx, pixelSize} = context;
//   ctx.textAlign = 'center'
//   ctx.font=`${(pixelSize / 2)}px Serif`
//   let text = felt252ToString(pixel.text);
//   if (pixel.color === '#000000') ctx.fillStyle = 'white'
//   else ctx.fillStyle = 'black'
//   if (text.includes('U+')) {
//       text = text.replace('U+', '')
//       const codePoint = parseInt(text, 16)
//       text = String.fromCodePoint(codePoint)
//   } else {
//     // FIXME: make this scale better
//     if (text.length > 4 && text.length <= 8) {
//       ctx.font = `${(pixelSize / 4)}px Serif`
//     } else if (text.length > 8 && text.length <= 12) {
//       ctx.font = `${(pixelSize / 6)}px Serif`
//     } else if (text.length > 12) {
//       ctx.font = `${(pixelSize / 8)}px Serif`
//     }
//   }
//   ctx.fillText(text, pixel.position.x + pixelSize / 2, pixel.position.y + pixelSize / 1.5)
// }

// const DrawPixel = (context: TDrawContext, pixel?: TPixel) => {
//   const {ctx, pixelSize} = context;
//   const {position: {x, y}} = pixel;
//   ctx.fillStyle = pixel.color
//   ctx.fillRect(x, y, pixelSize, pixelSize)
//   ctx.strokeStyle = '#2E0A3E'
//   ctx.strokeRect(x, y, pixelSize, pixelSize)

//   if(pixel.needsAttention){
//       ctx.strokeStyle = '#FFFFFF'
//       ctx.shadowColor = '#FFFFFF'
//       ctx.shadowBlur = 10
//       ctx.strokeRect(x, y, pixelSize, pixelSize)
//       ctx.shadowColor = 'transparent'
//   }
// }

// const DrawGridCell = (context: TDrawContext, position: Vector2) => {
//   ctx.fillStyle = pixelColor
//   ctx.fillRect(x, y, cellSize, cellSize)
//   ctx.strokeStyle = '#2E0A3E'
//   ctx.strokeRect(x, y, cellSize, cellSize)
// }

export function useRenderGrid() {
  return useCallback((ctx: CanvasRenderingContext2D, options: {
    width: number,
    height: number,
    cellSize: number,
    coordinates: [ number | undefined, number | undefined ] | undefined
    panOffset: Vector2,
    selectedHexColor: string,
    visibleAreaXStart: number,
    visibleAreaXEnd: number,
    visibleAreaYStart: number,
    visibleAreaYEnd: number,
    pixels: Array<CellDatum | undefined> | undefined
    focus: Array<{x: number, y: number}>
    grid: Map<string, TPixel>
  }) => {
    const {
      cellSize,
      width,
      height,
      panOffset,
      coordinates,
      selectedHexColor,
      visibleAreaXStart,
      visibleAreaXEnd,
      visibleAreaYStart,
      visibleAreaYEnd,
      pixels,
      focus,
      grid
    } = options
    ctx.clearRect(0, 0, width, height)

    for (let row = visibleAreaXStart; row <= visibleAreaXEnd; row++) {
      for (let col = visibleAreaYStart; col <= visibleAreaYEnd; col++) {
        const x = row * cellSize + panOffset.x
        const y = col * cellSize + panOffset.y

        let pixelColor = '#2F1643' // default color
        let pixelText = ''

        if (pixels && pixels.length > 0) {
          const pixel = grid.get(`[${row},${col}]`) || undefined;
          if (pixel) {
            /// if hexColor from the contract is empty, then use default color
            pixel.color = pixel.color === '0x0' ? pixelColor : pixel.color
            // Get the current color of the pixel
            if (pixel.text && pixel.text !== '0x0') {
              pixelText = pixel.text
            }
            pixelColor = pixel.color
          }
        }

        if (coordinates && row === coordinates[0] && col === coordinates[1]) {
          pixelColor = selectedHexColor
        }

        ctx.fillStyle = pixelColor
        ctx.fillRect(x, y, cellSize, cellSize)
        ctx.strokeStyle = '#2E0A3E'
        ctx.strokeRect(x, y, cellSize, cellSize)

        if(focus.length){
          // const pixelNeedAttention = focus.find(p => p.x === row && p.y === col)
          // if(pixelNeedAttention){
          //   ctx.strokeStyle = '#FFFFFF'
          //   ctx.shadowColor = '#FFFFFF'
          //   ctx.shadowBlur = 10
          //   ctx.strokeRect(x, y, cellSize, cellSize)
          //   ctx.shadowColor = 'transparent'
          // }
        }



        if (pixelText) {
          ctx.textAlign = 'center'

          ctx.font=`${(cellSize / 2)}px Serif`

          let text = felt252ToString(pixelText)

          if (pixelColor === '#000000') ctx.fillStyle = 'white'
          else ctx.fillStyle = 'black'

          if (text.includes('U+')) {
              text = text.replace('U+', '')
              const codePoint = parseInt(text, 16)
              text = String.fromCodePoint(codePoint)
          } else {
            // FIXME: make this scale better
            if (text.length > 4 && text.length <= 8) {
              ctx.font = `${(cellSize / 4)}px Serif`
            } else if (text.length > 8 && text.length <= 12) {
              ctx.font = `${(cellSize / 6)}px Serif`
            } else if (text.length > 12) {
              ctx.font = `${(cellSize / 8)}px Serif`
            }
          }

          ctx.fillText(text, x + cellSize / 2, y + cellSize / 1.5)
        }

      }
    }
  }, [])
}
