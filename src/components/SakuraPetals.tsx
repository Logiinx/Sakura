
import React, { useEffect, useRef } from 'react';

interface SakuraPetalProps {
  containerRef: React.RefObject<HTMLDivElement>;
  petalCount?: number;
}

const SakuraPetals: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const petalCount = 15; // Number of petals

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = ''; // Clear any existing petals
    
    // Create petals
    for (let i = 0; i < petalCount; i++) {
      createPetal(container);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  const createPetal = (container: HTMLDivElement) => {
    const petal = document.createElement('div');
    const petalType = Math.floor(Math.random() * 3) + 1; // Random petal type (1-3)
    const speed = Math.random() * 10 + 8; // Random speed (8-18s)
    const startPositionX = Math.random() * window.innerWidth;
    const startPositionY = Math.random() * -100; // Start slightly above viewport
    const delay = Math.random() * 15;
    const rotation = Math.random() * 360;
    
    petal.className = `petal petal-${petalType}`;
    petal.style.left = `${startPositionX}px`;
    petal.style.top = `${startPositionY}px`; // Set initial vertical position
    petal.style.animationDuration = `${speed}s`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.transform = `rotate(${rotation}deg)`;
    
    container.appendChild(petal);
  };
  
  return <div ref={containerRef} className="sakura-petals"></div>;
};

export default SakuraPetals;
