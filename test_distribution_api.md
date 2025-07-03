# Web端用户API文档

## 认证方式

### 1. API Key认证（推荐）
所有API请求都需要在请求头中包含有效的API Key：
```bash
-H "X-API-Key: your_api_key_here"
```

### 2. 用户专属API Key认证

每个用户都有专属的API Key，需要同时提供用户ID和对应的API Key：

```bash
# 访问分布统计
curl -X GET "http://localhost:8080/api/questions/distribution" \
  -H "X-API-Key: fbstxdrzuj" \
  -H "X-UserID: L0001" \
  -H "Content-Type: application/json"

# 访问用户最终得分
curl -X GET "http://localhost:8080/api/final-scores/L0001" \
  -H "X-API-Key: fbstxdrzuj" \
  -H "X-UserID: L0001" \
  -H "Content-Type: application/json"
```

**注意**: 用户专属API Key认证需要同时提供用户ID和对应的API Key，仅适用于预设的用户列表，主要用于获取个人答案和分数。

---

## 统计分析API

### 获取所有题目答案分布

**接口路径**: `GET /api/questions/distribution`  
**认证**: 需要API Key（支持管理员API Key和用户专属API Key）  
**功能**: 获取所有题目的答案分布统计信息

## 请求示例

```bash
curl -X GET "http://localhost:8080/api/questions/distribution" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json"
```

## 响应结构

```json
{
  "code": 0,
  "message": "获取题目分布成功",
  "data": {
    "total_questions": 35,
    "total_participants": 100,
    "questions": {
      "q1": {
        "type": "info_collection",
        "total_responses": 100,
        "response_rate": "100.0%",
        "answer_distribution": {
          "张三": 1,
          "李四": 1,
          "王五": 1
        },
        "metadata": {
          "description": "请填写您的称呼",
          "type": "text",
          "store_field": "username"
        }
      },
      "a1": {
        "type": "fixed_score",
        "total_responses": 100,
        "response_rate": "100.0%",
        "score_distribution": {
          "-1.0": 20,
          "1.0": 80
        },
        "answer_distribution": {
          "500": 80,
          "其他": 20
        },
        "average_score": 0.6,
        "metadata": {
          "description": "身份证前三位",
          "type": "text",
          "scoring": "500得1分，其他得-1分"
        }
      },
      "c3": {
        "type": "ranking_based",
        "total_responses": 100,
        "response_rate": "100.0%",
        "ranking_distribution": {
          "rank_1": {
            "count": 5,
            "score_range": "1.00"
          },
          "rank_2": {
            "count": 10,
            "score_range": "0.95"
          },
          "rank_3": {
            "count": 15,
            "score_range": "0.85"
          }
        },
        "value_stats": {
          "min_value": 0,
          "max_value": 120,
          "average_value": 36.5,
          "median_value": 24
        },
        "average_score": 0.65,
        "metadata": {
          "description": "在重庆待的时长（）年（）月",
          "type": "text",
          "format": "X年Y月",
          "scoring": "根据时间长度进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，允许并列"
        }
      },
      "d": {
        "type": "voting_based",
        "total_responses": 100,
        "response_rate": "100.0%",
        "vote_distribution": {
          "选项1": {
            "votes": 45,
            "percentage": 45.0,
            "rank": 1
          },
          "选项2": {
            "votes": 30,
            "percentage": 30.0,
            "rank": 2
          },
          "选项3": {
            "votes": 25,
            "percentage": 25.0,
            "rank": 3
          }
        },
        "winner": "选项1",
        "is_weight_source": true,
        "affects_questions": ["h1", "h2", "i", "g", "k"],
        "metadata": {
          "description": "重庆人身份认同的核心矛盾",
          "type": "choice"
        }
      },
      "e": {
        "type": "coordinate_based",
        "total_responses": 100,
        "response_rate": "100.0%",
        "coordinate_stats": {
          "center_point": {
            "x": 106.5,
            "y": 29.5
          },
          "distance_distribution": {
            "0-1km": 20,
            "1-5km": 35,
            "5-10km": 30,
            "10km+": 15
          },
          "score_statistics": {
            "highest_score": 1.0,
            "lowest_score": 0.1,
            "average_value": 0.65
          }
        },
        "metadata": {
          "description": "重庆的中心",
          "type": "coordinate"
        }
      },
      "o1": {
        "type": "weighted_average",
        "total_responses": 100,
        "response_rate": "100.0%",
        "value_stats": {
          "min_value": 150.0,
          "max_value": 190.0,
          "average_value": 170.5,
          "median_value": 171.0,
          "current_average": 170.5,
          "weight_source": "r4_percentage",
          "highest_score": 1.0,
          "lowest_score": 0.2,
          "distribution": {
            "150-160": 15,
            "160-170": 25,
            "170-180": 35,
            "180-190": 20,
            "190+": 5
          }
        },
        "dependency_weight": "r4_percentage: 60.0%",
        "metadata": {
          "description": "身高",
          "type": "number"
        }
      }
    },
    "dependencies": {
      "d": ["h1", "h2", "i", "g", "k"],
      "r": ["l", "m", "n", "o1", "o2", "o3", "o4", "o5"],
      "a1": ["f"]
    },
    "generated_at": "2024-01-01T12:00:00Z"
  }
}
```

## 题目类型说明

### 1. info_collection（信息收集型）
- **题目**: q1（称呼）、q2（性别）、p（MBTI）
- **特点**: 不计分，仅收集信息
- **统计内容**: 答案分布、响应率

### 2. fixed_score（固定分值型）
- **题目**: a1（身份证）、a2（出生年份）、b1-b5（父母来源）、c1-c2（居住地）、g（迷宫打卡）
- **特点**: 固定的计分规则
- **统计内容**: 分数分布、答案分布、平均分

