import React, { useState, useRef, useEffect } from 'react';
import styles from './tooltip.module.css';
import clsx from 'clsx';

interface TooltipProps {
  options: string[];
  onSelect?: (option: string) => void;
  className?: string;
  innerClassName?: {
    trigger?: string;
    tooltipContent?: string;
  };
  children: React.ReactNode;
}

export default function Tooltip({
  options,
  onSelect,
  className,
  children,
  innerClassName,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option: string) => {
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div className={clsx(styles.tooltipContainer, className)} ref={tooltipRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(styles.trigger, innerClassName?.trigger)}
      >
        {children}
      </div>
      {isOpen && (
        <div className={clsx(styles.tooltipContent, innerClassName?.tooltipContent)}>
          {options.map((option, index) => (
            <button key={index} className={styles.option} onClick={() => handleOptionClick(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
