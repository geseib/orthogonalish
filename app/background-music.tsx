"use client";

/*
 * Site-wide background-music player.
 *
 * SUPPLYING A TRACK:
 *   - Drop an audio file at `public/audio/mozart_k515_marlboro.opus` (default), OR
 *   - Set `NEXT_PUBLIC_MUSIC_SRC` to an external URL (CDN / Vercel Blob) for a
 *     long track.
 *
 * STREAMING:
 *   The native <audio> element with `preload="none"` streams the file via HTTP
 *   range requests: the browser fetches only the chunks it needs to keep
 *   playing, so a very long track starts quickly and is NEVER downloaded in
 *   full up front. We deliberately do not fetch()/preload the whole file.
 *
 * GRACEFUL DEGRADE:
 *   If no source resolves, or the <audio> element errors (e.g. the default file
 *   is absent -> 404), the control hides itself so nothing looks broken.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./background-music.module.css";

const DEFAULT_SRC = "/audio/mozart_k515_marlboro.opus";
const STORAGE_KEY = "orthogonalish:music-on";
const DEFAULT_VOLUME = 0.25;

function resolveSrc(): string {
  const fromEnv = process.env.NEXT_PUBLIC_MUSIC_SRC;
  return fromEnv && fromEnv.trim().length > 0 ? fromEnv.trim() : DEFAULT_SRC;
}

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src] = useState<string>(resolveSrc);
  const [playing, setPlaying] = useState(false);
  const [errored, setErrored] = useState(false);
  // Remembered on/off preference; used to auto-start on the user's first
  // gesture if they previously had music enabled.
  const wantsOnRef = useRef(false);

  // Restore the persisted preference (client-only). If the user previously had
  // music "on", start it on their first gesture (autoplay policy still forbids
  // playing before any interaction).
  useEffect(() => {
    let restored = false;
    try {
      restored = window.localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      restored = false;
    }
    wantsOnRef.current = restored;
    if (!restored) return;

    const startOnGesture = () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.volume = DEFAULT_VOLUME;
      const attempt = audio.play();
      if (attempt && typeof attempt.then === "function") {
        attempt.then(() => setPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener("pointerdown", startOnGesture, { once: true });
    window.addEventListener("keydown", startOnGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
    };
  }, []);

  // Set the low default volume once the element mounts.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }
  }, []);

  const persist = useCallback((on: boolean) => {
    wantsOnRef.current = on;
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* localStorage may be unavailable (private mode); ignore. */
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || errored) return;

    if (audio.paused) {
      audio.volume = DEFAULT_VOLUME;
      const attempt = audio.play();
      if (attempt && typeof attempt.then === "function") {
        attempt
          .then(() => {
            setPlaying(true);
            persist(true);
          })
          .catch(() => {
            // Autoplay/gesture rejection -> stay paused, don't break.
            setPlaying(false);
          });
      } else {
        setPlaying(true);
        persist(true);
      }
    } else {
      audio.pause();
      setPlaying(false);
      persist(false);
    }
  }, [errored, persist]);

  // Keep React state in sync if the media plays/pauses for any other reason.
  const handlePlay = useCallback(() => setPlaying(true), []);
  const handlePause = useCallback(() => setPlaying(false), []);
  const handleError = useCallback(() => {
    setErrored(true);
    setPlaying(false);
  }, []);

  // Graceful degrade: render nothing if the media is broken/absent.
  if (errored) {
    return (
      // Keep the audio element mounted so its error handler can run, but hide
      // the control. Once errored we render only the (hidden) audio for cleanup.
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        loop
        aria-hidden="true"
        style={{ display: "none" }}
      />
    );
  }

  const label = playing ? "Pause background music" : "Play background music";

  return (
    <div className={styles.dock}>
      <button
        type="button"
        className={`${styles.button} ${playing ? styles.playing : ""}`}
        onClick={toggle}
        aria-label={label}
        aria-pressed={playing}
        title={label}
      >
        <span className={styles.icon} aria-hidden="true">
          {playing ? (
            <span className={styles.equalizer}>
              <span />
              <span />
              <span />
            </span>
          ) : (
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 1.2 10.4 6 2 10.8Z" />
            </svg>
          )}
        </span>
        <span className={styles.label}>{playing ? "On" : "Music"}</span>
      </button>

      {/*
        preload="none": no eager download. The browser streams via range
        requests only after the user starts playback. loop keeps it going.
      */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        loop
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        aria-hidden="true"
        style={{ display: "none" }}
      />
    </div>
  );
}
