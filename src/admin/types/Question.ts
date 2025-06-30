export interface Question {
  id: string;
  title: string;
  description: string;
  type:
    | "text"
    | "choice"
    | "boolean"
    | "number"
    | "coordinate"
    | "multi_choice"
    | "integer";
  options?: string[];
  scoring: boolean; // 是否计分
  scoreRule?: string; // 计分规则说明
  storageField?: string; // 存储字段名
}

export interface SectionInfo {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  completed: boolean;
}

export interface UserScore {
  user_id: string;
  x_axis_raw?: number;
  y_axis_raw?: number;
  x_axis_percent?: number;
  y_axis_percent?: number;
  x_axis_mapped?: number;
  y_axis_mapped?: number;
  total_score?: number;
  questionScores?: { [questionId: string]: number };
}

export interface ApiResponse {
  code: number;
  message: string;
  data?: {
    question_score?: number;
    total_score?: number;
  };
}
