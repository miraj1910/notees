"use client";

import { useState, useEffect } from "react";

export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const visual = window.visualViewport;
    if (!visual) return;

    const handle = () => {
      const diff = window.innerHeight - visual.height;
      setHeight(diff > 100 ? diff : 0);
    };

    visual.addEventListener("resize", handle);
    visual.addEventListener("scroll", handle);
    return () => {
      visual.removeEventListener("resize", handle);
      visual.removeEventListener("scroll", handle);
    };
  }, []);

  return height;
}
