import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  options: string[] | { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  style,
  className,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const getLabel = () => {
    const found = options.find(opt => 
      typeof opt === 'string' ? opt === value : opt.value === value
    );
    if (!found) return value;
    return typeof found === 'string' ? found : found.label;
  };

  return (
    <div 
      ref={containerRef} 
      className={`custom-dropdown-container ${className || ''}`}
      style={{ 
        position: 'relative', 
        width: '100%', 
        zIndex: isOpen ? 50 : 1, 
        ...style 
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        className="form-select custom-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          textAlign: 'left',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundImage: 'none', /* Disable native background image arrow */
          paddingRight: '12px', /* Restore normal padding */
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          borderRadius: '8px',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 4px 16px -4px rgba(27, 42, 75, 0.08)',
          color: 'var(--text-primary)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 20px)' }}>{getLabel()}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            color: 'var(--accent-gold)',
            flexShrink: 0,
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div 
          className="custom-dropdown-menu fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            ...(align === 'right' ? {
              right: 0,
              left: 'auto',
              minWidth: '150px',
            } : {
              left: 0,
              right: 0,
            }),
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.92))',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            borderRadius: '12px',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.65), 0 12px 36px -4px rgba(27, 42, 75, 0.14), 0 4px 12px -2px rgba(27, 42, 75, 0.06)',
            zIndex: 1000,
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '6px 0'
          }}
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            const isSelected = val === value;

            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelect(val)}
                className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: 'calc(100% - 12px)',
                  textAlign: 'left',
                  margin: '2px 6px',
                  padding: '9px 12px',
                  background: isSelected ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
                  color: isSelected ? 'var(--accent-gold)' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.93rem',
                  fontFamily: 'var(--font-primary)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? '700' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{label}</span>
                {isSelected && (
                  <span 
                    style={{ 
                      width: '5px', 
                      height: '5px', 
                      borderRadius: '50%', 
                      background: 'var(--accent-gold)',
                      display: 'inline-block'
                    }} 
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
