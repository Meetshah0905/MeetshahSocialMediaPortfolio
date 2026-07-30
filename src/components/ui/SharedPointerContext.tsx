"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type PointerPos = {
  x: number;
  y: number;
};

const SharedPointerContext = createContext<PointerPos>({ x: -1000, y: -1000 });

export function SharedPointerProvider({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState<PointerPos>({ x: -1000, y: -1000 });

  useEffect(() => {
    let animationFrameId: number | null = null;
    let pendingX = -1000;
    let pendingY = -1000;

    const handlePointerMove = (e: PointerEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          setPos({ x: pendingX, y: pendingY });
          animationFrameId = null;
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <SharedPointerContext.Provider value={pos}>
      {children}
    </SharedPointerContext.Provider>
  );
}

export function useSharedPointer() {
  return useContext(SharedPointerContext);
}
