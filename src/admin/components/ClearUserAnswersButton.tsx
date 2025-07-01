import React, { useState } from "react";
import { useApiConfig } from "../contexts/ApiConfigContext";

interface ClearUserAnswersButtonProps {
  userId: string;
  onClearSuccess?: () => void;
}

export const ClearUserAnswersButton: React.FC<ClearUserAnswersButtonProps> = ({
  userId,
  onClearSuccess,
}) => {
  const { config } = useApiConfig();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const handleClearUserAnswers = async () => {
    if (!config.apiKey) {
      alert("请先设置API Key");
      return;
    }

    setClearLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/answers/clear/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 显示服务器响应的message作为浏览器弹窗
      if (result.message) {
        alert(result.message);
      }

      // 调用成功回调
      if (onClearSuccess) {
        onClearSuccess();
      }

      setShowClearConfirm(false);
    } catch (error) {
      console.error("清除用户答案失败:", error);
      alert("清除用户答案失败，请检查网络连接和API配置");
    } finally {
      setClearLoading(false);
    }
  };

  return (
    <div className="clear-user-answers-container">
      <button
        onClick={() => setShowClearConfirm(true)}
        className="clear-user-btn"
        disabled={!config.apiKey}
      >
        🗑️ 清除此用户答案
      </button>

      {/* 确认对话框 */}
      {showClearConfirm && (
        <div className="clear-confirm-overlay">
          <div className="clear-confirm-dialog">
            <div className="clear-confirm-icon">⚠️</div>
            <h3>确认清除用户答案</h3>
            <p>您确定要清除用户 <strong>{userId}</strong> 的所有答案数据吗？</p>
            <p className="clear-confirm-warning">此操作不可撤销！</p>
            <div className="clear-confirm-buttons">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="cancel-btn"
                disabled={clearLoading}
              >
                取消
              </button>
              <button
                onClick={handleClearUserAnswers}
                className="danger-btn"
                disabled={clearLoading}
              >
                {clearLoading ? "清除中..." : "确认清除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};