import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
}

export const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 12 : 25;
    const generated: Particle[] = [];

    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        left: `${Math.random() * 100}vw`,
        size: `${Math.random() * 4 + 2}px`,
        duration: `${Math.random() * 15 + 10}s`,
        delay: `${Math.random() * 15}s`,
      });
    }

    setParticles(generated);
  }, []);

  return (
    <div className="bg-particles" id="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
export default ParticleBackground;
