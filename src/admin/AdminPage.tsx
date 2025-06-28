import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AdminPage.css";

interface Question {
  id: string;
  title: string;
  description: string;
  type: "text" | "choice" | "boolean" | "number";
  options?: string[];
  scoring: boolean; // 是否计分
  scoreRule?: string; // 计分规则说明
  storageField?: string; // 存储字段名
}

function AdminPage() {
  const { userId } = useParams<{ userId: string }>();

  // 定义问题列表 - 基于游戏引擎API测试文档
  const questions: Question[] = [
    // 第一部分：基础信息（不计分）
    {
      id: "q1",
      title: "称呼",
      description: "请填写您的称呼",
      type: "text",
      scoring: false,
      storageField: "username",
    },
    {
      id: "q2",
      title: "性别",
      description: "请选择您的性别",
      type: "choice",
      options: ["男", "女"],
      scoring: false,
      storageField: "gender",
    },
    {
      id: "p",
      title: "MBTI",
      description: "请填写您的MBTI类型",
      type: "text",
      scoring: false,
      storageField: "mbti",
    },

    // 第二部分：计分题目
    {
      id: "a1",
      title: "身份证前三位",
      description: "您的身份证前三位是否为500？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "是的+1分，不是-1分",
    },
    {
      id: "a2",
      title: "出生年份",
      description: "请填写您的出生年份",
      type: "number",
      scoring: true,
      scoreRule: "≥1997年+1分，<1997年不得分",
    },

    // 第三部分：父母相关题目
    {
      id: "b1",
      title: "父母是否来自重庆",
      description: "父母是否来自重庆？",
      type: "choice",
      options: ["是+是", "是+否", "否+否"],
      scoring: true,
      scoreRule: "是+是：+1分，是+否：+0分，否+否：-1分",
    },
    {
      id: "b2",
      title: "父母是否来自主城九区",
      description: "父母是否来自主城九区？",
      type: "choice",
      options: ["是+是", "是+否", "否+否"],
      scoring: true,
      scoreRule: "是+是：+1分，是+否：+0.5分，否+否：0分",
    },
    {
      id: "b3",
      title: "是重庆的一方是否来自主城九区",
      description: "是重庆的一方是否来自主城九区？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "是：+1分，否：+0.5分",
    },
    {
      id: "b4",
      title: "非重庆的一方是否来自四川",
      description: "非重庆的一方是否来自四川？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "是：+1分，否：+0.5分",
    },
    {
      id: "b5",
      title: "父母是否来自四川",
      description: "父母是否来自四川？",
      type: "choice",
      options: ["是+是", "是+否", "否+否"],
      scoring: true,
      scoreRule: "是+是：+0.5分，是+否：+0分，否+否：-1分",
    },

    // 第四部分：个人经历题目
    {
      id: "c1",
      title: "童年是否在重庆",
      description: "童年是否在重庆？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "是：+1分，否：-1分",
    },
    {
      id: "c2",
      title: "常居地是否为重庆",
      description: "常居地是否为重庆？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "是：+1分，否：-1分",
    },
    {
      id: "c3",
      title: "在重庆待的时长",
      description: "在重庆待的时长（X年Y月）",
      type: "text",
      scoring: true,
      scoreRule:
        "根据时间长度进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，允许并列",
    },
  ];

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submittingQuestions, setSubmittingQuestions] = useState<Set<string>>(
    new Set()
  );
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [userScore, setUserScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  // 获取用户分数
  const fetchUserScore = async () => {
    if (!userId) return;

    setLoadingScore(true);
    try {
      const response = await fetch(
        `https://server500.actoria.top/api/scores/${userId}`
      );
      const result = await response.json();

      if (result.code === 0) {
        setUserScore(result.data?.total_score || 0);
      } else {
        console.error("获取分数失败:", result.message);
      }
    } catch (error) {
      console.error("获取分数出错:", error);
    } finally {
      setLoadingScore(false);
    }
  };

  // 处理答案变化
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 提交单个问题的答案
  const submitQuestion = async (questionId: string) => {
    const answer = answers[questionId];
    const question = questions.find((q) => q.id === questionId);

    if (!answer || answer.trim() === "") {
      alert("请填写答案");
      return;
    }

    setSubmittingQuestions((prev) => new Set([...prev, questionId]));

    try {
      // 调用游戏引擎API
      const response = await fetch(
        "https://server500.actoria.top/api/answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            question_id: questionId,
            answer: questionId === "a2" ? parseInt(answer) : answer,
          }),
        }
      );

      const result = await response.json();

      if (result.code === 0) {
        setSubmittedQuestions((prev) => new Set([...prev, questionId]));
        if (question?.scoring && result.data?.total_score !== undefined) {
          setUserScore(result.data.total_score);
        }
        alert(
          `提交成功！${
            question?.scoring
              ? `本题得分: ${result.data?.question_score || 0}分，总分: ${
                  result.data?.total_score || 0
                }分`
              : ""
          }`
        );
      } else {
        alert(`提交失败: ${result.message || "请重试"}`);
      }
    } catch (error) {
      console.error("提交出错:", error);
      alert("网络错误，请重试");
    } finally {
      setSubmittingQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
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
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={
              question.id === "c3" ? "例如: 25年6月" : `请输入${question.title}`
            }
            className="question-input"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="请输入年份，例如: 1998"
            className="question-input"
            min="1900"
            max="2024"
          />
        );

      case "choice":
        return (
          <select
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  className="radio-input"
                />
                <span className="radio-text">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // 设置页面背景色
  useEffect(() => {
    document.body.style.backgroundColor = "#fefefe";
    return () => {
      document.body.style.backgroundColor = "#000";
    };
  }, []);

  console.log("AdminPage component is rendering", { userId });

  return (
    <div
      className="admin-container"
      style={{ backgroundColor: "#fefefe", minHeight: "100vh" }}
    >
      <div className="admin-header">
        <h1>500游戏引擎测试问卷</h1>
        <p>用户ID: {userId}</p>
        <div className="score-section">
          <div className="score-display">
            <span className="score-label">当前总分:</span>
            <span className="score-value">
              {userScore !== null ? `${userScore}分` : "未获取"}
            </span>
            <button
              onClick={fetchUserScore}
              disabled={loadingScore}
              className="refresh-score-btn"
            >
              {loadingScore ? "获取中..." : "刷新分数"}
            </button>
          </div>
        </div>
        <p className="instruction">
          请逐一回答以下问题，每题回答完成后点击对应的提交按钮
        </p>
        <p className="api-info">API服务器: https://server500.actoria.top</p>
      </div>

      <div className="questions-container">
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
                  </div>
                </div>

                <div className="table-cell answer-cell">
                  {renderQuestionInput(question)}
                </div>

                <div className="table-cell action-cell">
                  <button
                    onClick={() => submitQuestion(question.id)}
                    disabled={isSubmitting || isSubmitted}
                    className={`submit-btn ${
                      isSubmitted
                        ? "submitted"
                        : isSubmitting
                        ? "submitting"
                        : ""
                    }`}
                  >
                    {isSubmitted
                      ? "已提交"
                      : isSubmitting
                      ? "提交中..."
                      : "提交"}
                  </button>
                  {isSubmitted && <span className="success-icon">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
