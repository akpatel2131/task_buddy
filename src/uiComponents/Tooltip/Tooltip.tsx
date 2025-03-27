import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styles from './tooltip.module.css';
import clsx from 'clsx';
import { isString } from 'lodash';

interface TooltipProps {
  options:
    | {
        title: string;
        image: string;
        className: string;
      }[]
    | string[];
  onSelect?: (option: string) => void;
  className?: string;
  innerClassName?: {
    trigger?: string;
    tooltipContent?: string;
    option?: string;
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
        onClick={(event) => {
          setIsOpen(!isOpen);
          event.stopPropagation();
        }}
        className={clsx(styles.trigger, innerClassName?.trigger)}
      >
        {children}
      </div>
      {isOpen && (
        <div className={clsx(styles.tooltipContent, innerClassName?.tooltipContent)}>
          {options.map((option, index) => (
            <button
              key={index}
              className={clsx(styles.option, innerClassName?.option, {
                [!isString(option) ? option.className : '']: true,
              })}
              onClick={(event) => {
                if (isString(option)) {
                  handleOptionClick(option);
                } else {
                  handleOptionClick(option.title);
                }
                event.stopPropagation();
              }}
            >
              {isString(option) ? (
                option
              ) : (
                <>
                  <img src={option.image} alt={option.title} />
                  <span className={option.className}>{option.title}</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
