# 游戏引擎API测试请求实例

服务器地址: https://server500.actoria.top

## 1. 基础健康检查

```bash
curl -X GET https://server500.actoria.top/hello
```

## 2. 题目列表和说明

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
- **计分**: 是+是：+1分，是+否：+0.5分，否+否：0分

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
- **计分**: 是：+1分，否：+0.5分

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
- **计分**: 是：+1分，否：+0.5分

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
- **计分**: 是+是：+0.5分，是+否：+0分，否+否：-1分

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