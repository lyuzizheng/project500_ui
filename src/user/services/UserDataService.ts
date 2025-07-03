import { getQuestionsDistribution, getUserFinalScore } from "../../utils/api";

export interface UserFinalScore {
  user_id: string;
  x_axis_raw: number;
  y_axis_raw: number;
  x_axis_percent: number;
  y_axis_percent: number;
  x_axis_mapped: number;
  y_axis_mapped: number;
}

export interface QuestionsDistribution {
  total_questions: number;
  total_participants: number;
  questions: Record<string, unknown>;
  dependencies: Record<string, string[]>;
  generated_at: string;
}

export class UserDataService {
  /**
   * 获取用户最终得分
   * @param userId 用户ID
   * @param apiKey 用户专属API Key（可选）
   * @returns 用户最终得分数据
   */
  static async getUserFinalScore(
    userId: string,
    apiKey?: string
  ): Promise<UserFinalScore> {
    try {
      const data = await getUserFinalScore(userId, apiKey);
      return data;
    } catch (error) {
      console.error("获取用户最终得分失败:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * 获取题目分布统计
   * @param apiKey 用户专属API Key（可选）
   * @param userId 用户ID（使用用户专属API Key时必需）
   * @returns 题目分布统计数据
   */
  static async getQuestionsDistribution(
    apiKey?: string,
    userId?: string
  ): Promise<QuestionsDistribution> {
    try {
      const data = await getQuestionsDistribution(apiKey, userId);
      return data;
    } catch (error) {
      console.error("获取题目分布统计失败:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * 获取用户完整数据（包括得分和统计信息）
   * @param userId 用户ID
   * @param apiKey 用户专属API Key（可选）
   * @returns 包含用户得分和题目分布的完整数据
   */
  static async getUserCompleteData(
    userId: string,
    apiKey?: string
  ): Promise<{
    userScore: UserFinalScore;
    distribution: QuestionsDistribution;
  }> {
    try {
      const [userScore, distribution] = await Promise.all([
        this.getUserFinalScore(userId, apiKey),
        this.getQuestionsDistribution(apiKey, userId),
      ]);

      return {
        userScore,
        distribution,
      };
    } catch (error) {
      console.error("获取用户完整数据失败:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * 验证用户ID格式
   * @param userId 用户ID
   * @returns 是否为有效格式
   */
  static validateUserId(userId: string): boolean {
    return /^L\d{4}$/.test(userId);
  }

  /**
   * 获取友好的错误消息
   * @param error 错误对象
   * @returns 友好的错误消息
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      // 根据错误消息返回更友好的提示
      if (error.message.includes("404")) {
        return "用户数据不存在，请检查用户ID是否正确";
      }
      if (error.message.includes("401") || error.message.includes("403")) {
        return "API Key无效或权限不足，请检查认证信息";
      }
      if (error.message.includes("500")) {
        return "服务器内部错误，请稍后重试";
      }
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        return "网络连接失败，请检查网络连接后重试";
      }
      return error.message;
    }
    return "未知错误，请稍后重试";
  }

  /**
   * 重试机制
   * @param fn 要重试的函数
   * @param maxRetries 最大重试次数
   * @param delay 重试延迟（毫秒）
   * @returns Promise
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (i === maxRetries) {
          throw lastError;
        }

        // 等待后重试
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }

    throw lastError!;
  }
}
