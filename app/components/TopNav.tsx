import styles from './TopNav.module.css';

export default function TopNav() {
    return (
        <nav className={styles.topNav}>
            <div className={styles.navLeft}>
                <div className={styles.logo}>💪</div>
                <h1 className={styles.pageTitle}>Workout App</h1>
            </div>
            <div className={styles.navRight}>
                <a href="/" className={styles.navLink}>Home</a>
                <a href="/cardio" className={styles.navLink}>Cardio</a>
                <a href="/strength" className={styles.navLink}>Strength</a>
                <a href="/nutrition" className={styles.navLink}>Nutrition</a>
            </div>
        </nav>
    )
}