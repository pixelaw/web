import React from "react";
import {clsx} from "clsx";
import {Button} from "@/components/ui/button";
import { getGameStore, useGameStore } from "@/global/user.store";

type PropsType = {
  value?: number,
  onZoomChange?: (value: number) => void,
  min?: number,
  max?: number
  steps?: number
}

enum ZoomType {
  Add,
  Subtract
}

const ZoomControl: React.FC<PropsType & React.HTMLAttributes<HTMLDivElement>> = (
    props
) => {

  const zoomLevel = useGameStore((state) => state.zoomLevel);

  const {min, max, className} = props
  const steps = props?.steps ?? 1

  const handleChange = (type: ZoomType) => {
    let newValue = zoomLevel
    if (type === ZoomType.Add) {
      newValue += steps
      if (max) {
        if (max < newValue) newValue = max
      }
    } else {
      newValue -= steps
      if (min) {
        if (min > newValue) newValue = min
      }
    }
    getGameStore().set({ zoomLevel: newValue })
  }

  return (
      <div
          className={clsx(
              [
                'h-[50px]',
                className
              ])}
          {...props}
      >
        <div
            className={clsx(
                [
                  'h-full w-[15em]',
                  'flex-center gap-x-10',
                  'bg-black rounded-full p-[0.25em] '
                ])}
        >

          <Button
              variant={'icon'}
              size={'icon'}
              onClick={() => handleChange(ZoomType.Subtract)}
              disabled={min ? min >= zoomLevel : false}
              className={'font-emoji font-bold text-brand-violetAccent text-[34px]'}
          >
            &#8722;
          </Button>

          <span className={'text-brand-skyblue text-base font-silkscreen text-center'}> {zoomLevel}% </span>

          <Button
              variant={'icon'}
              size={'icon'}
              onClick={() => handleChange(ZoomType.Add)}
              disabled={max ? max <= zoomLevel : false}
              className={'font-emoji font-bold text-brand-violetAccent text-[34px]'}
          >
            &#43;
          </Button>
        </div>
      </div>
  )
}

ZoomControl.displayName = "NavigationBarZoomControl"

export default ZoomControl
