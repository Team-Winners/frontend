import { useEffect, useRef} from 'react';
import type {RefObject} from 'react'

type Handler = (event: MouseEvent | TouchEvent) => void;

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  handler: Handler,
  active: boolean = true
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, active]);

  return ref;
};
