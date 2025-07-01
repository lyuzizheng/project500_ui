import React, { useEffect, useState } from "react";
import { useApiConfig } from "../contexts/ApiConfigContext";
import type { UserScore } from "../types/Question";
import { getUserScore } from "../utils/api";
import { ScoreChart } from "./ScoreChart";

interface UserStatusProps {
  userId: string;
  onApiKeyChange: (apiKey: string) => void;
  onApiBaseUrlChange?: (apiBaseUrl: string) => void;
}

export const UserStatus: React.FC<UserStatusProps> = ({
  userId,
  onApiKeyChange,
  onApiBaseUrlChange,
}) => {
  const { config, updateApiKey, updateApiBaseUrl } = useApiConfig();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiUrlInput, setShowApiUrlInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempApiBaseUrl, setTempApiBaseUrl] = useState("");


  // 初始化临时状态和检查API Key
  useEffect(() => {
    setTempApiKey(config.apiKey);
    setTempApiBaseUrl(config.apiBaseUrl);

    if (!config.apiKey) {
      setShowApiKeyInput(true);
    }
  }, [config.apiKey, config.apiBaseUrl]);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      updateApiKey(tempApiKey);
      onApiKeyChange(tempApiKey);
      setShowApiKeyInput(false);
    }
  };

  const handleChangeApiKey = () => {
    setTempApiKey(config.apiKey);
    setShowApiKeyInput(true);
  };

  const handleSaveApiUrl = () => {
    if (tempApiBaseUrl.trim()) {
      updateApiBaseUrl(tempApiBaseUrl);
      if (onApiBaseUrlChange) {
        onApiBaseUrlChange(tempApiBaseUrl);
      }
      setShowApiUrlInput(false);
    }
  };

  const handleChangeApiUrl = () => {
    setTempApiBaseUrl(config.apiBaseUrl);
    setShowApiUrlInput(true);
  };

  // 加载用户分数
  const loadUserScore = async () => {
    if (!config.apiKey || !userId) return;

    setLoading(true);
    setError(null);
    try {
      const scores = await getUserScore(userId);
      setUserScore(scores || null);
    } catch (err) {
      setError("加载分数失败");
      console.error("Error loading user score:", err);
    } finally {
      setLoading(false);
    }
  };

  // 当API Key或用户ID变化时重新加载分数
  useEffect(() => {
    loadUserScore();
  }, [config.apiKey, userId]);



  // 初始化时通知父组件API Key
  useEffect(() => {
    if (config.apiKey) {
      onApiKeyChange(config.apiKey);
    }
  }, [config.apiKey, onApiKeyChange]);

  return (
    <div className="user-status-container">
      {showApiKeyInput && (
        <div className="api-key-modal">
          <div className="api-key-content">
            <h3>请输入API Key</h3>
            <p>首次使用需要输入API Key以访问服务器</p>
            <div className="api-key-input-group">
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="请输入API Key"
                className="api-key-input"
                onKeyPress={(e) => e.key === "Enter" && handleSaveApiKey()}
              />
              <button onClick={handleSaveApiKey} className="api-key-submit-btn">
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {showApiUrlInput && (
        <div className="api-key-modal">
          <div className="api-key-content">
            <h3>配置API服务器地址</h3>
            <p>请输入API服务器的完整地址</p>
            <div className="api-key-input-group">
              <input
                type="text"
                value={tempApiBaseUrl}
                onChange={(e) => setTempApiBaseUrl(e.target.value)}
                placeholder="例如: https://server500.actoria.top"
                className="api-key-input"
                onKeyPress={(e) => e.key === "Enter" && handleSaveApiUrl()}
              />
              <button onClick={handleSaveApiUrl} className="api-key-submit-btn">
                确认
              </button>
            </div>
          </div>
        </div>
      )}



      <div className="user-status">
        <div className="user-info">
          <div className="user-info-header">
            <div>
              <h2>用户信息</h2>
              <p className="user-id">用户ID: {userId}</p>
            </div>

          </div>
        </div>

        <div className="score-section">
          <div className="score-display">
            <span className="score-label">当前总分:</span>
            <span className="score-value">
              {userScore !== null && userScore.total_score !== undefined
                ? `${userScore.total_score}分`
                : "未获取"}
            </span>
            <button
              onClick={loadUserScore}
              disabled={loading}
              className="refresh-score-btn"
            >
              {loading ? "获取中..." : "刷新分数"}
            </button>
          </div>

          {/* 坐标轴可视化 */}
          {userScore &&
            (userScore.x_axis_percent !== undefined ||
              userScore.y_axis_percent !== undefined) && (
              <ScoreChart userScore={userScore} />
            )}
        </div>

        <div className="api-info">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <p>API服务器: {config.apiBaseUrl}</p>
            <button onClick={handleChangeApiUrl} className="change-api-key-btn">
              更改服务器
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p>
              API Key:{" "}
              {config.apiKey ? `${config.apiKey.substring(0, 8)}...` : "未设置"}
            </p>
            <button onClick={handleChangeApiKey} className="change-api-key-btn">
              更改API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
