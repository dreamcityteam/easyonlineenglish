import React, { useEffect, useRef } from 'react';

const ConfettiAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles: any[] = [];
    const numParticles = 200;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        radius: Math.random() * 5 + 2,
        color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        }
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
        ctx.fill();
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x > W || particle.x < 0) {
          particle.velocity.x *= -1;
        }
        if (particle.y > H || particle.y < 0) {
          particle.velocity.y *= -1;
        }
      });
      requestAnimationFrame(draw);
    };

    draw();
    // @ts-ignore
    return () => cancelAnimationFrame(draw);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 3 }} />;
};

export default ConfettiAnimation;
