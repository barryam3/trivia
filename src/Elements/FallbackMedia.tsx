import React from "react";

export const FallbackAudio = React.forwardRef<
  HTMLAudioElement,
  Omit<React.ComponentPropsWithoutRef<"audio">, "src"> & {
    srcs: string[];
  }
>(({ srcs, onError, ...props }, ref) => {
  const [srcIdx, setSrcIdx] = React.useState(0);
  return (
    <audio
      {...props}
      ref={ref}
      src={srcs[srcIdx]}
      onError={(e) => {
        if (srcIdx < srcs.length - 1) {
          setSrcIdx(srcIdx + 1);
        } else {
          onError?.(e);
        }
      }}
    />
  );
});
