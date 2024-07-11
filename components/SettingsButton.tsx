'use client'

import Image from 'next/image';
import React from 'react';
import './SettingsButton.css';
import settingsIcon from '@/public/settings-icon.png';

interface SettingsButtonProps {
    onClick?: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick = () => { } }) => {
    return (
        <button className="settings-button" onClick={onClick}>
            <Image src={settingsIcon} alt="Settings" width={64} height={64} />
        </button>
    );
};

export default SettingsButton;