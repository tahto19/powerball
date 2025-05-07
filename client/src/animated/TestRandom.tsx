//@ts-nocheck
import React, { useState, useEffect } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomChar() {
    return characters[Math.floor(Math.random() * characters.length)];
}

function DecryptText({ text, isRunning }) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (!isRunning) return;

        let interval = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split('')
                    .map((char, i) =>
                        Math.random() > 0.5 ? randomChar() : char
                    )
                    .join('')
            );
        }, 100); // adjust for speed

        return () => clearInterval(interval);
    }, [text, isRunning]);

    return <div style={{ fontFamily: 'monospace' }}>{displayText}</div>;
}

export default function App() {
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div>
            <DecryptText text="Hello World!" isRunning={isRunning} />
            <button onClick={() => setIsRunning(true)}>Start</button>
            <button onClick={() => setIsRunning(false)}>Stop</button>
        </div>
    );
}