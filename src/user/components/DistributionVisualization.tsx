import React from "react";
import "./DistributionVisualization.css";
import HorizontalBarChart from "./HorizontalBarChart";
import {
  getDisplayOption,
  getDisplayTitle,
  hasOptionMapping,
} from "./QuestionDisplayMapping";

interface QuestionMetadata {
  description: string;
  type: string;
  scoring?: string;
  format?: string;
  store_field?: string;
}

interface QuestionData {
  type: string;
  total_responses: number;
  response_rate: string;
  answer_distribution?: Record<string, number>;
  score_distribution?: Record<string, number>;
  ranking_distribution?: Record<string, { count: number; score_range: string }>;
  vote_distribution?: Record<
    string,
    { votes: number; percentage: number; rank: number }
  >;
  coordinate_stats?: {
    center_point: { x: number; y: number };
    distance_distribution: Record<string, number>;
    score_statistics: {
      highest_score: number;
      lowest_score: number;
      average_value: number;
    };
  };
  value_stats?: {
    min_value: number;
    max_value: number;
    average_value: number;
    median_value: number;
    current_average?: number;
    weight_source?: string;
    highest_score?: number;
    lowest_score?: number;
    distribution?: Record<string, number>;
  };
  average_score?: number;
  winner?: string;
  is_weight_source?: boolean;
  affects_questions?: string[];
  dependency_weight?: string;
  metadata: QuestionMetadata;
}

interface DistributionData {
  total_questions: number;
  total_participants: number;
  questions: Record<string, unknown>;
  dependencies: Record<string, string[]>;
  generated_at: string;
}

interface DistributionVisualizationProps {
  distributionData: DistributionData;
}

// "看看大家"部分的题目ID
const MAIN_QUESTIONS = ["a1", "q2", "a2", "b1", "c2", "o2", "o3", "o4"];

// "其他的环节呢？"部分的题目ID
const OTHER_QUESTIONS = {
  distributions: ["d", "k", "r"], // 展示分布
  averages: ["f", "i", "l"], // 展示平均数
};

