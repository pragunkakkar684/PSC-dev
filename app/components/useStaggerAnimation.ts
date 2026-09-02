'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useStaggerAnimation<T extends HTMLElement>(selector?: string) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const targets = selector ? node.querySelectorAll(selector) : node.children;
    if (!targets || targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: node,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, node);

    return () => ctx.revert();
  }, [selector]);

  return ref;
}
