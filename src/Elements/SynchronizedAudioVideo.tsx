/**
 * Audio and Video elements that synchronize play/pause/seek actions across
 * tabs for all elements with the same src.
 */

import React from "react";
import { mergeRefs } from "react-merge-refs";

interface PlayMessage {
  type: "play";
}

interface PauseMessage {
  type: "pause";
}

interface SeekedMessage {
  type: "seeked";
  time: number;
}

type SynchronizeMessage = PlayMessage | PauseMessage | SeekedMessage;

function useSynchronize(
  avElementRef: React.RefObject<HTMLAudioElement | HTMLVideoElement>
) {
  React.useEffect(() => {
    const avElement = avElementRef.current;
    if (!avElement) return;
    const avSync = new BroadcastChannel(avElement.src);
    const onPlay = () => {
      avSync.postMessage({ type: "play" });
    };
    const onPause = () => {
      avSync.postMessage({ type: "pause" });
    };
    let ignoreNextSeek = false;
    const onSeeked = () => {
      if (ignoreNextSeek) {
        ignoreNextSeek = false;
        return;
      }
      avSync.postMessage({ type: "seeked", time: avElement.currentTime });
    };
    const onBroadcast = (e: MessageEvent<SynchronizeMessage>) => {
      switch (e.data.type) {
        case "play":
          avElement.play();
          break;
        case "pause":
          avElement.pause();
          break;
        case "seeked":
          ignoreNextSeek = true;
          avElement.currentTime = e.data.time;
          break;
      }
    };
    avElement.addEventListener("play", onPlay);
    avElement.addEventListener("pause", onPause);
    avElement.addEventListener("seeked", onSeeked);
    avSync.addEventListener("message", onBroadcast);
    return () => {
      avElement.removeEventListener("play", onPlay);
      avElement.removeEventListener("pause", onPause);
      avElement.removeEventListener("seeked", onSeeked);
      avSync.removeEventListener("message", onBroadcast);
    };
  }, [avElementRef]);
}

export const SynchronizedAudio = React.forwardRef<
  HTMLAudioElement,
  React.ComponentPropsWithoutRef<"audio">
>((props, ref) => {
  const localRef = React.useRef<HTMLAudioElement>(null);
  useSynchronize(localRef);
  return <audio {...props} ref={mergeRefs([ref, localRef])} />;
});

export const SynchronizedVideo = React.forwardRef<
  HTMLVideoElement,
  React.ComponentPropsWithoutRef<"video">
>((props, ref) => {
  const localRef = React.useRef<HTMLVideoElement>(null);
  useSynchronize(localRef);
  return <video {...props} ref={mergeRefs([ref, localRef])} />;
});
