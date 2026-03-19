import { useEffect, useRef } from 'react';

type ParticleFieldProps = {
  active: boolean;
  dense?: boolean;
  warm?: boolean;
  prismatic?: boolean;
  burst?: boolean;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  alpha: number;
  hueOffset: number;
};

export function ParticleField({
  active,
  dense = false,
  warm = false,
  prismatic = false,
  burst = false,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return undefined;
    }

    let frameId = 0;
    let width = 0;
    let height = 0;
    const particleCount = prismatic ? 168 : dense ? 104 : 42;
    const particles: Particle[] = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.floor(width * window.devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * window.devicePixelRatio));
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const spawnParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (prismatic ? 3.4 : dense ? 2.4 : 1.9) + 0.7,
      speedX: (Math.random() - 0.5) * (prismatic ? 0.9 : burst ? 0.62 : 0.36),
      speedY: Math.random() * (prismatic ? -1.2 : burst ? -0.76 : -0.42) - 0.05,
      alpha: Math.random() * (prismatic ? 0.75 : 0.65) + 0.15,
      hueOffset: Math.random(),
    });

    resize();
    window.addEventListener('resize', resize);

    for (let index = 0; index < particleCount; index += 1) {
      particles.push(spawnParticle());
    }

    const render = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const driftScale = active ? (burst ? 1.5 : 1) : 0.4;
        particle.x += particle.speedX * driftScale;
        particle.y += particle.speedY * driftScale;

        if (particle.y < -10 || particle.x < -10 || particle.x > width + 10) {
          particles[index] = {
            ...spawnParticle(),
            y: height + 6,
          };
        }

        context.globalAlpha = particle.alpha * (active ? 1 : 0.4);
        if (prismatic) {
          const hue = 360 * particle.hueOffset + performance.now() * 0.02;
          context.fillStyle = `hsla(${hue}, 95%, 72%, 0.95)`;
          context.shadowBlur = burst ? 20 : 14;
          context.shadowColor = `hsla(${hue}, 100%, 70%, 0.9)`;
        } else {
          context.fillStyle = warm ? 'rgba(255, 213, 141, 0.88)' : 'rgba(159, 224, 255, 0.86)';
          context.shadowBlur = burst ? 14 : 8;
          context.shadowColor = warm ? 'rgba(255, 213, 141, 0.72)' : 'rgba(159, 224, 255, 0.68)';
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [active, burst, dense, prismatic, warm]);

  return <canvas aria-hidden="true" className="effect-particle-field" ref={canvasRef} />;
}
