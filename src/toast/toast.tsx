import React, { useEffect, useState } from 'react';
import './toast.css';

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, onClose }) => {
  const [shouldClose, setShouldClose] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldClose(false);  // Reset the close flag
      setTimeout(() => {
        setShouldClose(true);  // Set to true to start exit animation
        setTimeout(onClose, 1000);  // Adjust time to match animation duration
      }, 3000);  // Visible for 3 seconds then start to close
    }
  }, [show, onClose]);

  return (
    <div className={`toast ${show ? 'show' : ''}`} style={{ 
      display: show ? 'block' : 'none', 
      animation: `${shouldClose ? 'slideOutLeft 1s' : 'slideInRight 0.6s'}` 
    }}>
      {message}
    </div>
  );
}

export default Toast;
