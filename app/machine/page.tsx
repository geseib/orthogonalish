import Link from "next/link";

import { DimensionMachine } from "./dimension-machine";
import styles from "./machine.module.css";

export default function MachinePage() {
  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/">
        ← Back to the story
      </Link>

      <header className={styles.pageHeader}>
        <h1>Rosencrantz&rsquo;s Dimension Expansion Machine</h1>
        <p className={styles.subtitle}>
          Set the geometry and read the estimated number of nearly orthogonal
          directions.
        </p>
      </header>

      <DimensionMachine />
    </main>
  );
}
