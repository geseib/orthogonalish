"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A pull-tab launcher for the Dimension Expansion Machine, fixed to the right
// edge. Mounted at the top level (in the layout, beside the music control) so it
// floats above the full-screen story instead of being trapped in the story's
// stacking context. Only shown on the home route.
export function MachineLink() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link
      href="/machine"
      className="machine-launch"
      aria-label="Run Rosencrantz's Wonderful Machine"
    >
      <span className="machine-launch-tip" role="tooltip">
        Run Rosencrantz&rsquo;s Wonderful Machine
      </span>
      <span className="machine-launch-tab">
        <span className="machine-launch-cog" aria-hidden="true">
          ⚙
        </span>
        <span className="machine-launch-word">Machine</span>
      </span>
    </Link>
  );
}
