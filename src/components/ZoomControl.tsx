import React, { useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { getGameStore } from "@/global/game.store";
import { INTERACTION } from "@/global/constants";
import { createCamera } from "@/drawing/camera";

type PropsType = {
  value?: number;
  onZoomChange?: (value: number) => void;
};

const ZoomControl: React.FC<
  PropsType & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const [zoom, setZoom] = React.useState<number>(0);
  const [camera, setCamera] = React.useState<ReturnType<typeof createCamera>>(null!);

  const { MINZOOM, MAXZOOM, ZOOMSTEPS } = INTERACTION;
  const { className } = props;

  const handleClick = (dir: number) => {
    camera.zoomBy(ZOOMSTEPS * dir);
  };

  useEffect(() => {
    if (camera !== getGameStore().camera) { 
      setCamera(getGameStore().camera!)  
    }
  }, [getGameStore().camera]);

  useEffect(() => {
    const updateZoom = () => {
      if (getGameStore().camera?.position.z !== zoom) {
        setZoom(getGameStore().camera?.position.z || 50);
      }
    }
    document.addEventListener("updateZoom", updateZoom);
    return () => document.removeEventListener("updateZoom", updateZoom);
  }, []);

  if (!camera) return null;
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
          onClick={() => handleClick(-1)}
          disabled={MINZOOM >= camera.position.z}
          className={"font-emoji font-bold text-brand-violetAccent text-[34px]"}
        >
          &#8722;
        </Button>

        <span
          className={"text-brand-skyblue text-base font-silkscreen text-center"}
        >
          {" "}
          {camera.position.z?.toFixed(0)}%{" "}
        </span>

        <Button
          variant={"icon"}
          size={"icon"}
          onClick={() => handleClick(1)}
          disabled={MAXZOOM <= camera.position.z}
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
