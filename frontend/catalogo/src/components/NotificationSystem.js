// NotificationSystem.js - Sistema de notificaciones reutilizable
import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listener para eventos de notificación
    const handleNotification = (event) => {
      addNotification(event.detail);
    };

    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  const addNotification = ({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, type, title, message };

    setNotifications(prev => [...prev, newNotification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      default: // info
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  return (
    <div className="notification-container">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`notification notification-${notif.type}`}
        >
          <div className="notification-icon">
            {getIcon(notif.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">{notif.title}</div>
            {notif.message && (
              <div className="notification-message">{notif.message}</div>
            )}
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notif.id)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div className="notification-progress">
            <div className="notification-progress-bar"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Función helper para mostrar notificaciones desde cualquier componente
export const showNotification = ({ type = 'info', title, message, duration = 5000 }) => {
  const event = new CustomEvent('showNotification', {
    detail: { type, title, message, duration }
  });
  window.dispatchEvent(event);
};

export default NotificationSystem;