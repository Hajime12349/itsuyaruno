"use client"

import React from 'react';
import { useState } from 'react';
import Header from '@/components/Header';

const App: React.FC = () => {
    const [count, setCount] = useState(0);

    const handleSettingsButtonClick = () => {
        setCount(count + 1);
    };

    return <Header />;
};

export default App; 
