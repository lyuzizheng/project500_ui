import type { Question } from "../types/Question";
import "./components.css";

interface QuestionSectionProps {
  questions: Question[];
  answers: { [key: string]: string };
  submittedQuestions: Set<string>;
  submittingQuestions: Set<string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onQuestionSubmit: (questionId: string) => Promise<void>;
}

function QuestionSection({
  questions,
  answers,
  submittedQuestions,
  submittingQuestions,
  onAnswerChange,
  onQuestionSubmit,
}: QuestionSectionProps) {
  // 渲染不同类型的输入组件
  const renderQuestionInput = (question: Question) => {
    const value = answers[question.id] || "";

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={
              question.id === "c3" ? "例如: 25年6月" : `请输入${question.title}`
            }
            className="question-input"
          />
        );

      case "number":
        if (question.id === "a2") {
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              placeholder="请输入年份，例如: 1998"
              className="question-input"
              min="1900"
              max="2024"
            />
          );
        } else {
          // 对于F题和G题
          const min = question.id === "g" ? 0 : undefined;
          const max = question.id === "g" ? 10 : undefined;
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              placeholder={
                question.id === "f"
                  ? "请输入出错次数"
                  : "请输入打卡地点数量(0-10)"
              }
              className="question-input"
              min={min}
              max={max}
            />
          );
        }

      case "coordinate":
        const coords = value ? value.split(",") : ["", ""];
        const x = coords[0] || "";
        const y = coords[1] || "";
        return (
          <div className="coordinate-input">
            <div className="coordinate-group">
              <label>X坐标 (1-10):</label>
              <input
                type="number"
                value={x}
                onChange={(e) => {
                  const newX = e.target.value;
                  const newY = coords[1] || "";
                  onAnswerChange(question.id, `${newX},${newY}`);
                }}
                placeholder="1-10"
                className="coordinate-input-field"
                min="1"
                max="10"
              />
            </div>
            <div className="coordinate-group">
              <label>Y坐标 (1-10):</label>
              <input
                type="number"
                value={y}
                onChange={(e) => {
                  const newY = e.target.value;
                  const newX = coords[0] || "";
                  onAnswerChange(question.id, `${newX},${newY}`);
                }}
                placeholder="1-10"
                className="coordinate-input-field"
                min="1"
                max="10"
              />
            </div>
          </div>
        );

      case "choice":
        return (
          <select
            value={value}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            className="question-select"
          >
            <option value="">请选择...</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "boolean":
        return (
          <div className="radio-group">
            {question.options?.map((option, index) => (
              <label key={index} className="radio-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">{option}</span>
              </label>
            ))}
          </div>
        );

      case "multi_choice":
        const selectedValues = value ? value.split(",") : [];
        return (
          <div className="multi-choice-group">
            {question.options?.map((option, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter((v) => v !== option);
                    onAnswerChange(question.id, newValues.join(","));
                  }}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{option}</span>
              </label>
            ))}
          </div>
        );

      case "integer":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="请输入整数"
            className="question-input"
            step="1"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="questions-table">
      <div className="table-header">
        <div className="header-cell question-header">题目信息</div>
        <div className="header-cell answer-header">答案</div>
        <div className="header-cell action-header">操作</div>
      </div>

      {questions.map((question) => {
        const isSubmitting = submittingQuestions.has(question.id);
        const isSubmitted = submittedQuestions.has(question.id);

        return (
          <div
            key={question.id}
            className={`table-row ${isSubmitted ? "submitted" : ""} ${
              question.scoring ? "scoring-question" : "non-scoring-question"
            }`}
          >
            <div className="table-cell question-cell">
              <div className="question-header-info">
                <div className="question-id">ID: {question.id}</div>
                <div className="question-title">{question.title}</div>
                {question.scoring && (
                  <span className="scoring-badge">计分题</span>
                )}
                <div className="question-description">
                  {question.description}
                </div>
                {question.scoreRule && (
                  <div className="score-rule">
                    计分规则: {question.scoreRule}
                  </div>
                )}
              </div>
            </div>

            <div className="table-cell answer-cell">
              {renderQuestionInput(question)}
            </div>

            <div className="table-cell action-cell">
              <button
                onClick={() => onQuestionSubmit(question.id)}
                disabled={isSubmitting || isSubmitted}
                className={`submit-btn ${
                  isSubmitted ? "submitted" : isSubmitting ? "submitting" : ""
                }`}
              >
                {isSubmitted ? "已提交" : isSubmitting ? "提交中..." : "提交"}
              </button>
              {isSubmitted && <span className="success-icon">✓</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionSection;
