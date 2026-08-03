"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { DimensionMachine } from "./machine/dimension-machine";
import styles from "./machine-overlay.module.css";

// The Dimension Expansion Machine as an in-page overlay. Opening it draws a
// panel *over* the story rather than navigating to /machine, so the reader's
// place in the presentation is preserved when they close it again. Mounted at
// the top level (in the layout) so it floats above everything; the pull-tab
// launcher only appears on the story route.
export function MachineOverlay() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    tabRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    // Signals the story's keyboard handler to ignore arrow keys while the
    // machine is open, so the story behind the overlay keeps its place.
    root.dataset.machineOpen = "true";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      delete root.dataset.machineOpen;
    };
  }, [open, close]);

  if (pathname !== "/") return null;

  return (
    <>
      <button
        ref={tabRef}
        type="button"
        className={styles.tab}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open Rosencrantz's Wonderful Machine"
        onClick={() => setOpen(true)}
      >
        <span className={styles.tip} aria-hidden="true">
          Run Rosencrantz&rsquo;s Wonderful Machine
        </span>
        <span className={styles.tabInner}>
          <span className={styles.cog} aria-hidden="true">
            ⚙
          </span>
          <span className={styles.word}>Machine</span>
        </span>
      </button>

      {open ? (
        <div className={styles.backdrop} onClick={close}>
          <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="machine-overlay-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.overlayEyebrow}>The apparatus</p>
                <h2 id="machine-overlay-title">
                  Rosencrantz&rsquo;s Dimension Expansion Machine
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                aria-label="Close the machine"
                onClick={close}
              >
                ×
              </button>
            </div>
            <DimensionMachine />
          </div>
        </div>
      ) : null}
    </>
  );
}
