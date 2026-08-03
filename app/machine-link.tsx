"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A persistent launcher for the Dimension Expansion Machine. Mounted at the
// top level (in the layout, beside the music control) so it floats above the
// full-screen story instead of being trapped in the story's stacking context.
// Only shown on the home route — on /machine itself it would be redundant.
export function MachineLink() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link href="/machine" className="machine-launch">
      <span aria-hidden="true">⚙</span> The Machine
    </Link>
  );
}