const DistributionVisualization: React.FC<DistributionVisualizationProps> = ({
  distributionData,
}) => {
  // 过滤出"看看大家"部分的题目
  const mainQuestions = Object.entries(distributionData.questions)
    .filter(([questionId]) => MAIN_QUESTIONS.includes(questionId))
    .map(
      ([questionId, questionData]) =>
        [questionId, questionData as QuestionData] as const
    )
    .sort(([a], [b]) => {
      const aIndex = MAIN_QUESTIONS.indexOf(a);
      const bIndex = MAIN_QUESTIONS.indexOf(b);
      return aIndex - bIndex;
    });

  // 过滤出"其他的环节呢？"部分的题目
  const otherDistributionQuestions = Object.entries(distributionData.questions)
    .filter(([questionId]) =>
      OTHER_QUESTIONS.distributions.includes(questionId)
    )
    .map(
      ([questionId, questionData]) =>
        [questionId, questionData as QuestionData] as const
    )
    .sort(([a], [b]) => {
      const aIndex = OTHER_QUESTIONS.distributions.indexOf(a);
      const bIndex = OTHER_QUESTIONS.distributions.indexOf(b);
      return aIndex - bIndex;
    });

  const otherAverageQuestions = Object.entries(distributionData.questions)
    .filter(([questionId]) => OTHER_QUESTIONS.averages.includes(questionId))
    .map(
      ([questionId, questionData]) =>
        [questionId, questionData as QuestionData] as const
    )
    .sort(([a], [b]) => {
      const aIndex = OTHER_QUESTIONS.averages.indexOf(a);
      const bIndex = OTHER_QUESTIONS.averages.indexOf(b);
      return aIndex - bIndex;
    });

  // 渲染横向分布图
  const renderHorizontalDistribution = (
    questionData: QuestionData,
    questionId: string
  ) => {
    let data: Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
    }> = [];

    const colors = [
      "#8b6914",
      "#5d4e37",
      "#a0845c",
      "#d4a574",
      "#9d8a6b",
      "#8b7355",
      "#b8956a",
      "#c4a373",
    ];

    // 根据数据类型处理不同的分布
    if (questionData.answer_distribution) {
      const total = Object.values(questionData.answer_distribution).reduce(
        (sum, count) => sum + count,
        0
      );
      data = Object.entries(questionData.answer_distribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6) // 最多显示6个选项
        .map(([answer, count], index) => {
          // 使用传入的questionId
          const displayLabel = hasOptionMapping(questionId)
            ? getDisplayOption(questionId, answer)
            : answer.length > 8
            ? answer.substring(0, 8) + "..."
            : answer;

          return {
            label: displayLabel,
            value: count,
            percentage: parseFloat(((count / total) * 100).toFixed(1)),
            color: colors[index % colors.length],
          };
        });
    } else if (questionData.score_distribution) {
      const total = Object.values(questionData.score_distribution).reduce(
        (sum, count) => sum + count,
        0
      );
      data = Object.entries(questionData.score_distribution)
        .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
        .map(([score, count], index) => ({
          label: `${score}分`,
          value: count,
          percentage: parseFloat(((count / total) * 100).toFixed(1)),
          color: colors[index % colors.length],
        }));
    } else if (questionData.ranking_distribution) {
      data = Object.entries(questionData.ranking_distribution)
        .sort(([a], [b]) => {
          const rankA = parseInt(a.replace("rank_", ""));
          const rankB = parseInt(b.replace("rank_", ""));
          return rankA - rankB;
        })
        .slice(0, 5)
        .map(([rank, rankData], index) => {
          const rankNumber = rank.replace("rank_", "");
          const count = rankData.count as number;
          const percentage = parseFloat(
            ((count / distributionData.total_participants) * 100).toFixed(1)
          );
          return {
            label: `第${rankNumber}名`,
            value: count,
            percentage,
            color: colors[index % colors.length],
          };
        });
    } else if (questionData.vote_distribution) {
      data = Object.entries(questionData.vote_distribution)
        .sort(([, a], [, b]) => b.votes - a.votes)
        .slice(0, 6) // 最多显示6个选项
        .map(([option, voteData], index) => {
          const displayLabel = hasOptionMapping(questionId)
            ? getDisplayOption(questionId, option)
            : option.length > 8
            ? option.substring(0, 8) + "..."
            : option;

          return {
            label: displayLabel,
            value: voteData.votes,
            percentage: parseFloat(voteData.percentage.toFixed(1)),
            color: colors[index % colors.length],
          };
        });
    }

    if (data.length === 0) return null;

    // 使用用户友好的标题
    const displayTitle = getDisplayTitle(
      questionId,
      questionData.metadata.description
    );
    return <HorizontalBarChart data={data} height={40} title={displayTitle} />;
  };

  // 渲染平均数显示
  const renderAverageDisplay = (
    questionData: QuestionData,
    questionId: string
  ) => {
    let stats: {
      min: number;
      max: number;
      average: number;
      median: number;
    } | null = null;
    let unit = "";

    // 从不同的数据源获取统计数据
    if (questionId === "o2" && questionData.metadata) {
      // o2题目使用metadata中的数据
      const metadata = questionData.metadata as QuestionMetadata & {
        min_years?: number;
        max_years?: number;
        average_years?: number;
      };
      stats = {
        min: metadata.min_years || 0,
        max: metadata.max_years || 0,
        average: metadata.average_years || 0,
        median: questionData.value_stats?.median_value || 0,
      };
      unit = "年";
    } else if (questionId === "o3" && questionData.metadata) {
      // o3题目使用metadata中的消费金额数据
      const metadata = questionData.metadata as QuestionMetadata & {
        min_amount?: number;
        max_amount?: number;
        average_amount?: number;
      };
      stats = {
        min: metadata.min_amount || 0,
        max: metadata.max_amount || 0,
        average: metadata.average_amount || 0,
        median: questionData.value_stats?.median_value || 0,
      };
      unit = "元";
    } else if (questionId === "o4" && questionData.metadata) {
      // o4题目使用metadata中的游客数量数据
      const metadata = questionData.metadata as QuestionMetadata & {
        min_count?: number;
        max_count?: number;
        average_count?: number;
      };
      stats = {
        min: metadata.min_count || 0,
        max: metadata.max_count || 0,
        average: metadata.average_count || 0,
        median: questionData.value_stats?.median_value || 0,
      };
      unit = "人";
    } else if (questionData.value_stats) {
      stats = {
        min: questionData.value_stats.min_value,
        max: questionData.value_stats.max_value,
        average: questionData.value_stats.average_value,
        median: questionData.value_stats.median_value,
      };
      // 根据题目类型设置单位
      if (questionId === "f") {
        unit = "次";
      } else if (questionId === "i") {
        unit = "次";
      } else if (questionId === "l") {
        unit = "次";
      } else if (questionId === "o3") {
        unit = "元";
      }
    } else if (questionData.average_score !== undefined) {
      // 如果只有平均分，创建简化的统计
      stats = {
        min: 0,
        max: 0,
        average: questionData.average_score,
        median: 0,
      };
      unit = "分";
    } else if (questionData.coordinate_stats?.score_statistics) {
      const coordStats = questionData.coordinate_stats.score_statistics;
      stats = {
        min: coordStats.lowest_score || 0,
        max: coordStats.highest_score || 0,
        average: coordStats.average_value,
        median: 0, // 坐标统计没有中位数
      };
    }

    if (!stats) return null;

    const displayTitle = getDisplayTitle(
      questionId,
      questionData.metadata.description
    );

    // o2, o3, o4题目特殊显示：不显示中位数，放在一行，平均值高亮
    if (questionId === "o2" || questionId === "o3" || questionId === "o4") {
      return (
        <div className="horizontal-bar-chart">
          <div className="chart-title-header">
            <h3 className="chart-question-title">{displayTitle}</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '4px', color: '#8b6914', fontWeight: '600' }}>最小值</div>
              <div style={{ color: '#5d4e37', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.min}{unit}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '4px', color: '#8b6914', fontWeight: '600' }}>最大值</div>
              <div style={{ color: '#5d4e37', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.max}{unit}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '4px', color: '#8b6914', fontWeight: '600' }}>平均值</div>
              <div><span className="stat-value highlight"><strong>{stats.average.toFixed(2)}{unit}</strong></span></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="horizontal-bar-chart">
        <div className="chart-title-header">
          <h3 className="chart-question-title">{displayTitle}</h3>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">最小值</span>
            <span className="stat-value">
              {stats.min}
              {unit}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最大值</span>
            <span className="stat-value">
              {stats.max}
              {unit}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">平均值</span>
            <span className="stat-value highlight">
              {stats.average.toFixed(2)}
              {unit}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">中位数</span>
            <span className="stat-value">
              {stats.median}
              {unit}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 智能渲染函数，根据数据类型选择合适的渲染方式
  const renderQuestionCard = (
    questionData: QuestionData,
    questionId: string
  ) => {
    // 如果有value_stats且是weighted_average类型，使用平均数显示
    if (questionData.type === "weighted_average" && questionData.value_stats) {
      return renderAverageDisplay(questionData, questionId);
    }
    // 否则使用横向分布图
    return renderHorizontalDistribution(questionData, questionId);
  };

  return (
    <div className="distribution-visualization">
      {/* 看看大家 section */}
      <h2 className="section-title">看看大家</h2>
      <div className="questions-grid">
        {mainQuestions.map(([questionId, questionData]) => (
          <div key={questionId} className="question-card">
            {renderQuestionCard(questionData, questionId)}
          </div>
        ))}
      </div>

      {/* 其他的环节呢？ section */}
      <h2 className="section-title">其他的环节呢？</h2>

      {/* 分布图显示 */}
      <div className="questions-grid">
        {otherDistributionQuestions.map(([questionId, questionData]) => (
          <div key={questionId} className="question-card">
            {renderHorizontalDistribution(questionData, questionId)}
          </div>
        ))}
      </div>

      {/* 平均数显示 */}
      <div className="averages-grid">
        {otherAverageQuestions.map(([questionId, questionData]) => (
          <div key={questionId} className="question-card">
            {renderAverageDisplay(questionData, questionId)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionVisualization;
