import React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { getGameStore, useGameStore } from "@/global/user.store";
import { INTERACTION } from "@/global/constants";

type PropsType = {
  value?: number;
  onZoomChange?: (value: number) => void;
};

enum ZoomType {
  Add,
  Subtract,
}

const ZoomControl: React.FC<
  PropsType & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const zoomLevel = useGameStore((state) => state.zoomLevel);

  const { MINZOOM, MAXZOOM, ZOOMSTEPS } = INTERACTION;
  const { className } = props;

  const handleChange = (type: ZoomType) => {
    let newValue = zoomLevel;
    if (type === ZoomType.Add) {
      newValue += ZOOMSTEPS;
      if (MAXZOOM) {
        if (MAXZOOM < newValue) newValue = MAXZOOM;
      }
    } else {
      newValue -= ZOOMSTEPS;
      if (MINZOOM) {
        if (MINZOOM > newValue) newValue = MINZOOM;
      }
    }
    getGameStore().set({ zoomLevel: newValue });
  };

  return (
    <div className={clsx(["h-[50px]", className])} {...props}>
      <div
        className={clsx([
          "h-full w-[15em]",
          "flex-center gap-x-10",
          "bg-black rounded-full p-[0.25em] ",
        ])}
      >
        <Button
          variant={"icon"}
          size={"icon"}
          onClick={() => handleChange(ZoomType.Subtract)}
          disabled={MINZOOM ? MINZOOM >= zoomLevel : false}
          className={"font-emoji font-bold text-brand-violetAccent text-[34px]"}
        >
          &#8722;
        </Button>

        <span
          className={"text-brand-skyblue text-base font-silkscreen text-center"}
        >
          {" "}
          {zoomLevel.toFixed(0)}%{" "}
        </span>

        <Button
          variant={"icon"}
          size={"icon"}
          onClick={() => handleChange(ZoomType.Add)}
          disabled={MAXZOOM ? MAXZOOM <= zoomLevel : false}
          className={"font-emoji font-bold text-brand-violetAccent text-[34px]"}
        >
          &#43;
        </Button>
      </div>
    </div>
  );
};

ZoomControl.displayName = "NavigationBarZoomControl";

export default ZoomControl;
