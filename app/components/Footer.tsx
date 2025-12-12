import styles from './Footer.module.css';
export default function Footer() {
    return (
        <footer className={`footer ${styles.footer}`}>
            <p>© 2026 Workout App. All rights reserved.</p>
        </footer>
    );
}