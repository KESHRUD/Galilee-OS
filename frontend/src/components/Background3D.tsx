
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
}

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 400; // Density
    
    // Mouse state
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const colorBase = theme === 'galilee' 
        ? ['#06b6d4', '#22d3ee', '#0891b2'] // Cyans
        : ['#6366f1', '#818cf8', '#4f46e5']; // Indigos

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * 2000, // Depth
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: Math.random() * 2 + 0.5, // Speed towards screen
          size: Math.random() * 2,
          color: colorBase[Math.floor(Math.random() * colorBase.length)]
        });
      }
    };

    const draw = () => {
      // Clear with trail effect
      ctx.fillStyle = theme === 'galilee' ? 'rgba(2, 6, 23, 0.3)' : 'rgba(248, 250, 252, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      particles.forEach((p) => {
        // Move particle
        p.z -= p.vz;
        
        // Reset if passed screen
        if (p.z <= 0) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * canvas.width * 2;
          p.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        // Parallax / Perspective calculation
        const perspective = 300 / (300 + p.z);
        const x2d = cx + (p.x + mouseX * 2) * perspective;
        const y2d = cy + (p.y + mouseY * 2) * perspective;
        const size = p.size * perspective * (theme === 'galilee' ? 3 : 5); // Bigger in pro mode

        // Draw
        if (x2d > 0 && x2d < canvas.width && y2d > 0 && y2d < canvas.height) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Connections (optional, creates "constellation" look)
          if (perspective > 0.8) { // Only connect close particles
             particles.forEach(p2 => {
                 if (p === p2) return;
                 const dist = Math.abs(p.z - p2.z);
                 if (dist < 100) {
                      const perspective2 = 300 / (300 + p2.z);
                      const x2d2 = cx + (p2.x + mouseX * 2) * perspective2;
                      const y2d2 = cy + (p2.y + mouseY * 2) * perspective2;
                      const d2 = Math.hypot(x2d - x2d2, y2d - y2d2);
                      if (d2 < 60) {
                          ctx.beginPath();
                          ctx.moveTo(x2d, y2d);
                          ctx.lineTo(x2d2, y2d2);
                          ctx.strokeStyle = theme === 'galilee' 
                            ? `rgba(6, 182, 212, ${0.2 * perspective})` 
                            : `rgba(99, 102, 241, ${0.1 * perspective})`;
                          ctx.lineWidth = 0.5;
                          ctx.stroke();
                      }
                 }
             })
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // Init
    resize();
    createParticles();
    draw();

    // Listeners
    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    const handleMouseMove = (e: MouseEvent) => {
       targetMouseX = (e.clientX - window.innerWidth / 2) * 0.1;
       targetMouseY = (e.clientY - window.innerHeight / 2) * 0.1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
