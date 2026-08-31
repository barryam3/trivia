import React from "react";

type FallbackAudioProps = Omit<
  React.ComponentPropsWithRef<"audio">,
  "src"
> & {
  srcs: string[];
};

export function FallbackAudio({
  srcs,
  onError,
  ref,
  ...props
}: FallbackAudioProps) {
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
}
