# 游戏引擎API测试请求实例

服务器地址: <https://server500.actoria.top>

## 重要更新说明

### API认证
所有API请求现在都需要在请求头中包含API Key：
```
X-API-Key: your_secret_api_key_here
```

### 超时设置
- 服务器读取超时：5秒
- 服务器写入超时：5秒
- 请确保客户端请求在5秒内完成

### 环境变量配置
在`.env`文件中设置：
```
API_KEY=your_secret_api_key_here
```

## 1. 基础健康检查

### 1.1 简单健康检查
```bash
curl -X GET https://server500.actoria.top/hello
```

### 1.2 系统健康检查（数据库、Redis等）
```bash
curl -X GET https://server500.actoria.top/api/health
```

**响应示例（健康状态）：**
```json
{
  "code": 0,
  "message": "系统健康",
  "data": {
    "status": "healthy",
    "services": {
      "postgres": "healthy",
      "redis": "healthy"
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

**响应示例（不健康状态）：**
```json
{
  "code": 5003,
  "message": "系统不健康",
  "data": null
}
```

## 2. 题目列表和说明

### 重要说明：动态计分机制

从第二部分开始，部分题目采用了动态计分机制：

**第一类权重机制（基于D题）：**

- **B2、B3题目**：最终得分 = 基础分数 × D题区县百分比
- **B4、B5题目**：最终得分 = 基础分数 × D题直辖百分比
- **F题目**：根据A1题答案判断用户是否为重庆人，并基于重庆人群体出错分布智能排序

**第二类权重机制（基于R题）：**

- **L题目**：最终得分 = 基础分数 × R题脏话牌选择百分比
- **M题目**：最终得分 = 基础分数 × R题火锅油碟选择百分比
- **N题目**：最终得分 = 基础分数 × R题打麻将选择百分比
- **O1-O5题目**：最终得分 = 基础分数 × R题O系列选择百分比总和

这意味着这些题目的最终得分会根据D题（重庆人身份认同核心矛盾）和R题（选游戏）的统计结果动态调整。

### Q1 - 称呼 (不计分)

- **题目ID**: q1
- **类型**: text
- **说明**: 请填写您的称呼
- **计分**: 不计分
- **存储字段**: username

### Q2 - 性别 (不计分)

- **题目ID**: q2
- **类型**: choice
- **说明**: 请选择您的性别
- **选项**: ["男", "女"]
- **计分**: 不计分
- **存储字段**: gender

### A1 - 身份证前三位 (计分题)

- **题目ID**: a1
- **类型**: boolean
- **说明**: 您的身份证前三位是否为500？
- **计分**: 是的+1分，不是-1分
- **接口**: yes/no 或 true/false

### A2 - 出生年份 (计分题)

- **题目ID**: a2
- **类型**: number
- **说明**: 请填写您的出生年份
- **计分**: ≥1997年+1分，<1997年不得分
- **接口**: 数字格式

### P - MBTI (不计分)

- **题目ID**: p
- **类型**: text
- **说明**: 请填写您的MBTI类型
- **计分**: 不计分
- **存储字段**: mbti

## 3. 提交答案API测试

### 3.1 提交Q1答案 (称呼)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secret_api_key_here" \
  -d '{
    "user_id": "user001",
    "question_id": "q1",
    "answer": "张三"
  }'
```

### 3.2 提交Q2答案 (性别)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secret_api_key_here" \
  -d '{
    "user_id": "user001",
    "question_id": "q2",
    "answer": "男"
  }'
```

### 3.3 提交A1答案 (身份证前三位 - 是)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secret_api_key_here" \
  -d '{
    "user_id": "user001",
    "question_id": "a1",
    "answer": "yes"
  }'
```

### 3.4 提交A1答案 (身份证前三位 - 否)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user002",
    "question_id": "a1",
    "answer": "no"
  }'
```

### 3.5 提交A2答案 (出生年份 - 1997年及以后)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user001",
    "question_id": "a2",
    "answer": 1998
  }'
```

### 3.6 提交A2答案 (出生年份 - 1997年之前)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user002",
    "question_id": "a2",
    "answer": 1995
  }'
```

### 3.7 提交P答案 (MBTI)

```bash
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user001",
    "question_id": "p",
    "answer": "INTJ"
  }'
```

## 4. 查询用户答案API测试

### 4.1 获取用户所有答案

```bash
curl -X GET https://server500.actoria.top/api/answers/user001
```

### 4.2 获取另一个用户的所有答案

```bash
curl -X GET https://server500.actoria.top/api/answers/user002
```

### 4.3 清除所有答案数据

**⚠️ 危险操作：此操作将清除所有用户的答案和分数数据**

```bash
curl -X DELETE https://server500.actoria.top/api/answers/clear \
  -H "X-API-Key: your_secret_api_key_here"
