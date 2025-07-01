import { useState } from "react";
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmQuestionId, setConfirmQuestionId] = useState<string | null>(
    null
  );

  const handleSubmitClick = (questionId: string) => {
    const isSubmitted = submittedQuestions.has(questionId);
    if (isSubmitted) {
      setConfirmQuestionId(questionId);
      setShowConfirmModal(true);
    } else {
      onQuestionSubmit(questionId);
    }
  };

  const handleConfirmSubmit = () => {
    if (confirmQuestionId) {
      onQuestionSubmit(confirmQuestionId);
    }
    setShowConfirmModal(false);
    setConfirmQuestionId(null);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
    setConfirmQuestionId(null);
  };
  
  const shouldShowQuestion = (question: Question) => {
    // 获取 b1 的答案和提交状态
    const b1Answer = answers["b1"];
    const b1Submitted = submittedQuestions.has("b1");
    
    // 如果是 b2，只有当 b1 提交且答案为"是+是"时才显示
    if (question.id === "b2") {
      return b1Submitted && b1Answer === "是+是";
    }
    
    // 如果是 b3 或 b4，只有当 b1 提交且答案为"是+否"时才显示
    if (question.id === "b3" || question.id === "b4") {
      return b1Submitted && b1Answer === "是+否";
    }
    
    // 如果是 b5，只有当 b1 提交且答案为"否+否"时才显示
    if (question.id === "b5") {
      return b1Submitted && b1Answer === "否+否";
    }
    
    // 其他问题都正常显示
    return true;
  };
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
          // 为不同题目设置合适的min、max和placeholder
          let min, max, placeholder;
          
          switch (question.id) {
            case "f":
              min = 0;
              placeholder = "请输入出错次数";
              break;
            case "g":
              min = 0;
              max = 10;
              placeholder = "请输入打卡地点数量(0-10)";
              break;
            case "h1":
            case "h2":
              placeholder = "请输入使用次数";
              break;
            case "i":
              placeholder = "请输入使用重庆言子儿次数";
              break;
            case "l":
              placeholder = "请输入使用重庆脏话次数";
              break;
            case "n":
              placeholder = "请输入番数";
              break;
            case "o1":
              placeholder = "请输入身高(cm)";
              break;
            case "o2":
              placeholder = "请输入社保年限(年)";
              break;
            case "o3":
              placeholder = "请输入消费金额(元)";
              break;
            default:
              placeholder = "请输入数字";
          }
          
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              placeholder={placeholder}
              className="question-input"
              min={min}
              max={max}
            />
          );
        }

      case "coordinate": {
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
      }

      case "choice": {
        // 对于R题，需要特殊处理选中状态
        let displayValue = value;
        if (question.id === "r" && value) {
          // 如果当前值是数字，找到对应的完整选项
          const matchingOption = question.options?.find(option => {
            const match = option.match(/^(\d+)/);
            return match && match[1] === value;
          });
          displayValue = matchingOption || value;
        }
        
        return (
          <select
            value={displayValue}
            onChange={(e) => {
              // 对于R题，提取数字部分作为值
              if (question.id === "r") {
                const match = e.target.value.match(/^(\d+)/);
                const numericValue = match ? match[1] : e.target.value;
                onAnswerChange(question.id, numericValue);
              } else {
                onAnswerChange(question.id, e.target.value);
              }
            }}
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
      }

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

      case "multi_choice": {
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
      }

      case "integer": {
        let placeholder;
        switch (question.id) {
          case "o4":
            placeholder = "请输入游客数量(整数)";
            break;
          case "o5":
            placeholder = "请输入人数(整数)";
            break;
          default:
            placeholder = "请输入整数";
        }
        
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={placeholder}
            className="question-input"
            step="1"
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <div className="question-list-container">
        <div className="question-list-header">
          <div className="header-item question-info-header">题目信息</div>
          <div className="header-item answer-header">答案</div>
          <div className="header-item action-header">操作</div>
        </div>
        <div className="question-list-body">
          {questions.filter(shouldShowQuestion).map((question) => {
            const isSubmitting = submittingQuestions.has(question.id);
            const isSubmitted = submittedQuestions.has(question.id);

            return (
              <div
                key={question.id}
                className={`question-item-row ${
                  isSubmitted ? "answered" : "unanswered"
                }`}
              >
                <div className="item-col question-info-col">
                  <div className="question-header">
                    <div className="question-id">ID: {question.id}</div>
                    <div
                      className={`answer-status ${
                        isSubmitted ? "completed" : "pending"
                      }`}
                    >
                      {isSubmitted ? "✓ 已作答" : "○ 待作答"}
                    </div>
                  </div>
                  <div className="question-title">{question.title}</div>
                  <div className="question-description">
                    {question.description}
                  </div>
                </div>
                <div className="item-col answer-col">
                  {renderQuestionInput(question)}
                </div>
                <div className="item-col action-col">
                  <button
                    onClick={() => handleSubmitClick(question.id)}
                    disabled={isSubmitting}
                    className={`submit-button ${
                      isSubmitted ? "submitted" : "pending"
                    } ${isSubmitting ? "submitting" : ""}`}
                  >
                    {isSubmitting
                      ? "提交中..."
                      : isSubmitted
                      ? "重新提交"
                      : "提交"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 确认弹窗 */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal-header">
              <h3>确认重新提交</h3>
            </div>
            <div className="confirm-modal-body">
              <p>您已经提交过这道题目的答案，确定要重新提交吗？</p>
              <p className="warning-text">重新提交将覆盖之前的答案。</p>
            </div>
            <div className="confirm-modal-actions">
              <button className="cancel-button" onClick={handleCancelSubmit}>
                取消
              </button>
              <button className="confirm-button" onClick={handleConfirmSubmit}>
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionSection;
