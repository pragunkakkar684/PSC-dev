'use client';
import { useEffect, type ReactNode } from 'react';

export default function RevealProvider({
  children,
  delay,
}: {
  children?: ReactNode;
  delay?: number;
}) {
  useEffect(() => {
    const prepareElements = () => {
      document.querySelectorAll('main > section, main > article').forEach((element) => {
        element.setAttribute('data-reveal', '');
      });

      document
        .querySelectorAll('main article, main [class~="border"][class~="bg-white"]')
        .forEach((element, index) => {
          element.classList.add('motion-card');
          if (!element.hasAttribute('data-reveal')) {
            element.setAttribute('data-reveal', '');
          }
          element.setAttribute('data-reveal-delay', String((index % 4) + 1));
        });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const observeAll = () => {
      prepareElements();
      document.querySelectorAll('[data-reveal]:not(.reveal-visible)').forEach((el) => {
        io.observe(el);
      });
    };

    observeAll();

    // Catch elements that render later (route changes, client fetches, etc.)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  if (!children) return null;

  return (
    <div
      data-reveal
      style={delay === undefined ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}