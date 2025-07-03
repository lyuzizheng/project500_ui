import type { ApiResponse, UserScore } from "../admin/types/Question";

// 全局配置获取函数（用于非React组件）
function getApiBaseUrl(): string {
  return (
     "https://chongqing.brabalawuka.cc"
  );
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
export async function getUserScore(userId: string): Promise<UserScore> {
  const response = await fetch(`${getApiBaseUrl()}/api/scores/${userId}`, {
    headers: createHeaders(),
  });
  const result = await response.json();
  return result.data.final_score || {};
}

// 获取用户最终得分（新API）
export async function getUserFinalScore(
  userId: string,
  userApiKey?: string
): Promise<{
  user_id: string;
  x_axis_raw: number;
  y_axis_raw: number;
  x_axis_percent: number;
  y_axis_percent: number;
  x_axis_mapped: number;
  y_axis_mapped: number;
}> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 如果提供了用户专属API Key，使用用户专属认证
  if (userApiKey) {
    headers["X-API-Key"] = userApiKey;
    headers["X-UserID"] = userId;
  } else {
    // 否则使用管理员API Key
    const apiKey = getApiKey();
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
  }

  const response = await fetch(
    `${getApiBaseUrl()}/api/final-scores/${userId}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.message || "获取用户得分失败");
  }

  return result.data;
}

// 获取题目分布统计
export async function getQuestionsDistribution(
  userApiKey?: string,
  userId?: string
): Promise<{
  total_questions: number;
  total_participants: number;
  questions: Record<string, unknown>;
  dependencies: Record<string, string[]>;
  generated_at: string;
}> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 如果提供了用户专属API Key，使用用户专属认证
  if (userApiKey && userId) {
    headers["X-API-Key"] = userApiKey;
    headers["X-UserID"] = userId;
  } else {
    // 否则使用管理员API Key
    const apiKey = getApiKey();
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
  }

  const response = await fetch(
    `${getApiBaseUrl()}/api/questions/distribution`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.message || "获取题目分布失败");
  }

  return result.data;
}

// 获取用户答案
export async function getUserAnswers(userId: string): Promise<ApiResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/answers/${userId}`, {
    headers: createHeaders(),
  });
  return await response.json();
}
