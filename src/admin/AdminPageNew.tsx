import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserStatus from './components/UserStatus';
import QuestionSection from './components/QuestionSection';
import type { Question } from './types/Question';
import { getUserScore, submitAnswer } from './utils/api';
import './AdminPage.css';
import './components/components.css';

function AdminPageNew() {
  const { userId } = useParams<{ userId: string }>();
  const [userScore, setUserScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [submittingQuestions, setSubmittingQuestions] = useState<Set<string>>(new Set());

  // 定义所有题目
  const allQuestions: Question[] = [
    // 第一部分：基础信息和身份认证
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
    {
      id: "p",
      title: "MBTI",
      description: "请填写您的MBTI类型",
      type: "text",
      scoring: false,
      storageField: "mbti",
    },
    
    // 第二部分：父母相关题目
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
      scoreRule: "基础分：是+是：+1分，是+否：+0.5分，否+否：0分；最终得分乘以D题区县百分比",
    },
    {
      id: "b3",
      title: "是重庆的一方是否来自主城九区",
      description: "是重庆的一方是否来自主城九区？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "基础分：是：+1分，否：+0.5分；最终得分乘以D题区县百分比",
    },
    {
      id: "b4",
      title: "非重庆的一方是否来自四川",
      description: "非重庆的一方是否来自四川？",
      type: "boolean",
      options: ["是", "否"],
      scoring: true,
      scoreRule: "基础分：是：+1分，否：+0.5分；最终得分乘以D题直辖百分比",
    },
    {
      id: "b5",
      title: "父母是否来自四川",
      description: "父母是否来自四川？",
      type: "choice",
      options: ["是+是", "是+否", "否+否"],
      scoring: true,
      scoreRule: "基础分：是+是：+0.5分，是+否：+0分，否+否：-1分；最终得分乘以D题直辖百分比",
    },
    
    // 第三部分：个人经历题目
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
      scoreRule: "根据时间长度进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，允许并列",
    },
  ];

  // 获取用户分数
  const fetchUserScore = async () => {
    if (!userId) return;

    setLoadingScore(true);
    try {
      const result = await getUserScore(userId);
      if (result.code === 0) {
        setUserScore(result.data?.total_score || 0);
      } else {
        console.error('获取分数失败:', result.message);
      }
    } catch (error) {
      console.error('获取分数出错:', error);
    } finally {
      setLoadingScore(false);
    }
  };

  // 处理答案变化
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // 提交单个问题答案
  const handleQuestionSubmit = async (questionId: string) => {
    if (!userId || !answers[questionId]) return;

    setSubmittingQuestions(prev => new Set([...prev, questionId]));

    try {
      const result = await submitAnswer(userId, questionId, answers[questionId]);
      
      if (result.code === 0) {
        setSubmittedQuestions(prev => new Set([...prev, questionId]));
        
        // 更新分数
        if (result.data?.total_score !== undefined) {
          setUserScore(result.data.total_score);
        }
        
        alert(`题目 ${questionId.toUpperCase()} 提交成功！`);
      } else {
        alert(`提交失败: ${result.message}`);
      }
    } catch (error) {
      console.error('提交出错:', error);
      alert('提交出错，请重试');
    } finally {
      setSubmittingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  // 按部分分组题目
  const questionsBySection = {
    section1: allQuestions.slice(0, 5),  // Q1, Q2, A1, A2, P
    section2: allQuestions.slice(5, 10), // B1-B5
    section3: allQuestions.slice(10, 13) // C1-C3
  };

  // 渲染部分标题
  const renderSectionHeader = (title: string, description: string, questions: Question[]) => {
    const scoringQuestions = questions.filter(q => q.scoring);
    const nonScoringQuestions = questions.filter(q => !q.scoring);
    
    return (
      <div className="section-header">
        <h2>{title}</h2>
        <p className="section-description">{description}</p>
        <div className="scoring-notice">
          <h4>题目说明：</h4>
          <ul>
            {nonScoringQuestions.length > 0 && (
              <li>{nonScoringQuestions.map(q => q.id.toUpperCase()).join('、')} 为不计分题目</li>
            )}
            {scoringQuestions.length > 0 && (
              <li>{scoringQuestions.map(q => q.id.toUpperCase()).join('、')} 为计分题目</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  // 设置页面背景色
  useEffect(() => {
    document.body.style.backgroundColor = '#fefefe';
    return () => {
      document.body.style.backgroundColor = '#000';
    };
  }, []);

  // 初始加载分数
  useEffect(() => {
    fetchUserScore();
  }, [userId]);

  if (!userId) {
    return (
      <div className="admin-container">
        <div className="error-message">
          <h2>错误</h2>
          <p>未找到用户ID</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-container"
      style={{ backgroundColor: '#fefefe', minHeight: '100vh' }}
    >
      <div className="admin-header">
        <h1>500游戏引擎测试问卷</h1>
        
        <UserStatus
          userId={userId}
          userScore={userScore}
          loadingScore={loadingScore}
          onRefreshScore={fetchUserScore}
        />
      </div>

      <div className="admin-content">
        {/* 第一部分 */}
        {renderSectionHeader('第一部分：基础信息和身份认证', '包含基础信息和身份认证题目，Q1(称呼)、Q2(性别)、P(MBTI)为不计分题目；A1(身份证前三位)、A2(出生年份)为计分题目', questionsBySection.section1)}
        <QuestionSection
          questions={questionsBySection.section1}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />

        {/* 第二部分 */}
        {renderSectionHeader('第二部分：父母相关题目', '关于父母来源地的题目，部分题目采用动态计分机制，最终得分会根据D题的统计结果进行调整', questionsBySection.section2)}
        <QuestionSection
          questions={questionsBySection.section2}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />

        {/* 第三部分 */}
        {renderSectionHeader('第三部分：个人经历题目', '关于个人在重庆的生活经历，包括童年、常居地和居住时长', questionsBySection.section3)}
        <QuestionSection
          questions={questionsBySection.section3}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />
      </div>
    </div>
  );
}

export default AdminPageNew;