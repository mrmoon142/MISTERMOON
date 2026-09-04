import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulseOffset: number;
}

export const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    // Cap DPR at 1.5 to maximize 60fps performance on all devices
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Interactive mouse state with smooth coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 150,
      isHovered: false,
      rippleX: -1000,
      rippleY: -1000,
      rippleRadius: 0,
      rippleActive: false,
    };

    // Calculate optimal particle count based on screen width
    const particleCount = Math.min(65, Math.max(30, Math.floor(width / 22)));
    const particles: Particle[] = [];

    const palette = [
      { fill: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' }, // Cyber Amber
      { fill: '#FBBF24', glow: 'rgba(251, 191, 36, 0.4)' }, // Electric Gold
      { fill: '#06B6D4', glow: 'rgba(6, 182, 212, 0.5)' },  // Cyber Cyan
      { fill: '#38BDF8', glow: 'rgba(56, 189, 248, 0.4)' }, // Neon Blue
      { fill: '#E2E8F0', glow: 'rgba(226, 232, 240, 0.3)' }, // Starlight White
    ];

    for (let i = 0; i < particleCount; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2.2 + 0.8;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size,
        baseSize: size,
        alpha: Math.random() * 0.5 + 0.3,
        color: col.fill,
        glowColor: col.glow,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Interactive Listeners
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.isHovered = true;
      }
    };

    const onLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.rippleX = e.clientX - rect.left;
      mouse.rippleY = e.clientY - rect.top;
      mouse.rippleRadius = 10;
      mouse.rippleActive = true;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchend', onLeave);
    window.addEventListener('click', onClick, { passive: true });

    let tick = 0;
    const maxDistance = 115;
    const maxDistSq = maxDistance * maxDistance;

    const render = () => {
      tick++;

      // Smooth mouse interpolation (lerp)
      if (mouse.isHovered) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Shockwave ripple expansion
      if (mouse.rippleActive) {
        mouse.rippleRadius += 4.5;
        if (mouse.rippleRadius > 220) {
          mouse.rippleActive = false;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Physics & drift update
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Wrap boundaries
          if (p.x < -15) p.x = width + 15;
          else if (p.x > width + 15) p.x = -15;
          if (p.y < -15) p.y = height + 15;
          else if (p.y > height + 15) p.y = -15;
        }

        // Mouse interactive physics
        if (mouse.isHovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            // Gentle interactive push & size flare
            p.x -= Math.cos(angle) * force * 2.2;
            p.y -= Math.sin(angle) * force * 2.2;
            p.size = p.baseSize * (1 + force * 1.2);
          } else {
            p.size = p.baseSize;
          }
        }

        // Ripple reaction
        if (mouse.rippleActive) {
          const rdx = mouse.rippleX - p.x;
          const rdy = mouse.rippleY - p.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          if (Math.abs(rDist - mouse.rippleRadius) < 30) {
            const push = (30 - Math.abs(rDist - mouse.rippleRadius)) / 30;
            const angle = Math.atan2(rdy, rdx);
            p.x -= Math.cos(angle) * push * 3;
            p.y -= Math.sin(angle) * push * 3;
          }
        }
      }

      // Draw constellation network lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Interactive connector lines to cursor
        if (mouse.isHovered) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles with pulsing cyber core
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.15;
        const currentAlpha = Math.max(0.1, Math.min(0.9, p.alpha + pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // Draw ripple ring if active
      if (mouse.rippleActive) {
        ctx.beginPath();
        ctx.arc(mouse.rippleX, mouse.rippleY, mouse.rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, 0.4 - mouse.rippleRadius / 250)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchend', onLeave);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      id="hero-particles-canvas-wrapper"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
      {/* Subtle ambient cyber gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
