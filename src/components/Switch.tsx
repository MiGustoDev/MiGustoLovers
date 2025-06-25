import React from 'react';
import './Switch.css';

interface SwitchProps {
  isOn: boolean;
  onClick: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isOn, onClick }) => {
  // Detectar si es mobile para ajustar el desplazamiento del thumb
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const thumbTranslate = isMobile ? 48 : 64; // Ajuste fino para mobile
  return (
    <label
      className={`switch-modern${isOn ? ' switch-on' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 12 }}
    >
      <input type="checkbox" style={{ display: 'none' }} checked={isOn} readOnly />
      <span className="switch-modern-track">
        <span
          className="switch-modern-thumb"
          style={{
            transform: isOn ? 'translateX(0)' : `translateX(${thumbTranslate}px)`,
          }}
        />
        <span
          className={`switch-modern-text${isOn ? ' on' : ''}`}
          style={{
            ...(isOn
              ? { transform: 'translateX(0)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }
              : { transform: 'translateX(-18px)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }
            )
          }}
        >
          WEB
        </span>
      </span>
    </label>
  );
};

export default Switch; 