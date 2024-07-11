import SettingsButton from "@/components/SettingsButton";
import styles from './Header.module.css';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <div className={styles.header}>
            <div className={styles.title_frame}>
                <div className={styles.titleText}>
                    いつやるの?
                </div>
            </div>
            <div className={styles.settingsButtonFrame}>
                <SettingsButton />
            </div>
        </div>
    );
}

export default Header;