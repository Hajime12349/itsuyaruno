'use client'

import React from 'react';
import { useState } from 'react';
import SettingsButton from '../../../../components/SettingsButton';

const App: React.FC = () => {
    const [count, setCount] = useState(0);

    const handleSettingsClick = () => {
        console.log('Settings button clicked');
        setCount(count + 1);
    };

    return (
        <div>
            <SettingsButton onClick={handleSettingsClick} />
            <p>Clicked: {count}</p>
        </div>
    );
};

export default App;