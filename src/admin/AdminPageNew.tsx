import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AdminPage.css";
import "./components/components.css";
import { HealthCheck } from "./components/HealthCheck";
import QuestionSection from "./components/QuestionSection";
import { UserStatus } from "./components/UserStatus";
import type { Question } from "./types/Question";
import { getUserAnswers, getUserScore, submitAnswer } from "./utils/api";

function AdminPageNew() {
  const { userId } = useParams<{ userId: string }>();
  const [userScore, setUserScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [submittingQuestions, setSubmittingQuestions] = useState<Set<string>>(
    new Set()
  );
  const [apiKey, setApiKey] = useState<string>("");
  const [hasLoadedHistory, setHasLoadedHistory] = useState<boolean>(false);

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
      scoreRule:
        "基础分：是+是：+1分，是+否：+0.5分，否+否：0分；最终得分乘以D题区县百分比",
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
      scoreRule:
        "基础分：是+是：+0.5分，是+否：+0分，否+否：-1分；最终得分乘以D题直辖百分比",
    },

    // 第二部分：个人经历题目
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

    // 第三部分：重庆身份认同和文化测试
    {
      id: "d",
      title: "重庆人身份认同的核心矛盾",
      description: "维度选择：重庆人身份认同的核心矛盾",
      type: "choice",
      options: ["1(区县)", "2(直辖)", "3(赛博)"],
      scoring: false,
      scoreRule: "本题不直接计分，计算百分比分布作为其他题目的权重",
    },
    {
      id: "e",
      title: "重庆的中心",
      description: "重庆的中心坐标选择（x和y都在1-10范围内）",
      type: "coordinate",
      scoring: true,
      scoreRule: "和大多数人分布越近分数越高，最高分1分，最低分0分",
    },
    {
      id: "f",
      title: "绕口令",
      description: "绕口令出错次数",
      type: "number",
      scoring: true,
      scoreRule: "先判断重庆人群体出错分布，决定排序方式，然后排序给分",
    },
    {
      id: "g",
      title: "迷宫打卡",
      description: "迷宫打卡地点数量（0-10）",
      type: "number",
      scoring: true,
      scoreRule:
        "0处=0分，1处=0.1分，2处=0.2分，...，10处=1分；最终计分需要乘以d题的D3百分比",
    },

    // 第四部分：切蛋糕和文化测试
    {
      id: "h1",
      title: "切蛋糕 - 区县",
      description: "切蛋糕 - 区县，填空得分",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填得分进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，最终得分乘以D题区县百分比",
    },
    {
      id: "h2",
      title: "切蛋糕 - 直辖",
      description: "切蛋糕 - 直辖，填空得分",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填得分进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，最终得分乘以D题直辖百分比",
    },
    {
      id: "i",
      title: "乱劈柴",
      description: "乱劈柴，填空使用重庆言子儿次数",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填次数进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，最终得分乘以D题赛博百分比",
    },
    {
      id: "j",
      title: "夜景图片",
      description: "夜景图片，7选1",
      type: "choice",
      options: ["1", "2", "3", "4", "5", "6", "7"],
      scoring: true,
      scoreRule:
        "投票题，根据投票分布计算得分，越和大多数人相似分数越高，最终得分乘以D题赛博百分比",
    },
    {
      id: "k",
      title: "山火志愿对象",
      description: "山火志愿对象，4选1",
      type: "choice",
      options: ["1(医疗队)", "2(摩托车队)", "3(油锯手队)", "4(不捐钱)"],
      scoring: true,
      scoreRule:
        "投票题，根据投票进行实时得票排名给分，最高分1分，最低分0分，最终得分乘以D题赛博百分比",
    },
    {
      id: "r",
      title: "选游戏",
      description: "选择你想玩的游戏",
      type: "choice",
      options: [
        "脏话牌",
        "火锅油碟",
        "打麻将",
        "量身高",
        "社保年限",
        "消费",
        "游客量",
        "户口量",
      ],
      scoring: false,
      scoreRule: "本题不计分，但统计各选项的选择百分比作为对应题目的权重",
    },
    {
      id: "l",
      title: "脏话牌",
      description: "脏话牌，填空使用重庆脏话次数",
      type: "number",
      scoring: true,
      scoreRule:
        "先判断次数=0和次数>0的人数分布，决定排序方式，然后排序给分，最高分1分，最低分0分，最终得分乘以R题脏话牌选择百分比",
    },

    // 第五部分：火锅油碟、打麻将和数据统计
    {
      id: "m",
      title: "火锅油碟",
      description: "火锅油碟，多选投票（1-18号选项）",
      type: "multi_choice",
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
      ],
      scoring: true,
      scoreRule:
        "根据各选项的实时得票分布进行排名给分，和选择最多的人越靠近得分越高，最终得分乘以R题火锅油碟选择百分比",
    },
    {
      id: "n",
      title: "打麻将",
      description: "打麻将，填空番数（）番",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填番数进行实时排序，根据实时排名进行给分，最终得分乘以R题打麻将选择百分比",
    },
    {
      id: "o1",
      title: "身高",
      description: "身高，填空身高（）cm",
      type: "number",
      scoring: true,
      scoreRule:
        "根据当前所有参与o1的人的数据计算实时平均数，与实时平均数越接近得分越高，最终得分乘以R题O系列选择百分比总和",
    },
    {
      id: "o2",
      title: "社保年限",
      description: "社保年限，填空缴纳社保（）年（可以有小数）",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填年数进行实时排序，根据实时排名进行给分，最终得分乘以R题O系列选择百分比总和",
    },
    {
      id: "o3",
      title: "消费",
      description: "消费，填空今天在山城巷消费（）元",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填消费金额进行实时排序，根据实时排名进行给分，最终得分乘以R题O系列选择百分比总和",
    },
    {
      id: "o4",
      title: "游客量",
      description: "游客量，填空带来（）游客（整数）",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填游客人数进行实时排序，根据实时排名进行给分，最终得分乘以R题O系列选择百分比总和",
    },
    {
      id: "o5",
      title: "户口量",
      description: "户口量，填空带来（）人（整数）",
      type: "number",
      scoring: true,
      scoreRule:
        "根据所填人数进行实时排序，根据实时排名进行给分，最终得分乘以R题O系列选择百分比总和",
    },
  ];

  // 获取用户分数
  const fetchUserScore = async () => {
    if (!userId || !apiKey) return;

    setLoadingScore(true);
    try {
      const response = await getUserScore(userId);
      if (response.code === 0 && response.data) {
        setUserScore(response.data.total_score || 0);
      } else {
        console.error("获取分数失败:", response.message);
      }
    } catch (error) {
      console.error("获取分数出错:", error);
    } finally {
      setLoadingScore(false);
    }
  };

  // 加载用户历史答案
  const loadUserHistory = async () => {
    if (!userId || !apiKey || hasLoadedHistory) return;

    try {
      const response = await getUserAnswers(userId);
      if (response.code === 0 && response.data) {
        const historyAnswers: { [key: string]: string } = {};
        const submittedSet = new Set<string>();

        // 处理历史答案数据
        Object.entries(response.data).forEach(([questionId, answer]) => {
          if (answer !== null && answer !== undefined) {
            // 处理特殊格式的答案
            let processedAnswer: string;

            // A1题目的答案格式转换
            if (questionId === "a1") {
              const answerStr = String(answer).toLowerCase();
              if (
                answerStr === "yes" ||
                answerStr === "true" ||
                String(answer) === "true"
              ) {
                processedAnswer = "是";
              } else if (
                answerStr === "no" ||
                answerStr === "false" ||
                String(answer) === "false"
              ) {
                processedAnswer = "否";
              } else {
                processedAnswer = String(answer);
              }
            } else {
              processedAnswer = String(answer);
            }

            historyAnswers[questionId] = processedAnswer;
            submittedSet.add(questionId);
          }
        });

        setAnswers(historyAnswers);
        setSubmittedQuestions(submittedSet);
        setHasLoadedHistory(true);

        // 如果有历史答案，显示提示
        if (Object.keys(historyAnswers).length > 0) {
          console.log(
            "已加载历史答案，共",
            Object.keys(historyAnswers).length,
            "题"
          );
        }
      }
    } catch (error) {
      console.error("加载历史答案出错:", error);
    }
  };

  // 处理API Key变化
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    setHasLoadedHistory(false); // 重置历史加载状态
  };

  // 处理答案变化
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // 提交单个问题答案
  const handleQuestionSubmit = async (questionId: string) => {
    if (!userId || !apiKey || !answers[questionId]) return;

    setSubmittingQuestions((prev) => new Set([...prev, questionId]));

    try {
      const result = await submitAnswer(
        userId,
        questionId,
        answers[questionId]
      );

      if (result.code === 0) {
        setSubmittedQuestions((prev) => new Set([...prev, questionId]));

        // 更新分数
        if (result.data?.total_score !== undefined) {
          setUserScore(result.data.total_score);
        }

        alert(`题目 ${questionId.toUpperCase()} 提交成功！`);
      } else {
        alert(`提交失败: ${result.message}`);
      }
    } catch (error) {
      console.error("提交出错:", error);
      alert("提交出错，请检查网络连接或API Key");
    } finally {
      setSubmittingQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  // 按部分分组题目
  const questionsBySection = {
    section1: allQuestions.slice(0, 5), // Q1, Q2, A1, A2, P
    section2: allQuestions.slice(5, 13), // B1-B5, C1-C3
    section3: allQuestions.slice(13, 17), // D, E, F, G
    section4: allQuestions.slice(17, 24), // H1, H2, I, J, K, R, L
    section5: allQuestions.slice(24, 31), // M, N, O1-O5
  };

  // 渲染部分标题
  const renderSectionHeader = (
    title: string,
    description: string,
    questions: Question[]
  ) => {
    const scoringQuestions = questions.filter((q) => q.scoring);
    const nonScoringQuestions = questions.filter((q) => !q.scoring);

    return (
      <div className="section-header">
        <h2>{title}</h2>
        <p className="section-description">{description}</p>
        <div className="scoring-notice">
          <h4>题目说明：</h4>
          <ul>
            {nonScoringQuestions.length > 0 && (
              <li>
                {nonScoringQuestions.map((q) => q.id.toUpperCase()).join("、")}{" "}
                为不计分题目
              </li>
            )}
            {scoringQuestions.length > 0 && (
              <li>
                {scoringQuestions.map((q) => q.id.toUpperCase()).join("、")}{" "}
                为计分题目
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  // 设置页面背景色
  useEffect(() => {
    document.body.style.backgroundColor = "#fefefe";
    return () => {
      document.body.style.backgroundColor = "#000";
    };
  }, []);

  // 当API Key变化时，加载历史答案和分数
  useEffect(() => {
    if (apiKey && userId) {
      loadUserHistory();
      fetchUserScore();
    }
  }, [apiKey, userId]);

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
      style={{ backgroundColor: "#fefefe", minHeight: "100vh" }}
    >
      <div className="admin-header">
        <h1>500游戏引擎测试问卷</h1>

        <UserStatus
          userId={userId}
          userScore={userScore}
          loadingScore={loadingScore}
          onRefreshScore={fetchUserScore}
          onApiKeyChange={handleApiKeyChange}
        />

        {/* 系统健康检查 */}
        <HealthCheck />

        {/* 历史答案加载提示 */}
        {hasLoadedHistory && submittedQuestions.size > 0 && (
          <div className="history-notice">
            <p>✅ 已加载历史答案，共 {submittedQuestions.size} 题已作答</p>
          </div>
        )}
      </div>

      <div className="admin-content">
        {/* 第一部分 */}
        {renderSectionHeader(
          "第一部分：基础信息和身份认证",
          "包含基础信息和身份认证题目，Q1(称呼)、Q2(性别)、P(MBTI)为不计分题目；A1(身份证前三位)、A2(出生年份)为计分题目",
          questionsBySection.section1
        )}
        <QuestionSection
          questions={questionsBySection.section1}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />

        {/* 第二部分 */}
        {renderSectionHeader(
          "第二部分：父母相关和个人经历题目",
          "包含父母来源地题目(B1-B5)和个人经历题目(C1-C3)，部分题目采用动态计分机制",
          questionsBySection.section2
        )}
        <QuestionSection
          questions={questionsBySection.section2}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />

        {/* 第三部分 */}
        {renderSectionHeader(
          "第三部分：重庆身份认同和文化测试",
          "包含重庆人身份认同的核心矛盾(D)、重庆中心坐标(E)、绕口令测试(F)、迷宫打卡(G)",
          questionsBySection.section3
        )}
        <QuestionSection
          questions={questionsBySection.section3}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />

        {/* 第四部分 */}
        {renderSectionHeader(
          "第四部分：重庆文化体验和游戏选择",
          "包含切蛋糕(H1-H2)、乱劈柴(I)、夜景图片(J)、山火志愿(K)、选游戏(R)、脏话牌(L)",
          questionsBySection.section4
        )}
        <QuestionSection
          questions={questionsBySection.section4}
          answers={answers}
          submittedQuestions={submittedQuestions}
          submittingQuestions={submittingQuestions}
          onAnswerChange={handleAnswerChange}
          onQuestionSubmit={handleQuestionSubmit}
        />

        {/* 第五部分 */}
        {renderSectionHeader(
          "第五部分：重庆生活方式和个人数据",
          "包含火锅油碟(M)、打麻将(N)、身高(O1)、社保年限(O2)、消费(O3)、游客量(O4)、户口量(O5)",
          questionsBySection.section5
        )}
        <QuestionSection
          questions={questionsBySection.section5}
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
