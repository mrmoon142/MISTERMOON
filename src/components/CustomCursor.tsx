import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'pointer' | 'glass-card' | 'input'>('default');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position refs for 60fps smooth animation frame interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorRingPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices that support hover
    const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isPointerFine) return;

    setEnabled(true);

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractiveGlass = target.closest(
        '.glass-card, [data-glass-card], .glassmorphism, [class*="border-amber"], [class*="border-cyan"], .portfolio-card, [class*="rounded-3xl"]'
      );
      const isInput = target.closest('input, textarea, [contenteditable="true"]');
      const isClickable = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], select, label'
      );

      if (isInteractiveGlass && isClickable) {
        setHoverState('glass-card');
      } else if (isInput) {
        setHoverState('input');
      } else if (isClickable) {
        setHoverState('pointer');
      } else if (isInteractiveGlass) {
        setHoverState('glass-card');
      } else {
        setHoverState('default');
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Ring follows mouse with smooth inertia
      cursorRingPos.current.x = lerp(cursorRingPos.current.x, mousePos.current.x, 0.18);
      cursorRingPos.current.y = lerp(cursorRingPos.current.y, mousePos.current.y, 0.18);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cursorRingPos.current.x}px, ${cursorRingPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!enabled) return null;

  // Compute ring size and styling based on hover state
  let ringSize = 'w-8 h-8';
  let ringBorder = 'border-amber-400/40';
  let ringBg = 'bg-amber-400/5';
  let ringGlow = 'shadow-[0_0_12px_rgba(212,175,55,0.2)]';

  if (hoverState === 'glass-card') {
    ringSize = 'w-14 h-14';
    ringBorder = 'border-amber-300/80';
    ringBg = 'bg-amber-400/15 backdrop-blur-[1px]';
    ringGlow = 'shadow-[0_0_25px_rgba(212,175,55,0.45),inset_0_0_15px_rgba(212,175,55,0.2)]';
  } else if (hoverState === 'pointer') {
    ringSize = 'w-11 h-11';
    ringBorder = 'border-cyan-400/70';
    ringBg = 'bg-cyan-400/10';
    ringGlow = 'shadow-[0_0_18px_rgba(6,182,212,0.35)]';
  } else if (hoverState === 'input') {
    ringSize = 'w-6 h-10 rounded-sm';
    ringBorder = 'border-cyan-400/80';
    ringBg = 'bg-transparent';
    ringGlow = 'shadow-[0_0_10px_rgba(6,182,212,0.3)]';
  }

  return (
    <div
      id="mistermoon-custom-cursor"
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer Interpolated Luxury Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-[width,height,background-color,border-color,box-shadow,transform] duration-200 ease-out will-change-transform flex items-center justify-center ${ringSize} ${ringBorder} ${ringBg} ${ringGlow} ${
          isMouseDown ? 'scale-75' : 'scale-100'
        }`}
      >
        {hoverState === 'glass-card' && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-60" />
        )}
      </div>

      {/* Inner Precision Point */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full will-change-transform transition-transform duration-75 ${
          hoverState === 'glass-card'
            ? 'bg-amber-300 shadow-[0_0_8px_#fde047]'
            : hoverState === 'pointer'
            ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]'
            : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
        } ${isMouseDown ? 'scale-50' : 'scale-100'}`}
      />
    </div>
  );
};
