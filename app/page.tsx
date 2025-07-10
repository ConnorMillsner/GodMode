import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>ChadGPT</h1>
          <p className={styles.subtitle}>Upload your face to see mog score</p>
          <p className={styles.description}>
            Get an AI-powered analysis of your appearance with personalized looksmaxxing suggestions
          </p>
          
          <Link href="/upload" className={styles.uploadButton}>
            Get Your Mog Score
          </Link>
        </div>
      </main>
    </div>
  );
}