```

**响应示例（成功）：**
```json
{
  "code": 0,
  "message": "所有答案数据已成功清除",
  "data": {
    "cleared_data": ["内存数据", "Redis缓存", "PostgreSQL数据"],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

**响应示例（错误）：**
```json
{
  "code": 5000,
  "message": "清除所有答案时出错: 具体错误信息",
  "data": null
}
```

**说明：**
- 此操作需要DELETE方法
- 需要API Key认证
- 将清除以下数据：
  - 内存中的所有问题答案和分数
  - Redis缓存中的所有答案、分数和统计数据
  - PostgreSQL数据库中用户记录的答案和分数字段
- 操作不可逆，请谨慎使用

## 5. 查询分数API测试

### 5.1 获取所有用户分数

```bash
curl -X GET https://server500.actoria.top/api/scores
```

### 5.2 获取特定用户分数

```bash
curl -X GET https://server500.actoria.top/api/scores/user001
```

### 5.3 获取另一个用户分数

```bash
curl -X GET https://server500.actoria.top/api/scores/user002
```

## 6. 完整测试流程示例

### 用户1完整答题流程 (预期得分: +2分)

```bash
# 1. 提交称呼
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_1", "question_id": "q1", "answer": "李四"}'

# 2. 提交性别
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_1", "question_id": "q2", "answer": "女"}'

# 3. 提交身份证前三位 (是500) - 得1分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_1", "question_id": "a1", "answer": "yes"}'

# 4. 提交出生年份 (1997年及以后) - 得1分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_1", "question_id": "a2", "answer": 2000}'

# 5. 提交MBTI
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_1", "question_id": "p", "answer": "ENFP"}'

# 6. 查看最终分数
curl -X GET https://server500.actoria.top/api/scores/test_user_1
```

### 用户2完整答题流程 (预期得分: -1分)

```bash
# 1. 提交称呼
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_2", "question_id": "q1", "answer": "王五"}'

# 2. 提交性别
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_2", "question_id": "q2", "answer": "男"}'

# 3. 提交身份证前三位 (不是500) - 得-1分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_2", "question_id": "a1", "answer": "no"}'

# 4. 提交出生年份 (1997年之前) - 得0分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_2", "question_id": "a2", "answer": 1990}'

# 5. 提交MBTI
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user_2", "question_id": "p", "answer": "ISTJ"}'

# 6. 查看最终分数
curl -X GET https://server500.actoria.top/api/scores/test_user_2
```

## 7. 错误测试用例

### 7.1 重复提交答案测试

```bash
# 第一次提交
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "duplicate_test", "question_id": "a1", "answer": "yes"}'

# 第二次提交同一题目 (应该返回错误)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "duplicate_test", "question_id": "a1", "answer": "no"}'
```

### 7.2 无效参数测试

```bash
# 缺少用户ID
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"question_id": "a1", "answer": "yes"}'

# 缺少题目ID
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "answer": "yes"}'

# 无效的题目ID
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "question_id": "invalid_q", "answer": "yes"}'
```

## 8. 数据验证检查点

### 8.1 A2题目计分逻辑验证

- **1997年及以后**: 应得1分
- **1997年之前**: 应得0分
- **测试用例**:
  - 1997 → 1分
  - 1998 → 1分
  - 2000 → 1分
  - 1996 → 0分
  - 1990 → 0分

### 8.2 A1题目计分逻辑验证

- **回答"是"**: 应得1分
- **回答"否"**: 应得-1分
- **支持的"是"格式**: "是", "true", "True", "YES", "yes", true
- **其他回答**: 应得-1分

### 8.3 数据存储验证

- Q1答案应存储到username字段
- Q2答案应存储到gender字段
- P答案应存储到mbti字段
- 所有答案都应保存在Redis中
- 分数计算应正确更新

## 9. 性能测试

### 9.1 并发提交测试

```bash
# 使用并发工具测试多用户同时提交
for i in {1..10}; do
  curl -X POST https://server500.actoria.top/api/answers \
    -H "Content-Type: application/json" \
    -d "{\"user_id\": \"concurrent_user_$i\", \"question_id\": \"a1\", \"answer\": \"yes\"}" &
done
wait
```

### 9.2 查询性能测试

```bash
# 测试大量查询请求
for i in {1..100}; do
  curl -X GET https://server500.actoria.top/api/scores &
done
wait
```

## 10. 预期响应格式

### 成功响应

```json
{
  "code": 0,
  "message": "提交成功",
  "data": {
    "question_score": 1.0,
    "total_score": 2.0
  }
}
```

### 错误响应

```json
{
  "code": 1000,
  "message": "用户已经回答过该问题",
  "data": null
}
```

## 11. 第二部分题目测试

### B1 - 父母是否来自重庆 (计分题)

- **题目ID**: b1
- **类型**: choice
- **说明**: 父母是否来自重庆？
- **选项**: ["是+是", "是+否", "否+否"]
- **计分**: 是+是：+1分，是+否：+0分，否+否：-1分

```bash
# 提交B1答案 - 是+是 (得1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b1_user1",
    "question_id": "b1",
    "answer": "是+是"
  }'

# 提交B1答案 - 是+否 (得0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b1_user2",
    "question_id": "b1",
    "answer": "是+否"
  }'

# 提交B1答案 - 否+否 (得-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b1_user3",
    "question_id": "b1",
    "answer": "否+否"
  }'
```

### B2 - 父母是否来自主城九区 (计分题)

- **题目ID**: b2
- **类型**: choice
- **说明**: 父母是否来自主城九区？
- **选项**: ["是+是", "是+否", "否+否"]
- **计分**: 基础分：是+是：+1分，是+否：+0.5分，否+否：0分；最终得分乘以D题区县百分比
- **依赖**: 依赖D题的区县百分比数据

```bash
# 提交B2答案 - 是+是 (得1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b2_user1",
    "question_id": "b2",
    "answer": "是+是"
  }'

# 提交B2答案 - 是+否 (得0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b2_user2",
    "question_id": "b2",
    "answer": "是+否"
  }'

# 提交B2答案 - 否+否 (得0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b2_user3",
    "question_id": "b2",
    "answer": "否+否"
  }'
```

### B3 - 是重庆的一方是否来自主城九区 (计分题)

- **题目ID**: b3
- **类型**: boolean
- **说明**: 是重庆的一方是否来自主城九区？
- **选项**: ["是", "否"]
- **计分**: 基础分：是：+1分，否：+0.5分；最终得分乘以D题区县百分比
- **依赖**: 依赖D题的区县百分比数据

```bash
# 提交B3答案 - 是 (得1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b3_user1",
    "question_id": "b3",
    "answer": "是"
  }'

# 提交B3答案 - 否 (得0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b3_user2",
    "question_id": "b3",
    "answer": "否"
  }'
```

### B4 - 非重庆的一方是否来自四川 (计分题)

- **题目ID**: b4
- **类型**: boolean
- **说明**: 非重庆的一方是否来自四川？
- **选项**: ["是", "否"]
- **计分**: 基础分：是：+1分，否：+0.5分；最终得分乘以D题直辖百分比
- **依赖**: 依赖D题的直辖百分比数据

```bash
# 提交B4答案 - 是 (得1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b4_user1",
    "question_id": "b4",
    "answer": "是"
  }'

# 提交B4答案 - 否 (得0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b4_user2",
    "question_id": "b4",
    "answer": "否"
  }'
```

### B5 - 父母是否来自四川 (计分题)

- **题目ID**: b5
- **类型**: choice
- **说明**: 父母是否来自四川？
- **选项**: ["是+是", "是+否", "否+否"]
- **计分**: 基础分：是+是：+0.5分，是+否：+0分，否+否：-1分；最终得分乘以D题直辖百分比
- **依赖**: 依赖D题的直辖百分比数据

```bash
# 提交B5答案 - 是+是 (得0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b5_user1",
    "question_id": "b5",
    "answer": "是+是"
  }'

# 提交B5答案 - 是+否 (得0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b5_user2",
    "question_id": "b5",
    "answer": "是+否"
  }'

# 提交B5答案 - 否+否 (得-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_b5_user3",
    "question_id": "b5",
    "answer": "否+否"
  }'
```

### C1 - 童年是否在重庆 (计分题)

- **题目ID**: c1
- **类型**: boolean
- **说明**: 童年是否在重庆？
- **选项**: ["是", "否"]
- **计分**: 是：+1分，否：-1分

```bash
# 提交C1答案 - 是 (得1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c1_user1",
    "question_id": "c1",
    "answer": "是"
  }'

# 提交C1答案 - 否 (得-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c1_user2",
    "question_id": "c1",
    "answer": "否"
  }'
```

### C2 - 常居地是否为重庆 (计分题)

- **题目ID**: c2
- **类型**: boolean
- **说明**: 常居地是否为重庆？
- **选项**: ["是", "否"]
- **计分**: 是：+1分，否：-1分

```bash
# 提交C2答案 - 是 (得1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c2_user1",
    "question_id": "c2",
    "answer": "是"
  }'

# 提交C2答案 - 否 (得-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c2_user2",
    "question_id": "c2",
    "answer": "否"
  }'
```

### C3 - 在重庆待的时长 (动态排序计分题)

- **题目ID**: c3
- **类型**: text
- **说明**: 在重庆待的时长（）年（）月
- **格式**: "X年Y月"
- **计分**: 根据时间长度进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，允许并列

```bash
# 提交C3答案 - 25年6月 (预期最高分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c3_user1",
    "question_id": "c3",
    "answer": "25年6月"
  }'

# 提交C3答案 - 20年3月
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c3_user2",
    "question_id": "c3",
    "answer": "20年3月"
  }'

# 提交C3答案 - 15年0月
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c3_user3",
    "question_id": "c3",
    "answer": "15年0月"
  }'

# 提交C3答案 - 5年6月 (预期最低分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c3_user4",
    "question_id": "c3",
    "answer": "5年6月"
  }'

# 提交C3答案 - 20年3月 (与user2并列)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_c3_user5",
    "question_id": "c3",
    "answer": "20年3月"
  }'
```

## 12. 第二部分完整测试流程

### 用户完整答题流程 (第二部分)

```bash
# 用户1: 重庆本地用户 (预期高分)
# B1: 父母都来自重庆 (+1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "b1", "answer": "是+是"}'

# B2: 父母都来自主城九区 (+1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "b2", "answer": "是+是"}'

# B3: 是重庆的一方来自主城九区 (+1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "b3", "answer": "是"}'

# B4: 非重庆的一方来自四川 (+1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "b4", "answer": "是"}'

# B5: 父母都来自四川 (+0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "b5", "answer": "是+是"}'

# C1: 童年在重庆 (+1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "c1", "answer": "是"}'

# C2: 常居地为重庆 (+1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "c2", "answer": "是"}'

# C3: 在重庆待了30年 (预期高分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "cq_local_user", "question_id": "c3", "answer": "30年0月"}'

# 查看用户1的分数
curl -X GET https://server500.actoria.top/api/scores/cq_local_user
```

```bash
# 用户2: 外地用户 (预期低分)
# B1: 父母都不来自重庆 (-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "b1", "answer": "否+否"}'

# B2: 父母都不来自主城九区 (0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "b2", "answer": "否+否"}'

# B3: 是重庆的一方不来自主城九区 (+0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "b3", "answer": "否"}'

# B4: 非重庆的一方不来自四川 (+0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "b4", "answer": "否"}'

# B5: 父母都不来自四川 (-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "b5", "answer": "否+否"}'

# C1: 童年不在重庆 (-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "c1", "answer": "否"}'

# C2: 常居地不为重庆 (-1分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "c2", "answer": "否"}'

# C3: 在重庆待了2年 (预期低分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outside_user", "question_id": "c3", "answer": "2年0月"}'

# 查看用户2的分数
curl -X GET https://server500.actoria.top/api/scores/outside_user
```

## 13. C3题目排序测试

### 测试C3题目的动态排序功能

```bash
# 创建5个用户测试排序
# 用户1: 30年 (预期得分: 1.0)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "sort_test_1", "question_id": "c3", "answer": "30年0月"}'

# 用户2: 25年 (预期得分: 0.75)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "sort_test_2", "question_id": "c3", "answer": "25年0月"}'

# 用户3: 20年 (预期得分: 0.5)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "sort_test_3", "question_id": "c3", "answer": "20年0月"}'

# 用户4: 20年 (与用户3并列，预期得分: 0.5)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "sort_test_4", "question_id": "c3", "answer": "20年0月"}'

# 用户5: 10年 (预期得分: 0.0)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "sort_test_5", "question_id": "c3", "answer": "10年0月"}'

# 查看所有用户的C3分数
for i in {1..5}; do
  echo "用户 sort_test_$i 的分数:"
  curl -X GET https://server500.actoria.top/api/scores/sort_test_$i
  echo ""
done
```

## 14. 第二部分题目验证检查点

### B系列题目计分验证

- **B1**: 是+是(+1), 是+否(0), 否+否(-1)
- **B2**: 是+是(+1), 是+否(+0.5), 否+否(0)
- **B3**: 是(+1), 否(+0.5)
- **B4**: 是(+1), 否(+0.5)
- **B5**: 是+是(+0.5), 是+否(0), 否+否(-1)

### C系列题目计分验证

- **C1**: 是(+1), 否(-1)
- **C2**: 是(+1), 否(-1)
- **C3**: 动态排序，最高分1分，最低分0分，支持并列

### 预期总分计算

- **重庆本地用户**: B1(1) + B2(1) + B3(1) + B4(1) + B5(0.5) + C1(1) + C2(1) + C3(高分) = 约7.5分+
- **外地用户**: B1(-1) + B2(0) + B3(0.5) + B4(0.5) + B5(-1) + C1(-1) + C2(-1) + C3(低分) = 约-3分+

---

# 第三部分题目 API 测试

## 15. 第三部分题目说明

### D - 重庆人身份认同的核心矛盾 (权重计算题)

- **题目ID**: d
- **类型**: choice
- **说明**: 维度选择：重庆人身份认同的核心矛盾
- **选项**: ["1"(区县), "2"(直辖), "3"(赛博)]
- **计分**: 本题不直接计分，计算百分比分布作为其他题目的权重
- **权重关联**:
  - D1%(区县) → 关联问题 b2, b3, h1
  - D2%(直辖) → 关联问题 b4, b5, h2
  - D3%(赛博) → 关联问题 g, b5, i, j, k

### E - 重庆的中心 (坐标题)

- **题目ID**: e
- **类型**: coordinate
- **说明**: 重庆的中心坐标选择
- **格式**: [x, y] 坐标数组，x和y都在1-10范围内
- **计分**: 和大多数人分布越近分数越高，最高分1分，最低分0分

### F - 绕口令 (动态排序题)

- **题目ID**: f
- **类型**: number
- **说明**: 绕口令出错次数
- **格式**: 整数，表示出错次数
- **计分**: 先判断重庆人群体出错分布，决定排序方式，然后排序给分
- **依赖**: 需要a1题目的答案来判断重庆人身份

### G - 迷宫打卡 (固定计分题)

- **题目ID**: g
- **类型**: number
- **说明**: 迷宫打卡地点数量
- **格式**: 整数，表示打卡的地方数量（0-10）
- **计分**: 0处=0分，1处=0.1分，2处=0.2分，...，10处=1分
- **最终计分**: 基础分数需要乘以d题的D3百分比

## 16. D题测试 (权重计算)

### D题基础测试

```bash
# 用户1选择区县
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "d_test_user1",
    "question_id": "d",
    "answer": "1"
  }'

# 用户2选择直辖
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "d_test_user2",
    "question_id": "d",
    "answer": "2"
  }'

# 用户3选择赛博
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "d_test_user3",
    "question_id": "d",
    "answer": "3"
  }'

# 用户4选择赛博
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "d_test_user4",
    "question_id": "d",
    "answer": "3"
  }'
```

### D题百分比验证

```bash
# 查看D题的统计信息和百分比分布
# 预期结果: 区县25%, 直辖25%, 赛博50%
for i in {1..4}; do
  echo "用户 d_test_user$i 的D题分数:"
  curl -X GET https://server500.actoria.top/api/scores/d_test_user$i
  echo ""
done
```

## 17. E题测试 (坐标分布)

### E题基础测试

```bash
# 用户1选择中心点附近 [5, 5]
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "e_test_user1",
    "question_id": "e",
    "answer": [5, 5]
  }'

# 用户2选择中心点附近 [5, 6]
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "e_test_user2",
    "question_id": "e",
    "answer": [5, 6]
  }'

# 用户3选择中心点附近 [6, 5]
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "e_test_user3",
    "question_id": "e",
    "answer": [6, 5]
  }'

# 用户4选择边缘点 [1, 1]
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "e_test_user4",
    "question_id": "e",
    "answer": [1, 1]
  }'

# 用户5选择边缘点 [10, 10]
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "e_test_user5",
    "question_id": "e",
    "answer": [10, 10]
  }'
```

### E题分数验证

```bash
# 查看E题的分数分布
# 预期: 中心点附近的用户得分较高，边缘用户得分较低
for i in {1..5}; do
  echo "用户 e_test_user$i 的E题分数:"
  curl -X GET https://server500.actoria.top/api/scores/e_test_user$i
  echo ""
done
```

## 18. F题测试 (绕口令动态排序)

### F题前置条件 - 设置A1答案

```bash
# 先为测试用户设置A1答案（重庆人身份）
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user1",
    "question_id": "a1",
    "answer": "yes"
  }'

curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user2",
    "question_id": "a1",
    "answer": "yes"
  }'

curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user3",
    "question_id": "a1",
    "answer": "yes"
  }'

curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user4",
    "question_id": "a1",
    "answer": "no"
  }'
```

### F题出错次数测试

```bash
# 重庆人用户1: 0次出错
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user1",
    "question_id": "f",
    "answer": 0
  }'

# 重庆人用户2: 1次出错
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user2",
    "question_id": "f",
    "answer": 1
  }'

# 重庆人用户3: 2次出错
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user3",
    "question_id": "f",
    "answer": 2
  }'

# 非重庆人用户4: 1次出错
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "f_test_user4",
    "question_id": "f",
    "answer": 1
  }'
```

### F题排序验证

```bash
# 查看F题的排序结果
# 重庆人中出错>0的人更多，所以按出错次数正序排序（出错少的排名高）
for i in {1..4}; do
  echo "用户 f_test_user$i 的F题分数:"
  curl -X GET https://server500.actoria.top/api/scores/f_test_user$i
  echo ""
done
```

## 19. G题测试 (迷宫打卡)

### G题基础测试

```bash
# 用户1: 0个打卡点 (0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "g_test_user1",
    "question_id": "g",
    "answer": 0
  }'

# 用户2: 3个打卡点 (0.3分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "g_test_user2",
    "question_id": "g",
    "answer": 3
  }'

# 用户3: 5个打卡点 (0.5分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "g_test_user3",
    "question_id": "g",
    "answer": 5
  }'

# 用户4: 10个打卡点 (1.0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "g_test_user4",
    "question_id": "g",
    "answer": 10
  }'

# 用户5: 超出范围测试 (应该被限制为10，得1.0分)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "g_test_user5",
    "question_id": "g",
    "answer": 15
  }'
```

### G题分数验证

```bash
# 查看G题的基础分数
# 注意：最终分数需要乘以D题的D3百分比
for i in {1..5}; do
  echo "用户 g_test_user$i 的G题分数:"
  curl -X GET https://server500.actoria.top/api/scores/g_test_user$i
  echo ""
done
```

## 20. 第三部分综合测试

### 完整用户测试流程

```bash
# 用户comprehensive_test_1的完整答题
# 1. 设置重庆人身份
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "comprehensive_test_1", "question_id": "a1", "answer": "yes"}'

# 2. 选择赛博维度
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "comprehensive_test_1", "question_id": "d", "answer": "3"}'

# 3. 选择中心坐标
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "comprehensive_test_1", "question_id": "e", "answer": [5, 5]}'

# 4. 绕口令0次出错
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "comprehensive_test_1", "question_id": "f", "answer": 0}'

# 5. 迷宫打卡8个点
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "comprehensive_test_1", "question_id": "g", "answer": 8}'

# 查看最终分数
curl -X GET https://server500.actoria.top/api/scores/comprehensive_test_1
```

## 21. 第三部分验证检查点

### D题验证要点

- 本题不直接计分，所有用户得分应为0
- 计算各选项的百分比分布
- 百分比信息存储在metadata中供其他题目使用

### E题验证要点

- 计算所有坐标的中心点
- 距离中心点越近得分越高
- 最高分1分，最低分0分
- 支持坐标范围验证（1-10）

### F题验证要点

- 依赖A1题目判断重庆人身份
- 根据重庆人群体的出错分布决定排序方式
- 动态排序给分，支持并列情况
- 最高分1分，最低分0分

### G题验证要点

- 固定计分：每个打卡点0.1分
- 范围限制：0-10个打卡点
- 基础分数计算正确
- 最终需要乘以D题的D3百分比（在最终计分时处理）

### 第三部分预期得分范围

- **D题**: 0分（权重计算题）
- **E题**: 0-1分（坐标分布题）
- **F题**: 0-1分（动态排序题）
- **G题**: 0-1分（固定计分题，最终需乘权重）

## 14. 第四部分题目测试

### H1 - 切蛋糕 - 区县 (动态排序计分题)

- **题目ID**: h1
- **类型**: number
- **说明**: 切蛋糕 - 区县，填空得分
- **计分**: 根据所填得分进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，最终得分乘以D题区县百分比
- **依赖**: 依赖D题的区县百分比作为权重

```bash
# 提交H1答案 - 高分 (预期排名靠前)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h1_user1",
    "question_id": "h1",
    "answer": 95
  }'

# 提交H1答案 - 中等分数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h1_user2",
    "question_id": "h1",
    "answer": 80
  }'

# 提交H1答案 - 低分 (预期排名靠后)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h1_user3",
    "question_id": "h1",
    "answer": 60
  }'

# 提交H1答案 - 并列分数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h1_user4",
    "question_id": "h1",
    "answer": 80
  }'
```

### H2 - 切蛋糕 - 直辖 (动态排序计分题)

- **题目ID**: h2
- **类型**: number
- **说明**: 切蛋糕 - 直辖，填空得分
- **计分**: 根据所填得分进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，最终得分乘以D题直辖百分比
- **依赖**: 依赖D题的直辖百分比作为权重

```bash
# 提交H2答案 - 高分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h2_user1",
    "question_id": "h2",
    "answer": 88
  }'

# 提交H2答案 - 中等分数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h2_user2",
    "question_id": "h2",
    "answer": 75
  }'

# 提交H2答案 - 低分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_h2_user3",
    "question_id": "h2",
    "answer": 65
  }'
```

### I - 乱劈柴 (动态排序计分题)

- **题目ID**: i
- **类型**: number
- **说明**: 乱劈柴，填空使用重庆言子儿次数
- **计分**: 根据所填次数进行实时排序，根据实时排名进行给分，最高分1分，最低分0分，最终得分乘以D题赛博百分比
- **依赖**: 依赖D题的赛博百分比作为权重

```bash
# 提交I答案 - 高次数 (预期排名靠前)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_i_user1",
    "question_id": "i",
    "answer": 15
  }'

# 提交I答案 - 中等次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_i_user2",
    "question_id": "i",
    "answer": 8
  }'

# 提交I答案 - 低次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_i_user3",
    "question_id": "i",
    "answer": 3
  }'

# 提交I答案 - 零次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_i_user4",
    "question_id": "i",
    "answer": 0
  }'
```

### J - 夜景图片 (投票分布计分题)

- **题目ID**: j
- **类型**: choice
- **说明**: 夜景图片，7选1
- **选项**: ["1", "2", "3", "4", "5", "6", "7"]
- **计分**: 投票题，根据投票分布计算得分，越和大多数人相似分数越高，最终得分乘以D题赛博百分比
- **依赖**: 依赖D题的赛博百分比作为权重

```bash
# 提交J答案 - 选择1号 (假设这是热门选项)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_j_user1",
    "question_id": "j",
    "answer": "1"
  }'

# 提交J答案 - 选择1号 (增加1号的票数)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_j_user2",
    "question_id": "j",
    "answer": "1"
  }'

# 提交J答案 - 选择3号 (少数选择)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_j_user3",
    "question_id": "j",
    "answer": "3"
  }'

# 提交J答案 - 选择1号 (进一步增加1号票数)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_j_user4",
    "question_id": "j",
    "answer": "1"
  }'

# 提交J答案 - 选择5号 (另一个少数选择)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_j_user5",
    "question_id": "j",
    "answer": "5"
  }'
```

### K - 山火志愿对象 (投票排名计分题)

- **题目ID**: k
- **类型**: choice
- **说明**: 山火志愿对象，4选1
- **选项**: ["1": "医疗队", "2": "摩托车队", "3": "油锯手队", "4": "不捐钱"]
- **计分**: 投票题，根据投票进行实时得票排名给分，最高分1分，最低分0分，最终得分乘以D题赛博百分比
- **依赖**: 依赖D题的赛博百分比作为权重

```bash
# 提交K答案 - 选择1号医疗队
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_k_user1",
    "question_id": "k",
    "answer": "1"
  }'

# 提交K答案 - 选择2号摩托车队
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_k_user2",
    "question_id": "k",
    "answer": "2"
  }'

# 提交K答案 - 选择1号医疗队 (增加医疗队票数)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_k_user3",
    "question_id": "k",
    "answer": "1"
  }'

# 提交K答案 - 选择3号油锯手队
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_k_user4",
    "question_id": "k",
    "answer": "3"
  }'

# 提交K答案 - 选择1号医疗队 (进一步增加医疗队票数)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_k_user5",
    "question_id": "k",
    "answer": "1"
  }'

# 提交K答案 - 选择4号不捐钱
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_k_user6",
    "question_id": "k",
    "answer": "4"
  }'
```

### R - 选游戏 (权重分配题)

- **题目ID**: r
- **类型**: choice
- **说明**: 选择你想玩的游戏
- **选项**: ["脏话牌", "火锅油碟", "打麻将", "量身高", "社保年限", "消费", "游客量", "户口量"]
- **计分**: 本题不计分，但统计各选项的选择百分比作为对应题目的权重
- **权重分配**:
  - r1_percentage: 脏话牌选择百分比，影响L题最终得分
  - r2_percentage: 火锅油碟选择百分比，影响M题最终得分
  - r3_percentage: 打麻将选择百分比，影响N题最终得分
  - r4_percentage: 量身高+社保年限+消费+游客量+户口量选择百分比总和，影响O1-O5题最终得分

```bash
# 提交R答案 - 选择脏话牌
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_r_user1",
    "question_id": "r",
    "answer": "脏话牌"
  }'

# 提交R答案 - 选择火锅油碟
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_r_user2",
    "question_id": "r",
    "answer": "火锅油碟"
  }'

# 提交R答案 - 选择打麻将
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_r_user3",
    "question_id": "r",
    "answer": "打麻将"
  }'

# 提交R答案 - 选择量身高
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_r_user4",
    "question_id": "r",
    "answer": "量身高"
  }'
```

### L - 脏话牌 (条件排序计分题)

- **题目ID**: l
- **类型**: number
- **说明**: 脏话牌，填空使用重庆脏话次数
- **计分**: 先判断次数=0和次数>0的人数分布，决定排序方式，然后排序给分，最高分1分，最低分0分
- **依赖**: 最终得分 = 基础分数 × R题脏话牌选择百分比

```bash
# 提交L答案 - 零次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_l_user1",
    "question_id": "l",
    "answer": 0
  }'

# 提交L答案 - 零次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_l_user2",
    "question_id": "l",
    "answer": 0
  }'

# 提交L答案 - 有次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_l_user3",
    "question_id": "l",
    "answer": 5
  }'

# 提交L答案 - 零次数 (使零次数占多数)
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_l_user4",
    "question_id": "l",
    "answer": 0
  }'

# 提交L答案 - 有次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_l_user5",
    "question_id": "l",
    "answer": 3
  }'
```

## 15. 第四部分完整测试流程

### 用户完整答题流程 (第四部分)

```bash
# 用户1: 高分用户 (预期在各题中排名靠前)
# H1: 切蛋糕区县 - 高分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_high_user", "question_id": "h1", "answer": 92}'

# H2: 切蛋糕直辖 - 高分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_high_user", "question_id": "h2", "answer": 89}'

# I: 乱劈柴 - 高次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_high_user", "question_id": "i", "answer": 12}'

# J: 夜景图片 - 选择热门选项
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_high_user", "question_id": "j", "answer": "1"}'

# K: 山火志愿 - 选择热门选项
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_high_user", "question_id": "k", "answer": "1"}'

# L: 脏话牌 - 零次数（假设零次数占多数，则高分）
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_high_user", "question_id": "l", "answer": 0}'

# 查看用户1的分数
curl -X GET https://server500.actoria.top/api/scores/part4_high_user
```

```bash
# 用户2: 低分用户 (预期在各题中排名靠后)
# H1: 切蛋糕区县 - 低分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_low_user", "question_id": "h1", "answer": 65}'

# H2: 切蛋糕直辖 - 低分
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_low_user", "question_id": "h2", "answer": 58}'

# I: 乱劈柴 - 低次数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_low_user", "question_id": "i", "answer": 2}'

# J: 夜景图片 - 选择冷门选项
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_low_user", "question_id": "j", "answer": "7"}'

# K: 山火志愿 - 选择冷门选项
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_low_user", "question_id": "k", "answer": "4"}'

# L: 脏话牌 - 高次数（假设零次数占多数，则低分）
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part4_low_user", "question_id": "l", "answer": 8}'

# 查看用户2的分数
curl -X GET https://server500.actoria.top/api/scores/part4_low_user
```

## 16. 第四部分验证要点

### H1题验证要点

- 根据填写得分进行排序
- 最高分1分，最低分0分，支持并列
- 最终得分需要乘以D题的D1百分比
- 分数保留3位小数

### H2题验证要点

- 根据填写得分进行排序
- 最高分1分，最低分0分，支持并列
- 最终得分需要乘以D题的D2百分比
- 分数保留3位小数

### I题验证要点

- 根据使用次数进行排序（次数越多排名越高）
- 最高分1分，最低分0分，支持并列
- 最终得分需要乘以D题的D3百分比
- 分数保留3位小数

### J题验证要点

- 投票分布计分，选择热门选项得高分
- 支持多个众数的情况
- 最高分1分，最低分0分
- 最终得分需要乘以D题的D3百分比
- 分数保留3位小数

### K题验证要点

- 投票排名计分，得票多的选项对应用户得高分
- 支持并列排名的情况
- 最高分1分，最低分0分
- 最终得分需要乘以D题的D3百分比
- 分数保留3位小数

### L题验证要点

- 先判断次数=0和次数>0的人数分布
- 根据分布决定排序方式（正序或倒序）
- 最高分1分，最低分0分，支持并列
- 无权重依赖
- 分数保留3位小数

### 第四部分预期得分范围

- **H1题**: 0-1分（动态排序题，最终需乘D1权重）
- **H2题**: 0-1分（动态排序题，最终需乘D2权重）
- **I题**: 0-1分（动态排序题，最终需乘D3权重）
- **J题**: 0-1分（投票分布题，最终需乘D3权重）
- **K题**: 0-1分（投票排名题，最终需乘D3权重）
- **L题**: 0-1分（条件排序题，无权重依赖）

### 权重依赖关系验证

- **D1权重影响**: H1题
- **D2权重影响**: H2题
- **D3权重影响**: I题、J题、K题
- **无权重依赖**: L题

### 动态计分验证

- 所有第四部分题目都支持实时重新计算
- 新用户提交答案后，所有相关用户的分数会重新计算
- 权重变化（D题答案变化）会影响相关题目的最终得分

## 17. 第五部分题目测试

### M - 火锅油碟 (多选投票题)

- **题目ID**: m
- **类型**: multi_choice
- **说明**: 火锅油碟，多选投票（1-18号选项）
- **计分**: 根据各选项的实时得票分布进行排名给分，和选择最多的人越靠近得分越高
- **分数范围**: 0-1分
- **依赖**: 最终得分 = 基础分数 × R题火锅油碟选择百分比
- **接口**: 数组格式，如 ["1", "3", "5"]

### N - 打麻将 (排序题)

- **题目ID**: n
- **类型**: number
- **说明**: 打麻将，填空番数（）番
- **计分**: 根据所填番数进行实时排序，根据实时排名进行给分
- **分数范围**: 0-1分
- **依赖**: 最终得分 = 基础分数 × R题打麻将选择百分比
- **接口**: 数字格式

### O1 - 身高 (平均值接近度题)

- **题目ID**: o1
- **类型**: number
- **说明**: 身高，填空身高（）cm
- **计分**: 根据当前所有参与o1的人的数据计算实时平均数，与实时平均数越接近得分越高
- **分数范围**: 0-0.2分
- **依赖**: 最终得分 = 基础分数 × R题O系列选择百分比总和
- **接口**: 数字格式

### O2 - 社保年限 (排序题)

- **题目ID**: o2
- **类型**: number
- **说明**: 社保年限，填空缴纳社保（）年（可以有小数）
- **计分**: 根据所填年数进行实时排序，根据实时排名进行给分
- **分数范围**: 0-0.2分
- **依赖**: 最终得分 = 基础分数 × R题O系列选择百分比总和
- **接口**: 数字格式（支持小数）

### O3 - 消费 (排序题)

- **题目ID**: o3
- **类型**: number
- **说明**: 消费，填空今天在山城巷消费（）元
- **计分**: 根据所填消费金额进行实时排序，根据实时排名进行给分
- **分数范围**: 0-0.2分
- **依赖**: 最终得分 = 基础分数 × R题O系列选择百分比总和
- **接口**: 数字格式

### O4 - 游客量 (排序题)

- **题目ID**: o4
- **类型**: integer
- **说明**: 游客量，填空带来（）游客（整数）
- **计分**: 根据所填游客人数进行实时排序，根据实时排名进行给分
- **分数范围**: 0-0.2分
- **依赖**: 最终得分 = 基础分数 × R题O系列选择百分比总和
- **接口**: 整数格式

### O5 - 户口量 (排序题)

- **题目ID**: o5
- **类型**: integer
- **说明**: 户口量，填空带来（）人（整数）
- **计分**: 根据所填人数进行实时排序，根据实时排名进行给分
- **分数范围**: 0-0.2分
- **依赖**: 最终得分 = 基础分数 × R题O系列选择百分比总和
- **接口**: 整数格式

## 18. 第五部分API测试请求

```bash
# 第五部分测试 - 用户1

# M: 火锅油碟 - 多选投票（选择1,3,5,7号选项）
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "m", "answer": ["1", "3", "5", "7"]}'

# N: 打麻将 - 高番数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "n", "answer": 8}'

# O1: 身高 - 175cm
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "o1", "answer": 175}'

# O2: 社保年限 - 5.5年
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "o2", "answer": 5.5}'

# O3: 消费 - 280元
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "o3", "answer": 280}'

# O4: 游客量 - 15人
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "o4", "answer": 15}'

# O5: 户口量 - 3人
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user1", "question_id": "o5", "answer": 3}'

# 查看用户1的分数
curl -X GET https://server500.actoria.top/api/scores/part5_user1
```

```bash
# 第五部分测试 - 用户2

# M: 火锅油碟 - 多选投票（选择1,2,3号选项，与用户1有重叠）
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "m", "answer": ["1", "2", "3"]}'

# N: 打麻将 - 中等番数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "n", "answer": 5}'

# O1: 身高 - 168cm
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "o1", "answer": 168}'

# O2: 社保年限 - 3.2年
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "o2", "answer": 3.2}'

# O3: 消费 - 150元
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "o3", "answer": 150}'

# O4: 游客量 - 8人
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "o4", "answer": 8}'

# O5: 户口量 - 1人
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user2", "question_id": "o5", "answer": 1}'

# 查看用户2的分数
curl -X GET https://server500.actoria.top/api/scores/part5_user2
```

```bash
# 第五部分测试 - 用户3

# M: 火锅油碟 - 多选投票（选择不同的选项组合）
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "m", "answer": ["10", "11", "12", "13", "14"]}'

# N: 打麻将 - 低番数
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "n", "answer": 2}'

# O1: 身高 - 182cm
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "o1", "answer": 182}'

# O2: 社保年限 - 8.7年
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "o2", "answer": 8.7}'

# O3: 消费 - 420元
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "o3", "answer": 420}'

# O4: 游客量 - 25人
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "o4", "answer": 25}'

# O5: 户口量 - 5人
curl -X POST https://server500.actoria.top/api/answers \
  -H "Content-Type: application/json" \
  -d '{"user_id": "part5_user3", "question_id": "o5", "answer": 5}'

# 查看用户3的分数
curl -X GET https://server500.actoria.top/api/scores/part5_user3
```

## 19. 第五部分验证要点

### M题验证要点

- 多选投票题，支持选择多个选项（1-18号）
- 根据选择相似度计算得分，与大多数人选择越相似得分越高
- 使用Jaccard相似度算法计算用户间选择的相似性
- 最高分1分，最低分0分，支持并列
- 分数保留3位小数
- 无权重依赖

### N题验证要点

- 根据番数进行排序（番数越高排名越高）
- 最高分1分，最低分0分，支持并列
- 分数保留3位小数
- 无权重依赖

### O1题验证要点

- 计算所有参与者身高的实时平均值
- 与平均值越接近得分越高
- 最高分0.2分，最低分0分
- 分数保留3位小数
- 无权重依赖

### O2题验证要点

- 根据社保年限进行排序（年限越长排名越高）
- 支持小数年限
- 最高分0.2分，最低分0分，支持并列
- 分数保留3位小数
- 无权重依赖

### O3题验证要点

- 根据消费金额进行排序（金额越高排名越高）
- 最高分0.2分，最低分0分，支持并列
- 分数保留3位小数
- 无权重依赖

### O4题验证要点

- 根据游客数量进行排序（数量越多排名越高）
- 只接受整数输入
- 最高分0.2分，最低分0分，支持并列
- 分数保留3位小数
- 无权重依赖

### O5题验证要点

- 根据人数进行排序（人数越多排名越高）
- 只接受整数输入
- 最高分0.2分，最低分0分，支持并列
- 分数保留3位小数
- 无权重依赖

### 第五部分预期得分范围

- **M题**: 0-1分（多选投票相似度题）
- **N题**: 0-1分（番数排序题）
- **O1题**: 0-0.2分（身高平均值接近度题）
- **O2题**: 0-0.2分（社保年限排序题）
- **O3题**: 0-0.2分（消费金额排序题）
- **O4题**: 0-0.2分（游客数量排序题）
- **O5题**: 0-0.2分（人数排序题）

### 第五部分特点

- 所有题目都无权重依赖，不受D题影响
- O系列题目最高分均为0.2分，体现其在总分中的权重较小
- M题采用创新的多选相似度算法
- 所有题目都支持实时重新计算和并列排名
- 分数精度统一保留3位小数
