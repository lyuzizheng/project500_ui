# API Documentation

## 认证说明

所有API请求都需要在请求头中包含API Key：

```bash
-H "X-API-Key: your_api_key_here"
```

## A题组

## A1 - 身份证前三位

**Data Type:** boolean  
**Options:** "是", "否"  

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user001",
    "question_id": "a1",
    "answer": "是"
  }'
```

## A2 - 出生年份

**Data Type:** number  
**Options:** 任何年份数字 (int)  

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user001",
    "question_id": "a2",
    "answer": 1997
  }'
```

## B组题目

### B1 - 父母是否来自重庆

- **数据类型**: 字符串
- **选项**: "是+是", "是+否", "否+否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "b1",
    "answer": "是+是"
  }'
```

### B2 - 父母是否来自主城九区

- **数据类型**: 字符串
- **选项**: "是+是", "是+否", "否+否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "b2",
    "answer": "是+否"
  }'
```

### B3 - 是重庆的一方是否来自主城九区

- **数据类型**: 布尔值
- **选项**: "是", "否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "b3",
    "answer": true
  }'
```

### B4 - 非重庆的一方是否来自四川

- **数据类型**: 布尔值
- **选项**: "是", "否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "b4",
    "answer": false
  }'
```

### B5 - 父母是否来自四川

- **数据类型**: 字符串
- **选项**: "是+是", "是+否", "否+否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "b5",
    "answer": "否+否"
  }'
```

## C组题目

### C1 - 童年是否在重庆

- **数据类型**: 布尔值
- **选项**: "是", "否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "c1",
    "answer": true
  }'
```

### C2 - 常居地是否为重庆

- **数据类型**: 布尔值
- **选项**: "是", "否"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "c2",
    "answer": false
  }'
```

### C3 - 在重庆待的时长

- **数据类型**: 文本
- **格式**: "X年Y月"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "c3",
    "answer": "5年3月"
  }'
```

## D组题目

### D - 重庆人身份认同的核心矛盾

- **数据类型**: 字符串
- **选项**: "1"(区县), "2"(直辖), "3"(赛博)
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "d",
    "answer": "1"
  }'
```

## E组题目

### E - 重庆的中心

- **数据类型**: 坐标数组
- **格式**: [x, y] 坐标，x和y都在1-10范围内
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "e",
    "answer": [5, 6]
  }'
```

## F组题目

### F - 绕口令

- **数据类型**: 数字
- **格式**: 整数，表示出错次数
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "f",
    "answer": 2
  }'
```

## G组题目

### G - 迷宫打卡

- **数据类型**: 数字
- **格式**: 整数，表示打卡的地方数量（0-10）
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "g",
    "answer": 7
  }'
```

## H组题目

### H1 - 切蛋糕 - 区县

- **数据类型**: 数字
- **格式**: 数字，表示得分
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "h1",
    "answer": 85.5
  }'
```

### H2 - 切蛋糕 - 直辖

- **数据类型**: 数字
- **格式**: 数字，表示得分
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "h2",
    "answer": 92.0
  }'
```

## I组题目

### I - 乱劈柴

- **数据类型**: 数字
- **格式**: 整数，表示使用重庆言子儿的次数
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "i",
    "answer": 15
  }'
```

## J组题目

### J - 夜景图片

- **数据类型**: 字符串
- **选项**: "1", "2", "3", "4", "5", "6", "7"
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "j",
    "answer": "3"
  }'
```

## K组题目

### K - 山火志愿对象

- **数据类型**: 字符串
- **选项**: "1"(医疗队), "2"(摩托车队), "3"(油锯手队), "4"(不捐钱)
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "k",
    "answer": "2"
  }'
```

## L组题目

### L - 脏话牌

- **数据类型**: 数字
- **格式**: 整数，表示使用重庆脏话的次数
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "l",
    "answer": 3
  }'
```

## M组题目

### M - 火锅油碟

- **数据类型**: 字符串数组
- **选项**: 多选投票（1-18号选项）
- **cURL示例**:

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "m",
    "answer": ["1", "5", "12"]
  }'
```

## N组题目

### N：打麻将

- **数据类型**: number
- **格式**: 数字，表示番数
- **描述**: 打麻将，填空打麻将最高（）番

```bash
curl -X POST http://localhost:8080/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "question_id": "n",
    "answer": 13
  }'
```

## O组题目

### O1：身高

- **数据类型**: number
- **格式**: 数字cm
- **描述**: 身高，填空身高（）cm

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "o1",
     "answer": 175
   }'
```

### O2：社保年限

- **数据类型**: number
- **格式**: 数字（可以有小数）
- **描述**: 社保年限，填空缴纳社保（）年（可以有小数）

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "o2",
     "answer": 5.5
   }'
```

### O3：消费

- **数据类型**: number
- **格式**: 数字元
- **描述**: 消费，填空今天在山城巷消费（）元

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "o3",
     "answer": 200
   }'
```

### O4：游客量

- **数据类型**: integer
- **格式**: 整数
- **描述**: 游客量，填空带来（）游客（整数）

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "o4",
     "answer": 50
   }'
```

### O5：户口量

- **数据类型**: integer
- **格式**: 整数
- **描述**: 户口量，填空带来（）人（整数）

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "o5",
     "answer": 10
   }'
```

## P组题目

### P：MBTI

- **数据类型**: text
- **格式**: 文本
- **描述**: 请填写您的MBTI类型
- **注意**: 此题不计分

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "p",
     "answer": "INTJ"
   }'
```

## Q组题目

### Q1：称呼

- **数据类型**: text
- **格式**: 文本
- **描述**: 请填写您的称呼
- **注意**: 此题不计分

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "q1",
     "answer": "张三"
   }'
```

### Q2：性别

- **数据类型**: choice
- **选项**: "男", "女"
- **描述**: 请选择您的性别
- **注意**: 此题不计分

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "q2",
     "answer": "男"
   }'
```

## R组题目

### R：选游戏

- **数据类型**: choice
- **选项**:
  - "1" (脏话牌)
  - "2" (火锅油碟)
  - "3" (打麻将)
  - "4" (量身高等)
- **描述**: 选游戏：4选1
- **注意**: 此题计算百分比分布，作为其他题目的权重

```bash
curl -X POST http://localhost:8080/api/answers \
   -H "Content-Type: application/json" \
   -d '{
     "user_id": "user123",
     "question_id": "r",
     "answer": "1"
   }'
```




