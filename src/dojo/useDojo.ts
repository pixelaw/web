import { useContext } from "react";
import { PixelawContext } from '@/providers/PixelawProvider';

export const useDojo = () => {
  const context = useContext(PixelawContext);
  if (!context)
    throw new Error(
      "The `useDojo` hook must be used within a `DojoProvider`"
    );

  return {
    setup: context,
    account: context.account,
  };
};
