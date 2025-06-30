import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ApiConfig {
  apiBaseUrl: string;
  apiKey: string;
}

interface ApiConfigContextType {
  config: ApiConfig;
  updateApiBaseUrl: (url: string) => void;
  updateApiKey: (key: string) => void;
}

const ApiConfigContext = createContext<ApiConfigContextType | undefined>(undefined);

export const useApiConfig = () => {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
};

interface ApiConfigProviderProps {
  children: ReactNode;
}

export const ApiConfigProvider: React.FC<ApiConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ApiConfig>({
    apiBaseUrl: localStorage.getItem('api_base_url') || 'https://server500.actoria.top',
    apiKey: localStorage.getItem('api_key') || ''
  });

  const updateApiBaseUrl = (url: string) => {
    localStorage.setItem('api_base_url', url);
    setConfig(prev => ({ ...prev, apiBaseUrl: url }));
  };

  const updateApiKey = (key: string) => {
    localStorage.setItem('api_key', key);
    setConfig(prev => ({ ...prev, apiKey: key }));
  };

  // 监听 localStorage 变化（用于跨标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'api_base_url' && e.newValue) {
        setConfig(prev => ({ ...prev, apiBaseUrl: e.newValue! }));
      }
      if (e.key === 'api_key' && e.newValue) {
        setConfig(prev => ({ ...prev, apiKey: e.newValue! }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ApiConfigContext.Provider value={{ config, updateApiBaseUrl, updateApiKey }}>
      {children}
    </ApiConfigContext.Provider>
  );
};