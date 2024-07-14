import SettingsButton from "@/components/SettingsButton";
import styles from './Header.module.css';
import { useReducer } from "react";

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <div className={styles.header}>
            <div className={styles.titleFrame}>
                <div className={styles.titleText}>
                    いつやるの？  |  When will you do it?
                </div>
            </div>
            <div className={styles.settingsButtonFrame}>
                <SettingsButton />
            </div>
        </div>
    );
}

export default Header;