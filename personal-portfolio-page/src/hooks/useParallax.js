import { useEffect, useRef, useState } from 'react';

export const useParallax = (speed = 0.5, direction = 'vertical') => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const relativeScroll = scrollY - elementTop + window.innerHeight;
      
      if (direction === 'vertical') {
        setOffset(relativeScroll * speed);
      } else if (direction === 'horizontal') {
        setOffset(relativeScroll * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, offset };
};

export const useParallaxMouse = (intensity = 20) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / rect.width * intensity;
      const y = (e.clientY - centerY) / rect.height * intensity;
      
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return { ref, position };
};
