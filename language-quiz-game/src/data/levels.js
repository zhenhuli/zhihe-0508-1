const levels = [
  {
    id: 1,
    name: '入门级 - 基础词汇',
    language: 'en',
    difficulty: 1,
    questions: [
      {
        id: 1,
        word: 'apple',
        meaning: '苹果',
        options: ['苹果', '香蕉', '橙子', '葡萄'],
        correct: 0
      },
      {
        id: 2,
        word: 'book',
        meaning: '书',
        options: ['笔', '书', '桌子', '椅子'],
        correct: 1
      },
      {
        id: 3,
        word: 'cat',
        meaning: '猫',
        options: ['狗', '鸟', '猫', '鱼'],
        correct: 2
      },
      {
        id: 4,
        word: 'dog',
        meaning: '狗',
        options: ['猫', '狗', '老虎', '狮子'],
        correct: 1
      },
      {
        id: 5,
        word: 'water',
        meaning: '水',
        options: ['火', '土', '水', '风'],
        correct: 2
      }
    ]
  },
  {
    id: 2,
    name: '初级 - 日常用语',
    language: 'en',
    difficulty: 2,
    questions: [
      {
        id: 1,
        word: 'hello',
        meaning: '你好',
        options: ['再见', '谢谢', '你好', '对不起'],
        correct: 2
      },
      {
        id: 2,
        word: 'family',
        meaning: '家庭',
        options: ['朋友', '家庭', '同事', '邻居'],
        correct: 1
      },
      {
        id: 3,
        word: 'school',
        meaning: '学校',
        options: ['医院', '学校', '商店', '公园'],
        correct: 1
      },
      {
        id: 4,
        word: 'friend',
        meaning: '朋友',
        options: ['敌人', '朋友', '陌生人', '老师'],
        correct: 1
      },
      {
        id: 5,
        word: 'happy',
        meaning: '快乐的',
        options: ['悲伤的', '愤怒的', '快乐的', '害怕的'],
        correct: 2
      }
    ]
  },
  {
    id: 3,
    name: '中级 - 进阶词汇',
    language: 'en',
    difficulty: 3,
    questions: [
      {
        id: 1,
        word: 'beautiful',
        meaning: '美丽的',
        options: ['丑陋的', '美丽的', '普通的', '奇怪的'],
        correct: 1
      },
      {
        id: 2,
        word: 'important',
        meaning: '重要的',
        options: ['重要的', '次要的', '普通的', '无用的'],
        correct: 0
      },
      {
        id: 3,
        word: 'experience',
        meaning: '经验',
        options: ['知识', '技能', '经验', '学历'],
        correct: 2
      },
      {
        id: 4,
        word: 'understand',
        meaning: '理解',
        options: ['误解', '理解', '忘记', '记住'],
        correct: 1
      },
      {
        id: 5,
        word: 'opportunity',
        meaning: '机会',
        options: ['挑战', '困难', '机会', '失败'],
        correct: 2
      }
    ]
  },
  {
    id: 4,
    name: '日语入门',
    language: 'ja',
    difficulty: 1,
    questions: [
      {
        id: 1,
        word: 'こんにちは',
        meaning: '你好',
        options: ['早上好', '你好', '晚上好', '再见'],
        correct: 1
      },
      {
        id: 2,
        word: 'ありがとう',
        meaning: '谢谢',
        options: ['对不起', '请', '谢谢', '不客气'],
        correct: 2
      },
      {
        id: 3,
        word: 'さようなら',
        meaning: '再见',
        options: ['你好', '谢谢', '再见', '对不起'],
        correct: 2
      },
      {
        id: 4,
        word: 'すみません',
        meaning: '对不起',
        options: ['谢谢', '对不起', '请', '你好'],
        correct: 1
      },
      {
        id: 5,
        word: 'はい',
        meaning: '是',
        options: ['不', '是', '也许', '可能'],
        correct: 1
      }
    ]
  },
  {
    id: 5,
    name: '高级 - 商务词汇',
    language: 'en',
    difficulty: 4,
    questions: [
      {
        id: 1,
        word: 'negotiation',
        meaning: '谈判',
        options: ['会议', '谈判', '报告', '讨论'],
        correct: 1
      },
      {
        id: 2,
        word: 'investment',
        meaning: '投资',
        options: ['储蓄', '贷款', '投资', '消费'],
        correct: 2
      },
      {
        id: 3,
        word: 'strategy',
        meaning: '战略',
        options: ['战术', '战略', '计划', '目标'],
        correct: 1
      },
      {
        id: 4,
        word: 'management',
        meaning: '管理',
        options: ['领导', '管理', '执行', '操作'],
        correct: 1
      },
      {
        id: 5,
        word: 'achievement',
        meaning: '成就',
        options: ['失败', '成就', '过程', '努力'],
        correct: 1
      }
    ]
  }
];

export default levels;
