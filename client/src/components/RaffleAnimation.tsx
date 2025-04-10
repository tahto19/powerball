//@ts-nocheck
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./RaffleBalls.css";

const balls = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const getRandomDirection = () => Math.random() < 0.5 ? -1 : 1;

const LotteryBalls = () => {
    const [winningBall, setWinningBall] = useState(null);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const winner = balls[Math.floor(Math.random() * balls.length)];
            setWinningBall(winner);
            setIsRunning(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="raffle-container">
            {balls.map((num) => {
                const dirX = getRandomDirection();
                const dirY = getRandomDirection();
                const distance = 150 + Math.random() * 100;

                return (
                    <motion.div
                        key={num}
                        className={`raffle-ball ${winningBall === num ? "winning" : ""}`}
                        initial={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                        }}
                        animate={
                            isRunning
                                ? {
                                    x: [0, dirX * distance],
                                    y: [0, dirY * distance],
                                }
                                : { x: 0, y: 0 }
                        }
                        transition={{
                            repeat: isRunning ? Infinity : 0,
                            repeatType: "reverse",
                            duration: 0.5 + Math.random() * 0.3,
                            ease: "easeInOut",
                        }}
                    >
                        {num}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default LotteryBalls;