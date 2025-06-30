import type { ApiResponse, UserScore } from "../types/Question";

// 全局配置获取函数（用于非React组件）
function getApiBaseUrl(): string {
  return localStorage.getItem("api_base_url") || "https://server500.actoria.top";
}

function getApiKey(): string {
  return localStorage.getItem("api_key") || "";
}

// 导出配置获取函数供外部使用
export { getApiBaseUrl, getApiKey };

// 创建请求头
function createHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  return headers;
}

// 提交答案
export async function submitAnswer(
  userId: string,
  questionId: string,
  answer: string | number
): Promise<ApiResponse> {
  // 处理特殊答案格式
  let processedAnswer = answer;

  // A1题目的答案格式转换
  if (questionId === "a1") {
    if (answer === "是") processedAnswer = "yes";
    else if (answer === "否") processedAnswer = "no";
  }

  // A2题目转换为数字
  if (questionId === "a2") {
    processedAnswer = parseInt(answer as string);
  }

  const response = await fetch(`${getApiBaseUrl()}/api/answers`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify({
      user_id: userId,
      question_id: questionId,
      answer: processedAnswer,
    }),
  });

  return await response.json();
}

// 获取所有用户分数
export async function getScores(): Promise<UserScore[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/final-scores`, {
    headers: createHeaders(),
  });
  const result = await response.json();
  return result.data || [];
}

// 获取用户分数
export async function getUserScore(userId: string): Promise<ApiResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/scores/${userId}`, {
    headers: createHeaders(),
  });
  return await response.json();
}

// 获取用户答案
export async function getUserAnswers(userId: string): Promise<ApiResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/answers/${userId}`, {
    headers: createHeaders(),
  });
  return await response.json();
}
