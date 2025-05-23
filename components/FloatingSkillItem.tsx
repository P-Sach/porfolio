import { useState, useRef, useEffect } from 'react';

interface FloatingSkillItemProps {
  text: string;
  containerWidth: number;
  containerHeight: number;
  index: number;
}

export default function FloatingSkillItem({ text, containerWidth, containerHeight, index }: FloatingSkillItemProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const basePosition = useRef({ x: 0, y: 0 });

  // Initialize with random position
  useEffect(() => {
    if (itemRef.current) {
      const maxX = containerWidth - itemRef.current.offsetWidth;
      const maxY = containerHeight - itemRef.current.offsetHeight;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;
      
      basePosition.current = { x: randomX, y: randomY };
      setPosition({ x: randomX, y: randomY });
    }
  }, [containerWidth, containerHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (itemRef.current && itemRef.current.parentElement) {
      const containerRect = itemRef.current.parentElement.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      setDragOffset({
        x: mouseX - position.x,
        y: mouseY - position.y
      });
      setIsDragging(true);
      cancelAnimationFrame(animationRef.current!);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !itemRef.current || !itemRef.current.parentElement) return;

    const containerRect = itemRef.current.parentElement.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;

    // Constrain movement within container bounds
    const maxX = containerWidth - itemRef.current.offsetWidth;
    const maxY = containerHeight - itemRef.current.offsetHeight;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      basePosition.current = { ...position };
      setIsDragging(false);
      startFloatingAnimation();
    }
  };

  const startFloatingAnimation = () => {
    const amplitude = 15;
    const period = 2000;
    const startTime = Date.now();

    const animate = () => {
      if (!itemRef.current) return;

      const elapsed = Date.now() - startTime;
      const animatedYOffset = Math.sin(elapsed * (2 * Math.PI) / period) * amplitude;

      const maxY = containerHeight - itemRef.current.offsetHeight;
      const newY = Math.max(0, Math.min(basePosition.current.y + animatedYOffset, maxY));

      setPosition(prev => ({
        x: basePosition.current.x,
        y: newY
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!isDragging) {
      startFloatingAnimation();
    }

    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleMouseMoveAny = (e: MouseEvent) => handleMouseMove(e as unknown as React.MouseEvent);
    const handleMouseUpAny = () => handleMouseUp();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveAny);
      window.addEventListener('mouseup', handleMouseUpAny);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveAny);
      window.removeEventListener('mouseup', handleMouseUpAny);
    };
  }, [isDragging, position]);

  return (
    <div
      ref={itemRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: `rotate(${Math.sin(Date.now() / 1000 + index) * 3}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      className="bg-white border-2 border-black rounded-xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      {text}
    </div>
  );
}