### 3. ranking_based（排名竞争型）
- **题目**: c3（重庆时长）、f（绕口令）、h1（切蛋糕-区县）、h2（切蛋糕-直辖）、i（乱劈柴）
- **特点**: 根据排名给分
- **统计内容**: 排名分布、数值统计

### 4. voting_based（投票选择型）
- **题目**: d（身份认同）、j（夜景图片）、k（山火志愿）、r（选游戏）
- **特点**: 投票机制
- **统计内容**: 投票分布、获胜选项

### 5. coordinate_based（坐标计算型）
- **题目**: e（重庆中心）
- **特点**: 基于坐标距离计算分数
- **统计内容**: 中心点、距离分布、分数统计

### 6. numerical_based（数值统计型）
- **题目**: l（脏话牌）、m（火锅油碟）、n（打麻将）
- **特点**: 基于数值统计分析
- **统计内容**: 答案分布、数值统计、分数分布

### 7. weighted_average（加权平均型）
- **题目**: o1-o5（各种数值）
- **特点**: 基于实时平均值计算分数
- **统计内容**: 数值统计、分数分布

## 数据统计说明

- **原始数据**: 直接统计每个题目的答案和分数分布
- **独立分析**: 每个题目的数据独立统计，不考虑题目间关系
- **实时更新**: 统计数据实时更新，反映最新的答题情况

## 错误码说明

- **4001**: 缺少API Key
- **4003**: 无效的API Key
- **5000**: 服务器内部错误

## 使用场景

1. **管理后台**: 查看所有题目的答题情况和分布
2. **数据分析**: 分析用户答题模式和趋势
3. **实时监控**: 监控答题进度和质量
4. **报表生成**: 生成详细的统计报表

---

## 用户最终得分API

### 获取用户最终得分

**接口路径**: `GET /api/final-scores/{user_id}`  
**认证**: 需要API Key 或 用户ID认证  
**功能**: 获取指定用户的最终得分信息

**请求示例**:
```bash
# 使用API Key认证
curl -X GET "http://localhost:8080/api/final-scores/L0001" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json"

# 使用用户ID认证
curl -X GET "http://localhost:8080/api/final-scores/L0001" \
  -H "X-UserID: L0001" \
  -H "Content-Type: application/json"
```

**响应结构**:
```json
{
    "code": 0,
    "message": "获取成功",
    "data": {
        "user_id": "L0001",
        "x_axis_raw": 3,
        "y_axis_raw": 0,
        "x_axis_percent": 100,
        "y_axis_percent": 100,
        "x_axis_mapped": 100,
        "y_axis_mapped": 100
    }
}
```

**字段说明**:
- `user_id`: 用户ID
- `x_axis_raw`: x轴原始得分（题目a1+a2+b1+b2+b3+b4+b5+c1+c2+c3的分数总和）
- `y_axis_raw`: y轴原始得分（题目e+f+g+h1+h2+i+j+k+l+m+n+o1+o2+o3+o4+o5的分数总和）
- `x_axis_percent`: x轴百分比排名（0-100，100为最高分）
- `y_axis_percent`: y轴百分比排名（0-100，100为最高分）
- `x_axis_mapped`: x轴映射坐标（-100到100的坐标系）
- `y_axis_mapped`: y轴映射坐标（-100到100的坐标系）

**计算逻辑**:
1. **x轴题目**: a1（身份证）、a2（出生年份）、b1-b5（父母来源）、c1-c2（居住地）、c3（重庆时长）
2. **y轴题目**: e（重庆中心）、f（绕口令）、g（迷宫打卡）、h1-h2（切蛋糕）、i（乱劈柴）、j（夜景图片）、k（山火志愿）、l-n（数值题目）、o1-o5（加权平均题目）
3. **排名计算**: 按原始得分降序排序，第一名100%，最后一名0%
4. **坐标映射**: 将0-100%的百分比映射到-100到100的坐标系（公式：(百分比-50)*2）

---

## 通用错误码说明

```json
{
  "code": 4001,
  "message": "认证失败",
  "data": null
}
```

- **0**: 成功
- **2001**: 缺少必填字段（如用户ID）
- **4000**: 请求方法不允许
- **4001**: 认证失败 - API Key无效或缺失
- **4003**: 权限不足 - 用户无权访问指定资源
- **4004**: 资源不存在 - 请求的用户或数据不存在
- **5000**: 服务器内部错误 - 数据库连接失败等
- **5001**: 获取数据时出错

---

## Web端集成指南

### 1. 认证流程
1. **管理员用户**: 使用API Key进行认证，可访问所有API
2. **普通用户**: 使用预设的用户ID进行认证，只能访问自己的数据

### 2. 推荐的API调用顺序
1. 调用 `/api/questions/distribution` 获取题目分布统计
2. 调用 `/api/final-scores/{user_id}` 获取用户最终得分和排名

### 3. 错误处理
- 所有API都返回统一的错误格式
- 建议在前端实现重试机制
- 对于认证失败，引导用户重新登录

### 4. 数据缓存建议
- 题目分布数据建议缓存5-10分钟
- 用户最终得分数据建议实时获取或短时间缓存

### 5. 使用场景
- **坐标图表**: 在二维坐标系中展示用户位置（x轴和y轴坐标）
- **用户画像**: 基于x-y轴得分分析用户特征和类型
- **相对排名**: 显示用户在x轴和y轴上的相对排名百分比
- **统计分析**: 查看题目答案分布和统计信息
- **数据可视化**: 将用户分布在-100到100的坐标系中进行可视化展示