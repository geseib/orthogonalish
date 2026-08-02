import Link from "next/link";

import { GuidedStory } from "./guided-story";

export default function Home() {
  return (
    <main>
      <GuidedStory />
      <footer>
        <p>orthogonalish</p>
        <p>Many directions. Very little interference.</p>
        <p>
          <Link href="/machine">
            Turn the handle yourself → Rosencrantz&rsquo;s Dimension Expansion
            Machine
          </Link>
        </p>
      </footer>
    </main>
  );
}
