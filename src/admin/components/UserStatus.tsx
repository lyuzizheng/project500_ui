import React from 'react';
import './components.css';

interface UserStatusProps {
  userId: string;
  userScore: number | null;
  loadingScore: boolean;
  onRefreshScore: () => void;
}

function UserStatus({
  userId,
  userScore,
  loadingScore,
  onRefreshScore,
}: UserStatusProps) {
  return (
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
      </div>
    </div>
  );
}

export default UserStatus;