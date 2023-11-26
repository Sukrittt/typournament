import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

function getAnimationSettings(originXA, originXB) {
  return {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 150,
    origin: {
      x: randomInRange(originXA, originXB),
      y: Math.random() - 0.2,
    },
  };
}

export const ConfettiFireWorks = ({ startFireWorks, setStartFireWorks }) => {
  const refAnimationInstance = useRef(null);

  const [fireWorksRunning, setFireWorksRunning] = useState(false);
  const [intervalId, setIntervalId] = useState();

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  const startAnimation = useCallback(() => {
    setFireWorksRunning(true);

    if (!intervalId) {
      setIntervalId(setInterval(nextTickAnimation, 400));
    }
  }, [intervalId, nextTickAnimation]);

  const pauseAnimation = useCallback(() => {
    setFireWorksRunning(false);

    clearInterval(intervalId);
    setIntervalId(null);
  }, [intervalId]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const handleAnimation = useCallback(() => {
    if (!fireWorksRunning && startFireWorks === "start") {
      startAnimation();
    } else if (startFireWorks === "stop") {
      setStartFireWorks(null);
      pauseAnimation();
    }
  }, [
    startFireWorks,
    startAnimation,
    pauseAnimation,
    fireWorksRunning,
    setStartFireWorks,
  ]);

  useEffect(() => {
    handleAnimation();
  }, [handleAnimation, startFireWorks]);

  return <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />;
};
