import React from "react";
import "./HorizontalBarChart.css";

interface BarSegment {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: BarSegment[];
  height?: number;
  title?: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  height = 40,
  title,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="horizontal-bar-chart">
      {title && (
        <div className="chart-title-header">
          <h3 className="chart-question-title">{title}</h3>
        </div>
      )}
      <div className="bar-container" style={{ height: `${height}px` }}>
        {data.map((segment, index) => {
          const width = total > 0 ? (segment.value / total) * 100 : 0;

          return (
            <div
              key={index}
              className="bar-segment"
              style={{
                width: `${width}%`,
                backgroundColor: segment.color,
                height: "100%",
              }}
              title={`${segment.label}: ${segment.percentage}%`}
            />
          );
        })}
      </div>

      <div className="bar-legend">
        {data.map((segment, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: segment.color }}
            />
            <span className="legend-text">{segment.label}</span>
            <span className="legend-percentage">{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
