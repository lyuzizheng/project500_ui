import React, { useState, useEffect } from 'react';
import './components.css';

interface HealthCheckProps {
  onHealthStatusChange?: (isHealthy: boolean) => void;
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking';
  services?: {
    postgres?: string;
    redis?: string;
  };
  timestamp?: string;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({ onHealthStatusChange }) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({ status: 'checking' });
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkHealth = async () => {
    setHealthStatus({ status: 'checking' });
    
    try {
      const response = await fetch('https://server500.actoria.top/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.code === 0) {
        setHealthStatus({
          status: 'healthy',
          services: data.data?.services,
          timestamp: data.data?.timestamp
        });
        onHealthStatusChange?.(true);
      } else {
        setHealthStatus({ status: 'unhealthy' });
        onHealthStatusChange?.(false);
      }
    } catch (error) {
      console.error('健康检查失败:', error);
      setHealthStatus({ status: 'unhealthy' });
      onHealthStatusChange?.(false);
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkHealth();
    // 每30秒自动检查一次
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return '🟢';
      case 'unhealthy':
        return '🔴';
      case 'checking':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getStatusText = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return '系统正常';
      case 'unhealthy':
        return '系统异常';
      case 'checking':
        return '检查中...';
      default:
        return '未知状态';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="health-check-container">
      <div 
        className={`health-check-status ${healthStatus.status}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="status-main">
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{getStatusText()}</span>
          <button 
            className="refresh-btn"
            onClick={(e) => {
              e.stopPropagation();
              checkHealth();
            }}
            disabled={healthStatus.status === 'checking'}
          >
            🔄
          </button>
        </div>
        
        {lastChecked && (
          <div className="last-checked">
            最后检查: {formatTime(lastChecked)}
          </div>
        )}
      </div>

      {isExpanded && healthStatus.status === 'healthy' && healthStatus.services && (
        <div className="health-details">
          <h4>服务状态详情</h4>
          <div className="service-list">
            {Object.entries(healthStatus.services).map(([service, status]) => (
              <div key={service} className="service-item">
                <span className="service-name">{service}:</span>
                <span className={`service-status ${status}`}>
                  {status === 'healthy' ? '🟢 正常' : '🔴 异常'}
                </span>
              </div>
            ))}
          </div>
          {healthStatus.timestamp && (
            <div className="server-timestamp">
              服务器时间: {new Date(healthStatus.timestamp).toLocaleString('zh-CN')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};