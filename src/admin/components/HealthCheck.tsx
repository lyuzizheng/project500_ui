import React, { useEffect, useState } from "react";
import { useApiConfig } from "../contexts/ApiConfigContext";
import "./components.css";

interface HealthCheckProps {
  onHealthStatusChange?: (isHealthy: boolean) => void;
}

interface HealthStatus {
  status: "healthy" | "unhealthy" | "checking" | "unknown";
  services?: {
    postgres?: string;
    redis?: string;
  };
  timestamp?: string;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({
  onHealthStatusChange,
}) => {
  const { config } = useApiConfig();
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: "unknown",
  });

  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setHealthStatus({ status: "checking" });

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        setHealthStatus({
          status: "healthy",
          services: data.data?.services,
          timestamp: data.data?.timestamp,
        });
        onHealthStatusChange?.(true);
      } else {
        setHealthStatus({ status: "unhealthy" });
        onHealthStatusChange?.(false);
      }
    } catch (error) {
      console.error("健康检查失败:", error);
      setHealthStatus({ status: "unhealthy" });
      onHealthStatusChange?.(false);
    }

    setLastChecked(new Date());
  };

  useEffect(() => {
    checkHealth();
    // 每30秒自动检查一次
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthStatus.status) {
      case "healthy":
        return "🟢";
      case "unhealthy":
        return "🔴";
      case "checking":
        return "🟡";
      default:
        return "⚪";
    }
  };

  const getStatusText = () => {
    switch (healthStatus.status) {
      case "healthy":
        return "系统正常";
      case "unhealthy":
        return "系统异常";
      case "checking":
        return "检查中...";
      default:
        return "未知状态";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="health-check-compact">
      <div className={`health-status-badge ${healthStatus.status}`}>
        <div className="status-content">
          <span className="status-indicator">{getStatusIcon()}</span>
          <div className="status-info">
            <span className="status-label">{getStatusText()}</span>
            {lastChecked && (
              <span className="last-check-time">{formatTime(lastChecked)}</span>
            )}
          </div>
          <button
            onClick={checkHealth}
            className="btn btn-ghost btn-sm refresh-button"
            disabled={healthStatus.status === "checking"}
            title="刷新状态"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
