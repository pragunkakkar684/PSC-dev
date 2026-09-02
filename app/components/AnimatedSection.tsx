'use client';

import { useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function AnimatedSection({
  as: Component = 'section',
  children,
  className = '',
  delay = 0,
  once = true,
  ...props
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { autoAlpha: 0, y: 36, scale: 0.985, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          delay,
          ease: 'power3.out',
          clearProps: 'filter,transform,opacity',
          scrollTrigger: {
            trigger: node,
            start: 'top 88%',
            once,
          },
        }
      );
    }, node);

    return () => ctx.revert();
  }, [delay, once]);

  const ComponentWithRef = Component as any;

  return (
    <ComponentWithRef ref={sectionRef} className={className} {...props}>
      {children}
    </ComponentWithRef>
  );
}
