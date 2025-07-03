import { useCallback, useEffect, useState } from "react";
import type {
  QuestionsDistribution,
  UserFinalScore,
} from "../services/UserDataService";
import { UserDataService } from "../services/UserDataService";

interface UseUserDataResult {
  userScore: UserFinalScore | null;
  distribution: QuestionsDistribution | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserData = (
  userId?: string,
  apiKey?: string
): UseUserDataResult => {
  const [userScore, setUserScore] = useState<UserFinalScore | null>(null);
  const [distribution, setDistribution] =
    useState<QuestionsDistribution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setError("用户ID不能为空");
      return;
    }

    // 验证用户ID格式
    if (!UserDataService.validateUserId(userId)) {
      setError("用户ID格式不正确，应为L开头的4位数字");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 使用重试机制获取用户数据
      const data = await UserDataService.withRetry(
        () => UserDataService.getUserCompleteData(userId, apiKey),
        2, // 最多重试2次
        1000 // 1秒延迟
      );

      setUserScore(data.userScore);
      setDistribution(data.distribution);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "获取用户数据失败";
      setError(errorMessage);
      console.error("获取用户数据失败:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, apiKey]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [fetchUserData]);

  const refetch = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userScore,
    distribution,
    loading,
    error,
    refetch,
  };
};
