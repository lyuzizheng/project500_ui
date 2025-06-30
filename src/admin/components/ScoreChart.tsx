import React from 'react';

interface ScoreChartProps {
  userScore: any;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ userScore }) => {
  if (!userScore) return null;

  const {
    x_axis_raw = 0,
    y_axis_raw = 0,
    x_axis_percent = 0,
    y_axis_percent = 0,
    x_axis_mapped = 0,
    y_axis_mapped = 0
  } = userScore;

  // 坐标轴范围
  const chartSize = 200;
  const padding = 20;
  const axisLength = chartSize - 2 * padding;

  // 计算点的位置（基于百分比，范围-100到100）
  // 将百分比从0-100转换为-100到100的范围
  const normalizedX = (x_axis_percent - 50) * 2; // 0-100 -> -100到100
  const normalizedY = (y_axis_percent - 50) * 2; // 0-100 -> -100到100
  
  const pointX = padding + ((normalizedX + 100) / 200) * axisLength;
  const pointY = chartSize - padding - ((normalizedY + 100) / 200) * axisLength;

  return (
    <div className="score-chart-container">
      <h3 className="chart-title">坐标轴得分可视化</h3>
      
      {/* SVG 坐标轴图表 */}
      <div className="chart-wrapper">
        <svg width={chartSize} height={chartSize} className="score-chart">
          {/* 背景网格 */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* X轴 */}
          <line 
            x1={padding} 
            y1={chartSize - padding} 
            x2={chartSize - padding} 
            y2={chartSize - padding} 
            stroke="#374151" 
            strokeWidth="2"
          />
          
          {/* Y轴 */}
          <line 
            x1={padding} 
            y1={padding} 
            x2={padding} 
            y2={chartSize - padding} 
            stroke="#374151" 
            strokeWidth="2"
          />
          
          {/* 用户得分点 */}
          <circle 
            cx={pointX} 
            cy={pointY} 
            r="6" 
            fill="#3b82f6" 
            stroke="#1d4ed8" 
            strokeWidth="2"
          />
          
          {/* 中心线 */}
          <line 
            x1={chartSize / 2} 
            y1={padding} 
            x2={chartSize / 2} 
            y2={chartSize - padding} 
            stroke="#d1d5db" 
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line 
            x1={padding} 
            y1={chartSize / 2} 
            x2={chartSize - padding} 
            y2={chartSize / 2} 
            stroke="#d1d5db" 
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          
          {/* 坐标标签 */}
          <text x={padding - 5} y={chartSize - padding + 15} fontSize="12" fill="#6b7280" textAnchor="middle">-100</text>
          <text x={chartSize / 2} y={chartSize - padding + 15} fontSize="12" fill="#6b7280" textAnchor="middle">0</text>
          <text x={chartSize - padding} y={chartSize - padding + 15} fontSize="12" fill="#6b7280" textAnchor="middle">100</text>
          <text x={padding - 15} y={chartSize - padding + 5} fontSize="12" fill="#6b7280" textAnchor="middle">-100</text>
          <text x={padding - 15} y={chartSize / 2 + 5} fontSize="12" fill="#6b7280" textAnchor="middle">0</text>
          <text x={padding - 15} y={padding + 5} fontSize="12" fill="#6b7280" textAnchor="middle">100</text>
          
          {/* 轴标签 */}
          <text x={chartSize / 2} y={chartSize - 5} fontSize="14" fill="#374151" textAnchor="middle" fontWeight="bold">X轴</text>
          <text x={10} y={chartSize / 2} fontSize="14" fill="#374151" textAnchor="middle" fontWeight="bold" transform={`rotate(-90, 10, ${chartSize / 2})`}>Y轴</text>
        </svg>
      </div>
      
      {/* 数据详情 */}
      <div className="score-details">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">原始坐标:</span>
            <span className="detail-value">({x_axis_raw}, {y_axis_raw})</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">标准化坐标:</span>
            <span className="detail-value">({normalizedX.toFixed(1)}, {normalizedY.toFixed(1)})</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">百分比:</span>
            <span className="detail-value">({x_axis_percent}%, {y_axis_percent}%)</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">映射值:</span>
            <span className="detail-value">({x_axis_mapped}, {y_axis_mapped})</span>
          </div>
        </div>
      </div>
    </div>
  );
};