import React from "react";

interface UserScoreChartProps {
  userScore?: {
    x_axis_raw?: number;
    y_axis_raw?: number;
    x_axis_percent?: number;
    y_axis_percent?: number;
    x_axis_mapped?: number;
    y_axis_mapped?: number;
  };
}

export const UserScoreChart: React.FC<UserScoreChartProps> = ({
  userScore,
}) => {
  // 解构用户得分数据
  const { x_axis_percent = 50, y_axis_percent = 50 } = userScore || {};

  // 坐标轴配置
  const chartSize = 320;
  const padding = 40;
  const axisLength = chartSize - 2 * padding;

  // 计算点的位置（基于百分比，范围-100到100）
  const normalizedX = (x_axis_percent - 50) * 2; // 0-100 -> -100到100
  const normalizedY = (y_axis_percent - 50) * 2; // 0-100 -> -100到100

  const pointX = padding + ((normalizedX + 100) / 200) * axisLength;
  const pointY = chartSize - padding - ((normalizedY + 100) / 200) * axisLength;

  return (
    <div className="user-score-chart-container">
      <div className="chart-header">
        <h2 className="chart-title">您的重庆人身份坐标</h2>
        <p className="chart-subtitle">
          基于您的回答，我们为您绘制了专属的身份坐标图
        </p>
      </div>

      {/* SVG 坐标轴图表 */}
      <div className="chart-wrapper">
        <svg width={chartSize} height={chartSize} className="user-score-chart">
          {/* 渐变定义 */}
          <defs>
            {/* 背景渐变 */}
            <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>

            {/* 网格图案 */}
            <pattern
              id="userGrid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
                opacity="0.6"
              />
            </pattern>

            {/* 用户点的渐变 */}
            <radialGradient id="userPointGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            {/* 用户点的阴影 */}
            <filter id="userPointShadow">
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="3"
                floodColor="#000"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          {/* 背景 */}
          <rect width="100%" height="100%" fill="url(#backgroundGradient)" />
          <rect width="100%" height="100%" fill="url(#userGrid)" />

          {/* 象限背景色 */}
          <rect
            x={padding}
            y={padding}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="rgba(34, 197, 94, 0.05)"
          />
          <rect
            x={padding + axisLength / 2}
            y={padding}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="rgba(59, 130, 246, 0.05)"
          />
          <rect
            x={padding}
            y={padding + axisLength / 2}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="rgba(168, 85, 247, 0.05)"
          />
          <rect
            x={padding + axisLength / 2}
            y={padding + axisLength / 2}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="rgba(239, 68, 68, 0.05)"
          />

          {/* X轴 */}
          <line
            x1={padding}
            y1={chartSize - padding}
            x2={chartSize - padding}
            y2={chartSize - padding}
            stroke="#475569"
            strokeWidth="3"
          />

          {/* X轴箭头 */}
          <polygon
            points={`${chartSize - padding + 8},${chartSize - padding} ${
              chartSize - padding - 4
            },${chartSize - padding - 4} ${chartSize - padding - 4},${
              chartSize - padding + 4
            }`}
            fill="#475569"
          />

          {/* Y轴 */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartSize - padding}
            stroke="#475569"
            strokeWidth="3"
          />

          {/* Y轴箭头 */}
          <polygon
            points={`${padding},${padding - 8} ${padding - 4},${padding + 4} ${
              padding + 4
            },${padding + 4}`}
            fill="#475569"
          />

          {/* 中心线 */}
          <line
            x1={chartSize / 2}
            y1={padding}
            x2={chartSize / 2}
            y2={chartSize - padding}
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="8,4"
            opacity="0.7"
          />
          <line
            x1={padding}
            y1={chartSize / 2}
            x2={chartSize - padding}
            y2={chartSize / 2}
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="8,4"
            opacity="0.7"
          />

          {/* 用户得分点 */}
          <circle
            cx={pointX}
            cy={pointY}
            r="12"
            fill="url(#userPointGradient)"
            stroke="#d97706"
            strokeWidth="3"
            filter="url(#userPointShadow)"
          />

          {/* 用户点的脉冲动画环 */}
          <circle
            cx={pointX}
            cy={pointY}
            r="12"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values="12;20;12"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* 坐标刻度和标签 */}
          {/* X轴刻度 */}
          <text
            x={padding}
            y={chartSize - padding + 20}
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            fontWeight="500"
          >
            -100
          </text>
          <text
            x={chartSize / 2}
            y={chartSize - padding + 20}
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            fontWeight="500"
          >
            0
          </text>
          <text
            x={chartSize - padding}
            y={chartSize - padding + 20}
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            fontWeight="500"
          >
            100
          </text>

          {/* Y轴刻度 */}
          <text
            x={padding - 20}
            y={chartSize - padding + 5}
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            fontWeight="500"
          >
            -100
          </text>
          <text
            x={padding - 20}
            y={chartSize / 2 + 5}
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            fontWeight="500"
          >
            0
          </text>
          <text
            x={padding - 20}
            y={padding + 5}
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            fontWeight="500"
          >
            100
          </text>

          {/* 轴标签 */}
          <text
            x={chartSize / 2}
            y={chartSize - 8}
            fontSize="16"
            fill="#1e293b"
            textAnchor="middle"
            fontWeight="bold"
          >
            传统 ← → 现代
          </text>
          <text
            x={15}
            y={chartSize / 2}
            fontSize="16"
            fill="#1e293b"
            textAnchor="middle"
            fontWeight="bold"
            transform={`rotate(-90, 15, ${chartSize / 2})`}
          >
            保守 ← → 开放
          </text>
        </svg>
      </div>

      {/* 坐标轴说明 */}
      <div className="axis-explanation">
        <div className="axis-info">
          <div className="axis-item">
            <h3 className="axis-title">横轴：传统 ↔ 现代</h3>
            <p className="axis-description">
              反映您对传统文化与现代生活方式的态度倾向。左侧代表更偏向传统价值观，右侧代表更拥抱现代理念。
            </p>
          </div>
          <div className="axis-item">
            <h3 className="axis-title">纵轴：保守 ↔ 开放</h3>
            <p className="axis-description">
              体现您的性格特质和行为方式。下方代表相对保守稳重，上方代表更加开放活跃。
            </p>
          </div>
        </div>
      </div>

      {/* 用户位置说明 */}
      <div className="user-position">
        <div className="position-card">
          <div className="position-header">
            <div className="position-icon">📍</div>
            <h3 className="position-title">您的位置</h3>
          </div>
          <div className="position-content">
            <div className="coordinate-display">
              <span className="coordinate-label">坐标：</span>
              <span className="coordinate-value">
                ({normalizedX.toFixed(1)}, {normalizedY.toFixed(1)})
              </span>
            </div>
            <div className="position-description">
              <p>
                您位于坐标系的
                <strong className="highlight">
                  {normalizedX > 0 ? "现代" : "传统"}
                  {normalizedY > 0 ? "开放" : "保守"}
                </strong>
                象限，这表明您是一个
                <strong className="highlight">
                  {normalizedX > 0 && normalizedY > 0 && "现代开放型"}
                  {normalizedX > 0 && normalizedY <= 0 && "现代稳重型"}
                  {normalizedX <= 0 && normalizedY > 0 && "传统活跃型"}
                  {normalizedX <= 0 && normalizedY <= 0 && "传统保守型"}
                </strong>
                的重庆人。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserScoreChart;
