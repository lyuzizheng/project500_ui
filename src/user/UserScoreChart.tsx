import React from "react";

interface UserScoreChartProps {
  userScore?: {
    user_id?: string;
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
  const chartSize = 280;
  const padding = 8;
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
        <p className="chart-subtitle">基于您的体验我们为您绘制了身份坐标图</p>
      </div>

      {/* SVG 坐标轴图表 */}
      <div className="chart-wrapper">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          className="user-score-chart"
        >
          {/* 渐变定义 */}
          <defs>
            {/* 背景渐变 */}
            <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5f1eb" />
              <stop offset="100%" stopColor="#e8ddd0" />
            </radialGradient>

            {/* 网格图案 */}
            <pattern
              id="userGrid"
              width={axisLength / 10}
              height={axisLength / 10}
              patternUnits="userSpaceOnUse"
              x={padding}
              y={padding}
            >
              <path
                d={`M ${axisLength / 10} 0 L 0 0 0 ${axisLength / 10}`}
                fill="none"
                stroke="#c4b59a"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </pattern>

            {/* 用户点的渐变 */}
            <radialGradient id="userPointGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#b8956a" />
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

          {/* 网格区域 - 只在坐标轴区域显示 */}
          <rect
            x={padding}
            y={padding}
            width={axisLength}
            height={axisLength}
            fill="url(#userGrid)"
          />

          {/* 象限背景色 */}
          <rect
            x={padding}
            y={padding}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="#f0e6d2"
            opacity="0.1"
          />
          <rect
            x={padding + axisLength / 2}
            y={padding}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="#e8ddd0"
            opacity="0.1"
          />
          <rect
            x={padding}
            y={padding + axisLength / 2}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="#ede2d0"
            opacity="0.1"
          />
          <rect
            x={padding + axisLength / 2}
            y={padding + axisLength / 2}
            width={axisLength / 2}
            height={axisLength / 2}
            fill="#e6dac8"
            opacity="0.1"
          />

          {/* X轴 - 水平穿过中心 */}
          <line
            x1={padding}
            y1={chartSize / 2}
            x2={chartSize - padding}
            y2={chartSize / 2}
            stroke="#a0845c"
            strokeWidth="2.5"
          />

          {/* X轴左箭头 */}
          <polygon
            points={`${padding - 8},${chartSize / 2} ${padding + 4},${
              chartSize / 2 - 4
            } ${padding + 4},${chartSize / 2 + 4}`}
            fill="#a0845c"
          />

          {/* X轴右箭头 */}
          <polygon
            points={`${chartSize - padding + 8},${chartSize / 2} ${
              chartSize - padding - 4
            },${chartSize / 2 - 4} ${chartSize - padding - 4},${
              chartSize / 2 + 4
            }`}
            fill="#a0845c"
          />

          {/* Y轴 - 垂直穿过中心 */}
          <line
            x1={chartSize / 2}
            y1={padding}
            x2={chartSize / 2}
            y2={chartSize - padding}
            stroke="#a0845c"
            strokeWidth="2.5"
          />

          {/* Y轴上箭头 */}
          <polygon
            points={`${chartSize / 2},${padding - 8} ${chartSize / 2 - 4},${
              padding + 4
            } ${chartSize / 2 + 4},${padding + 4}`}
            fill="#a0845c"
          />

          {/* Y轴下箭头 */}
          <polygon
            points={`${chartSize / 2},${chartSize - padding + 8} ${
              chartSize / 2 - 4
            },${chartSize - padding - 4} ${chartSize / 2 + 4},${
              chartSize - padding - 4
            }`}
            fill="#a0845c"
          />

          {/* 轴标签 */}
          <text
            x={chartSize - 15}
            y={chartSize / 2 - 10}
            fontSize="12"
            fill="#8b7355"
            textAnchor="end"
            fontWeight="500"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            实际重庆人
          </text>
          <text
            x={chartSize / 2 - 10}
            y={padding + 10}
            fontSize="12"
            fill="#8b7355"
            textAnchor="end"
            fontWeight="500"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            精神重庆人
          </text>

          {/* 象限标签 */}
          <text
            x={chartSize / 2 + axisLength / 4}
            y={chartSize / 2 - axisLength / 4 + 5}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            实际重庆人
          </text>
          <text
            x={chartSize / 2 + axisLength / 4}
            y={chartSize / 2 - axisLength / 4 + 18}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            精神重庆人
          </text>

          <text
            x={chartSize / 2 - axisLength / 4}
            y={chartSize / 2 - axisLength / 4 + 5}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            实际非重庆人
          </text>
          <text
            x={chartSize / 2 - axisLength / 4}
            y={chartSize / 2 - axisLength / 4 + 18}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            精神重庆人
          </text>

          <text
            x={chartSize / 2 - axisLength / 4}
            y={chartSize / 2 + axisLength / 4 + 5}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            实际非重庆人
          </text>
          <text
            x={chartSize / 2 - axisLength / 4}
            y={chartSize / 2 + axisLength / 4 + 18}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            精神非重庆人
          </text>

          <text
            x={chartSize / 2 + axisLength / 4}
            y={chartSize / 2 + axisLength / 4 + 5}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            实际重庆人
          </text>
          <text
            x={chartSize / 2 + axisLength / 4}
            y={chartSize / 2 + axisLength / 4 + 18}
            fontSize="10"
            fill="#9d8a6b"
            textAnchor="middle"
            fontWeight="400"
            fontFamily="'LXGW WenKai', 'KaiTi', '楷体', serif"
          >
            精神非重庆人
          </text>

          {/* 用户得分点 */}
          <circle
            cx={pointX}
            cy={pointY}
            r="6"
            fill="url(#userPointGradient)"
            stroke="#ffffff"
            strokeWidth="1.5"
            filter="url(#dropShadow)"
          />

          {/* 用户点的脉冲动画环 */}
          <circle
            cx={pointX}
            cy={pointY}
            r="8"
            fill="none"
            stroke="#d4a574"
            strokeWidth="1.5"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="6;12;6"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* 坐标轴说明 */}
      <div className="axis-explanation">
        <div className="axis-description-single">
          <p className="axis-description-text">
            此坐标轴基于您的答案百分比动态计算生成。横轴代表
            <strong>实际重庆人指数</strong>（生活经历与地域认同），纵轴代表
            <strong>精神重庆人指数</strong>（文化认同与情感归属）。
            网格从-5到5划分为10个单位，您的位置会随着更多人参与答题而动态调整，反映您在所有参与者中的相对位置。
          </p>
        </div>
      </div>

      {/* 用户位置说明 */}
      <div className="user-position">
        <div className="position-card">
          <div className="position-header">
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
                  {normalizedX > 0 ? "实际重庆人" : "实际非重庆人"}，
                  {normalizedY > 0 ? "精神重庆人" : "精神非重庆人"}
                </strong>
                象限，这表明您是一个
                <strong className="highlight">
                  {normalizedX > 0 &&
                    normalizedY > 0 &&
                    "实际重庆人，精神重庆人"}
                  {normalizedX > 0 &&
                    normalizedY <= 0 &&
                    "实际重庆人，精神非重庆人"}
                  {normalizedX <= 0 &&
                    normalizedY > 0 &&
                    "实际非重庆人，精神重庆人"}
                  {normalizedX <= 0 &&
                    normalizedY <= 0 &&
                    "实际非重庆人，精神非重庆人"}
                </strong>
                的身份。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserScoreChart;
