import React, { useEffect, useState } from 'react';

export default function Notification({ message, visible, onClose, bgColor }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    if (visible) {
      setShow(true);
      timer = setTimeout(() => {
        setShow(false); // Begin hiding notification
        setTimeout(() => onClose(), 500); // Wait for animation to finish before closing
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [visible, onClose]);

  if (!visible && !show) return null;

  const notiStyle = {
    position: 'fixed',
    top: 20,
    right: 20,
    background: bgColor || 'green',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'opacity 0.5s, transform 0.5s',
    opacity: show ? 1 : 0,
    transform: show ? 'translateX(0)' : 'translateX(100%)',
    zIndex: 9999,
  };

  return (
    <div style={notiStyle}>
      {message}
    </div>
  );
}