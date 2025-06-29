import React, { useState, useEffect } from 'react';

interface UserStatusProps {
  userId: string;
  userScore: number | null;
  loadingScore: boolean;
  onRefreshScore: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

export const UserStatus: React.FC<UserStatusProps> = ({
  userId,
  userScore,
  loadingScore,
  onRefreshScore,
  onApiKeyChange,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // 从localStorage加载API Key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('api_key', apiKey.trim());
      setShowApiKeyInput(false);
      onApiKeyChange(apiKey.trim());
    }
  };

  const handleChangeApiKey = () => {
    setShowApiKeyInput(true);
  };

  // 初始化时通知父组件API Key
  useEffect(() => {
    if (apiKey) {
      onApiKeyChange(apiKey);
    }
  }, [apiKey, onApiKeyChange]);

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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入API Key"
                className="api-key-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
              />
              <button onClick={handleSaveApiKey} className="api-key-submit-btn">
                确认
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="user-status">
        <div className="user-info">
          <h2>用户信息</h2>
          <p className="user-id">用户ID: {userId}</p>
        </div>

        <div className="score-section">
          <div className="score-display">
            <span className="score-label">当前总分:</span>
            <span className="score-value">
              {userScore !== null ? `${userScore}分` : "未获取"}
            </span>
            <button
              onClick={onRefreshScore}
              disabled={loadingScore}
              className="refresh-score-btn"
            >
              {loadingScore ? "获取中..." : "刷新分数"}
            </button>
          </div>
        </div>

        <div className="api-info">
          <p>API服务器: https://server500.actoria.top</p>
          <button onClick={handleChangeApiKey} className="change-api-key-btn">
            更改API Key
          </button>
        </div>
      </div>
    </div>
  );
};
