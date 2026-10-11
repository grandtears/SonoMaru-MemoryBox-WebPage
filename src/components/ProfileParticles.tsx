import { useEffect, useRef } from 'react';
import './Jellyfish.css';

export default function ProfileParticles({ jellyfish = false }: { jellyfish?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles = Array.from({ length: jellyfish ? 12 : 35 }, () => ({
      x: Math.random(), y: Math.random(),
      size: 7 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.00006,
      vy: (Math.random() - 0.5) * 0.00012,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let animationTime = 0;

    const draw = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 40) : 0;
      previousTime = time;
      if (!motion.matches) animationTime += elapsed;
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        if (!motion.matches) {
          particle.x += particle.vx * elapsed * (jellyfish ? 0.35 : 1);
          particle.y += (jellyfish ? -0.000025 : particle.vy) * elapsed;
          if (jellyfish && particle.y < -0.3) particle.y = 1.2;
          if (particle.x < 0 || particle.x > 1) {
            particle.x = Math.max(0, Math.min(1, particle.x));
            particle.vx *= -1;
          }
          if (!jellyfish && (particle.y < 0 || particle.y > 1)) {
            particle.y = Math.max(0, Math.min(1, particle.y));
            particle.vy *= -1;
          }
        }
        if (jellyfish) {
          const phase = animationTime * 0.0015 + particle.phase;
          const radius = particle.size * (1 + Math.sin(phase) * 0.1);
          context.save();
          context.translate(particle.x * width + Math.sin(phase * 0.7) * 8, particle.y * height);
          context.rotate(Math.sin(phase * 0.5) * 0.12);
          context.shadowColor = 'rgba(155,220,255,0.6)';
          context.shadowBlur = 8;
          const glow = context.createRadialGradient(0, -radius * 0.3, 0, 0, 0, radius);
          glow.addColorStop(0, 'rgba(225,235,255,0.45)');
          glow.addColorStop(1, 'rgba(170,210,255,0.08)');
          context.fillStyle = glow;
          context.strokeStyle = 'rgba(200,225,255,0.45)';
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(-radius, 0);
          context.bezierCurveTo(-radius, -radius * 1.4, radius, -radius * 1.4, radius, 0);
          context.quadraticCurveTo(0, radius * 0.35, -radius, 0);
          context.fill();
          context.stroke();
          for (let strand = -2; strand <= 2; strand++) {
            const x = strand * radius * 0.3;
            const sway = Math.sin(phase + strand * 0.6) * radius * 0.45;
            context.beginPath();
            context.moveTo(x, radius * 0.08);
            context.bezierCurveTo(x + sway, radius * 0.7, x - sway, radius * 1.2, x + sway * 0.5, radius * 1.8);
            context.stroke();
          }
          context.restore();
          continue;
        }
        context.beginPath();
        context.arc(particle.x * width, particle.y * height, 1.5, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255,255,255,0.65)';
        context.fill();
      }
      for (let i = 0; !jellyfish && i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot((a.x - b.x) * width, (a.y - b.y) * height);
          if (distance >= 110) continue;
          context.beginPath();
          context.moveTo(a.x * width, a.y * height);
          context.lineTo(b.x * width, b.y * height);
          context.strokeStyle = `rgba(255,255,255,${(1 - distance / 110) * 0.22})`;
          context.stroke();
        }
      }
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      draw(0);
    };
    const observer = new ResizeObserver(() => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      restart();
    });
    observer.observe(canvas);
    motion.addEventListener('change', restart);
    document.addEventListener('visibilitychange', restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', restart);
      document.removeEventListener('visibilitychange', restart);
    };
  }, [jellyfish]);

  if (jellyfish) return <div className="jellyfish-field" aria-hidden="true">
    {Array.from({ length: 9 }, (_, index) => (
      <div className="jellyfish-drifter" key={index} style={{
        left: `${6 + index * 10.5}%`,
        top: `${22 + (index % 3) * 22}%`,
        animationDelay: `${-index * 2.7}s`,
        animationDuration: `${15 + index % 4 * 3}s`,
      }}>
        <svg className="jellyfish-body" width={32 + index % 3 * 7} viewBox="0 0 60 68" fill="none">
          <path d="M17 36C10 45 23 48 17 57M30 38C23 48 37 52 30 62M43 36C36 45 49 48 43 57"
            stroke={['#a9e9f4', '#dbbaff', '#ffc5dd'][index % 3]} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7 32C7 1 53 1 53 32Q53 40 45 36Q38 43 30 37Q22 43 15 36Q7 40 7 32Z"
            stroke={['#a9e9f4', '#dbbaff', '#ffc5dd'][index % 3]} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
    ))}
  </div>;

  return <canvas ref={canvasRef} aria-hidden="true" style={{
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0,
    borderRadius: '8px',
  }} />;
}
