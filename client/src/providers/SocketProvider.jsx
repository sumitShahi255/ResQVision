import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect to Node.js backend
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('new_disaster', (data) => {
      // Show notification toast
      toast(`🚨 New ${data.disasterType} reported!`, {
        icon: '⚠️',
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#F8FAFC',
          background: '#1E293B',
        },
      });

      // Add to global state
      setNotifications((prev) => [
        { id: Date.now(), type: 'new_disaster', data, read: false },
        ...prev,
      ]);

      // Invalidate relevant queries to fetch fresh data automatically
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, markAsRead, markAllAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};
