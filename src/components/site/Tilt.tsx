'use client';

import { useRef } from 'react';

/** Tilts its content a few degrees toward the mouse. Does nothing on touch screens. */
export default function Tilt({ children, max = 5, className = '' }: { children: React.ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const set = (rx: number, ry: number) => {
    ref.current?.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    ref.current?.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const box = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        set(-y * max * 2, x * max * 2);
      }}
      onPointerLeave={() => set(0, 0)}
    >
      {children}
    </div>
  );
}
