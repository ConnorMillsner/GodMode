import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.status}>
          <div className={styles.statusIndicator}></div>
          <span>SYSTEM ACTIVE</span>
        </div>
        <h1 className={styles.title}>CONTROL PANEL</h1>
        <div className={styles.timestamp}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }).toUpperCase()}
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.metrics}>
          <div className={styles.metric}>
            <div className={styles.metricValue}>94</div>
            <div className={styles.metricLabel}>EFFICIENCY</div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricValue}>7</div>
            <div className={styles.metricLabel}>ACTIVE TASKS</div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricValue}>12</div>
            <div className={styles.metricLabel}>COMPLETED</div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricValue}>3</div>
            <div className={styles.metricLabel}>PRIORITY ITEMS</div>
          </div>
        </section>

        <section className={styles.tasks}>
          <h2 className={styles.sectionTitle}>PRIORITY QUEUE</h2>
          <div className={styles.taskList}>
            <div className={styles.task}>
              <div className={styles.taskPriority}>HIGH</div>
              <div className={styles.taskContent}>
                <div className={styles.taskTitle}>SYSTEM OPTIMIZATION</div>
                <div className={styles.taskMeta}>DUE: TODAY | EST: 2H</div>
              </div>
            </div>
            <div className={styles.task}>
              <div className={styles.taskPriority}>MED</div>
              <div className={styles.taskContent}>
                <div className={styles.taskTitle}>DATABASE MAINTENANCE</div>
                <div className={styles.taskMeta}>DUE: TOMORROW | EST: 4H</div>
              </div>
            </div>
            <div className={styles.task}>
              <div className={styles.taskPriority}>LOW</div>
              <div className={styles.taskContent}>
                <div className={styles.taskTitle}>DOCUMENTATION UPDATE</div>
                <div className={styles.taskMeta}>DUE: THIS WEEK | EST: 1H</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.actions}>
          <h2 className={styles.sectionTitle}>QUICK ACTIONS</h2>
          <div className={styles.actionGrid}>
            <button className={styles.actionButton}>
              <span className={styles.actionLabel}>DEPLOY</span>
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionLabel}>MONITOR</span>
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionLabel}>ANALYZE</span>
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionLabel}>BACKUP</span>
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerSection}>
          <span className={styles.footerLabel}>LAST UPDATE</span>
          <span className={styles.footerValue}>2 MIN AGO</span>
        </div>
        <div className={styles.footerSection}>
          <span className={styles.footerLabel}>VERSION</span>
          <span className={styles.footerValue}>2.1.4</span>
        </div>
        <div className={styles.footerSection}>
          <span className={styles.footerLabel}>UPTIME</span>
          <span className={styles.footerValue}>99.9%</span>
        </div>
      </footer>
    </div>
  );
}
