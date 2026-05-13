export const exercises = [
  {
    id: 1,
    name: "杠铃卧推",
    category: "chest",
    description: "主要锻炼胸大肌、三角肌前束和肱三头肌",
    muscles: ["胸大肌", "三角肌前束", "肱三头肌"],
    tips: ["保持背部贴紧凳面", "控制下放速度", "推起时不要锁肘"],
    images: [
      "https://images.unsplash.com/photo-1571011602130-214b081c2e4c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：平躺在卧推凳上，双脚平放地面", "下放：缓慢将杠铃下放到胸部中上方", "推起：用胸部力量将杠铃推回起始位置"]
  },
  {
    id: 2,
    name: "哑铃飞鸟",
    category: "chest",
    description: "孤立训练胸大肌，增加胸肌厚度",
    muscles: ["胸大肌"],
    tips: ["保持肘部微屈", "感受胸肌的拉伸和收缩", "重量不宜过大"],
    images: [
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：仰卧，双手持哑铃举在胸部上方", "下放：双臂向两侧缓慢打开，感受胸肌拉伸", "收回：用胸肌力量将双臂收回至起始位置"]
  },
  {
    id: 3,
    name: "上斜哑铃卧推",
    category: "chest",
    description: "重点锻炼胸大肌上束",
    muscles: ["胸大肌上束", "三角肌前束"],
    tips: ["凳面角度30-45度", "下放至胸部上方"],
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    ],
    steps: ["调整凳面角度至30-45度", "双手持哑铃，慢慢下放至胸部上方", "推起哑铃至手臂微屈位置"]
  },
  {
    id: 4,
    name: "引体向上",
    category: "back",
    description: "复合动作，锻炼背部整体和肱二头肌",
    muscles: ["背阔肌", "大圆肌", "肱二头肌"],
    tips: ["全程控制", "感受背部发力", "拉至胸部位置"],
    images: [
      "https://images.unsplash.com/photo-1598971861713-54ad16a17546?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571011602130-214b081c2e4c?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：双手正握单杠，双臂伸直悬挂", "拉起：用背部发力将身体拉起，下巴过杠", "下放：缓慢控制身体下降至起始位置"]
  },
  {
    id: 5,
    name: "杠铃划船",
    category: "back",
    description: "锻炼背阔肌厚度，增加背部力量",
    muscles: ["背阔肌", "斜方肌", "肱二头肌"],
    tips: ["背部挺直", "手肘贴身", "拉向腹部"],
    images: [
      "https://images.unsplash.com/photo-1598971639058-fab311b22887?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：膝盖微屈，背部挺直，双手握杠铃", "拉起：将杠铃拉向腹部，手肘贴紧身体", "下放：缓慢控制杠铃下降至起始位置"]
  },
  {
    id: 6,
    name: "高位下拉",
    category: "back",
    description: "练宽背部的经典动作",
    muscles: ["背阔肌", "大圆肌"],
    tips: ["挺胸沉肩", "拉至锁骨位置", "不要后仰过多"],
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571011602130-214b081c2e4c?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：坐直，双手宽握拉杆", "下拉：将拉杆拉至锁骨位置，挺胸沉肩", "回放：缓慢控制拉杆回到起始位置"]
  },
  {
    id: 7,
    name: "杠铃深蹲",
    category: "legs",
    description: "腿部训练之王，锻炼下肢整体",
    muscles: ["股四头肌", "臀大肌", "腘绳肌"],
    tips: ["膝盖与脚尖方向一致", "背部挺直", "蹲至大腿平行地面"],
    images: [
      "https://images.unsplash.com/photo-1566704158139-2d1758b1785d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：杠铃放在斜方肌上，双脚与肩同宽", "下蹲：屈髋屈膝，背部挺直，下蹲至大腿平行地面", "站起：用腿部和臀部力量站起至起始位置"]
  },
  {
    id: 8,
    name: "硬拉",
    category: "legs",
    description: "复合动作，锻炼全身后链肌群",
    muscles: ["腘绳肌", "臀大肌", "竖脊肌"],
    tips: ["杠铃贴身", "背部挺直", "用腿部发力启动"],
    images: [
      "https://images.unsplash.com/photo-1598971861713-54ad16a17546?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566704158139-2d1758b1785d?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：双脚与髋同宽，杠铃贴近小腿", "拉起：伸髋伸膝，背部始终挺直，杠铃贴身", "站起：直立后收紧臀部，然后控制下放"]
  },
  {
    id: 9,
    name: "腿举",
    category: "legs",
    description: "安全有效地锻炼腿部",
    muscles: ["股四头肌", "臀大肌"],
    tips: ["脚的位置影响训练重点", "膝盖不要锁死"],
    images: [
      "https://images.unsplash.com/photo-1566704158139-2d1758b1785d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：背部贴紧靠垫，双脚放在踏板上", "下放：弯曲膝盖，下放踏板至大腿贴近胸部", "推起：用腿部力量推起踏板至膝盖微屈"]
  },
  {
    id: 10,
    name: "坐姿肩推",
    category: "shoulders",
    description: "主要锻炼三角肌",
    muscles: ["三角肌", "肱三头肌"],
    tips: ["背部挺直", "推至头顶正上方", "不要耸肩"],
    images: [
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：坐直，双手持哑铃于肩部两侧", "推起：将哑铃垂直推至头顶正上方", "下放：缓慢控制哑铃下降至肩部位置"]
  },
  {
    id: 11,
    name: "哑铃侧平举",
    category: "shoulders",
    description: "锻炼三角肌中束，增加肩宽",
    muscles: ["三角肌中束"],
    tips: ["肘部微屈", "小重量多次数", "感受肩膀发力"],
    images: [
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：站立，双手持哑铃于身体两侧", "举起：双臂向两侧抬起至与肩同高", "下放：缓慢控制哑铃下降至身体两侧"]
  },
  {
    id: 12,
    name: "俯身反向飞鸟",
    category: "shoulders",
    description: "锻炼三角肌后束和上背",
    muscles: ["三角肌后束", "斜方肌"],
    tips: ["上半身前倾", "手臂向后画弧线"],
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：上半身前倾与地面平行，双手持哑铃", "后展：双臂向后方画弧线抬起，挤压肩胛骨", "回放：缓慢控制哑铃回到起始位置"]
  },
  {
    id: 13,
    name: "杠铃弯举",
    category: "arms",
    description: "锻炼肱二头肌的经典动作",
    muscles: ["肱二头肌", "肱肌"],
    tips: ["身体不要晃动", "控制离心过程", "上臂固定"],
    images: [
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：站立，双手握杠铃，上臂贴紧身体", "弯举：用肱二头肌力量将杠铃弯举至肩部", "下放：缓慢控制杠铃下降至起始位置"]
  },
  {
    id: 14,
    name: "哑铃锤式弯举",
    category: "arms",
    description: "锻炼肱肌和肱桡肌",
    muscles: ["肱肌", "肱桡肌", "肱二头肌"],
    tips: ["保持中立握法", "上臂固定不动"],
    images: [
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：站立，双手持哑铃，掌心相对", "弯举：将哑铃弯举至肩部，保持中立握法", "下放：缓慢控制哑铃下降至起始位置"]
  },
  {
    id: 15,
    name: "绳索下压",
    category: "arms",
    description: "锻炼肱三头肌",
    muscles: ["肱三头肌"],
    tips: ["上臂贴身", "充分伸展和收缩"],
    images: [
      "https://images.unsplash.com/photo-1581005152574-68e6c8072b83?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop"
    ],
    steps: ["起始姿势：面对绳索，双手握把手，上臂贴紧身体", "下压：用肱三头肌力量将把手向下压至手臂伸直", "回放：缓慢控制把手回到起始位置"]
  }
];

export const categories = [
  { id: "chest", name: "胸部", icon: "💪" },
  { id: "back", name: "背部", icon: "🦾" },
  { id: "legs", name: "腿部", icon: "🦵" },
  { id: "shoulders", name: "肩部", icon: "🏋️" },
  { id: "arms", name: "手臂", icon: "💪" }
];
