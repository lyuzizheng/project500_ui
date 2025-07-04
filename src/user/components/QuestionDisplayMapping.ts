// 题目显示映射 - 将API返回的程序化标题转换为用户友好的显示文本

export interface QuestionDisplayInfo {
  title: string;
  optionMapping?: Record<string, string>;
}

// 题目标题和选项的用户友好映射
export const QUESTION_DISPLAY_MAPPING: Record<string, QuestionDisplayInfo> = {
  // A组题目 - 基础身份信息
  a1: {
    title: "观众是否是重庆身份证？",
    optionMapping: {
      是: "是",
      否: "否",
    },
  },
  a2: {
    title: "大家是在哪年出生的？",
    // 数值型题目不需要选项映射
  },

  // B组题目 - 父母来源
  b1: {
    title: "父母是否都来自重庆？",
    optionMapping: {
      "是+是": "父母都是重庆人",
      "是+否": "一方是重庆人",
      "否+否": "父母都不是重庆人",
    },
  },
  b2: {
    title: "父母是否来自主城九区？",
    optionMapping: {
      "是+是": "父母都来自主城九区",
      "是+否": "一方来自主城九区",
      "否+否": "父母都不来自主城九区",
    },
  },
  b3: {
    title: "重庆的一方是否来自主城九区？",
    optionMapping: {
      是: "是",
      否: "否",
    },
  },
  b4: {
    title: "非重庆的一方是否来自四川？",
    optionMapping: {
      是: "是",
      否: "否",
    },
  },
  b5: {
    title: "父母是否来自四川？",
    optionMapping: {
      "是+是": "父母都来自四川",
      "是+否": "一方来自四川",
      "否+否": "父母都不来自四川",
    },
  },

  // C组题目 - 居住经历
  c1: {
    title: "童年是否在重庆度过？",
    optionMapping: {
      是: "是",
      否: "否",
    },
  },
  c2: {
    title: "现在是否常住重庆？",
    optionMapping: {
      是: "是",
      否: "否",
    },
  },
  c3: {
    title: "在重庆待了多长时间？",
    // 文本型题目，显示原始答案
  },

  // D组题目 - 身份认同
  d: {
    title: "你认为重庆人的核心身份是什么？",
    optionMapping: {
      "1": "区县重庆人",
      "2": "直辖市重庆人",
      "3": "赛博重庆人",
    },
  },

  // E组题目 - 地理认知
  e: {
    title: "你心中重庆的中心在哪里？",
    // 坐标型题目，显示坐标统计
  },

  // F组题目 - 语言能力
  f: {
    title: "绕口令出错次数",
    // 排名型题目
  },

  // G组题目 - 地理知识
  g: {
    title: "重庆地理知识挑战",
    // 分数型题目
  },

  // H组题目 - 区域认知
  h1: {
    title: "区县重庆认知测试",
    // 分数型题目
  },
  h2: {
    title: "直辖市重庆认知测试",
    // 分数型题目
  },

  // I组题目 - 文化理解
  i: {
    title: "重庆话使用情况",
    // 分数型题目
  },

  // J组题目 - 视觉认知
  j: {
    title: "重庆夜景图片识别",
    // 投票型题目
  },

  // K组题目 - 社会参与
  k: {
    title: "山火志愿服务意愿",
    // 投票型题目
  },

  // L组题目 - 游戏参与
  l: {
    title: "脏话使用情况",
    // 数值统计型题目
  },

  // M组题目 - 饮食文化
  m: {
    title: "火锅油碟调配",
    // 数值统计型题目
  },

  // N组题目 - 娱乐文化
  n: {
    title: "打麻将技能",
    // 数值统计型题目
  },

  // O组题目 - 社会融入
  o1: {
    title: "在重庆工作年限",
    // 数值型题目
  },
  o2: {
    title: "社保缴纳年限",
    // 数值型题目
  },

  // P组题目 - 性格类型
  p: {
    title: "MBTI性格类型",
    // 信息收集型题目
  },

  // Q组题目 - 基础信息
  q1: {
    title: "称呼",
    // 信息收集型题目
  },
  q2: {
    title: "性别",
    optionMapping: {
      男: "男",
      女: "女",
    },
  },

  // R组题目 - 游戏选择
  r: {
    title: "你最想玩哪个重庆特色游戏？",
    optionMapping: {
      "1": "脏话牌",
      "2": "火锅油碟调配",
      "3": "打麻将",
      "4": "量身高等体感游戏",
    },
  },
};

/**
 * 获取题目的用户友好显示标题
 * @param questionId 题目ID
 * @param originalTitle 原始标题（API返回的description）
 * @returns 用户友好的标题
 */
export function getDisplayTitle(
  questionId: string,
  originalTitle?: string
): string {
  const mapping = QUESTION_DISPLAY_MAPPING[questionId.toLowerCase()];
  return mapping?.title || originalTitle || `题目 ${questionId.toUpperCase()}`;
}

/**
 * 获取选项的用户友好显示文本
 * @param questionId 题目ID
 * @param originalOption 原始选项
 * @returns 用户友好的选项文本
 */
export function getDisplayOption(
  questionId: string,
  originalOption: string
): string {
  const mapping = QUESTION_DISPLAY_MAPPING[questionId.toLowerCase()];
  return mapping?.optionMapping?.[originalOption] || originalOption;
}

/**
 * 检查题目是否有选项映射
 * @param questionId 题目ID
 * @returns 是否有选项映射
 */
export function hasOptionMapping(questionId: string): boolean {
  const mapping = QUESTION_DISPLAY_MAPPING[questionId.toLowerCase()];
  return !!mapping?.optionMapping;
}
