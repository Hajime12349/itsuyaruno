"use client";

import SettingsButton from "@/components/SettingsButton";
import styles from './Header.module.css';
import { useReducer,useEffect, useState } from "react";
import { usePathname } from 'next/navigation'

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
    const [headerMessage,setHeaderMessage] = useState("Loading")
    const pathname=usePathname()
    useEffect(() => {
        if (pathname === "/timer-working-screen") {
            setHeaderMessage("作業中 | Working state");
        } else if (pathname === "/timer-break-screen") {
            setHeaderMessage("休憩 | Break time");
        } else if (pathname === "/time-finish-screen") {
            setHeaderMessage("終了 | Completed");
        } else {
            setHeaderMessage("いつやるの？ | When will you do it?");
        }
    }, [pathname]);

    return (
        <div className={styles.header}>
            <div className={styles.titleFrame}>
                <div className={styles.titleText}>
                    {headerMessage}
                </div>
            </div>
            <div className={styles.settingsButtonFrame}>
                <SettingsButton />
            </div>
        </div>
    );
}

export default Header;