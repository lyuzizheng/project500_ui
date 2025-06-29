import type { ApiResponse } from '../types/Question';

const API_BASE_URL = 'https://server500.actoria.top';

// 提交答案
export async function submitAnswer(
  userId: string,
  questionId: string,
  answer: string | number
): Promise<ApiResponse> {
  // 处理特殊答案格式
  let processedAnswer = answer;
  
  // A1题目的答案格式转换
  if (questionId === 'a1') {
    if (answer === '是') processedAnswer = 'yes';
    else if (answer === '否') processedAnswer = 'no';
  }
  
  // A2题目转换为数字
  if (questionId === 'a2') {
    processedAnswer = parseInt(answer as string);
  }

  const response = await fetch(`${API_BASE_URL}/api/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      question_id: questionId,
      answer: processedAnswer,
    }),
  });

  return await response.json();
}

// 获取用户分数
export async function getUserScore(userId: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/scores/${userId}`);
  return await response.json();
}

// 获取用户答案
export async function getUserAnswers(userId: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/answers/${userId}`);
  return await response.json();
}