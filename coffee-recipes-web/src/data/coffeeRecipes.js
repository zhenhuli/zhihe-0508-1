export const coffeeRecipes = [
  {
    id: 1,
    name: "拿铁",
    englishName: "Latte",
    description: "浓郁的咖啡与丝滑牛奶的完美结合",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=latte%20coffee%20art%20in%20a%20cup%20professional%20photography&image_size=square_hd",
    ratio: {
      espresso: "1/3",
      milk: "2/3",
      foam: "薄薄一层"
    },
    ingredients: [
      { name: "浓缩咖啡", amount: "30ml" },
      { name: "牛奶", amount: "180ml" },
      { name: "奶泡", amount: "适量" }
    ],
    steps: [
      "准备30ml浓缩咖啡倒入杯中",
      "将牛奶加热至65-70°C",
      "用蒸汽棒打发牛奶产生细腻奶泡",
      "将牛奶缓慢倒入咖啡中",
      "表面可做拉花装饰"
    ],
    tools: ["意式咖啡机", "蒸汽棒", "拉花杯", "咖啡杯"],
    difficulty: "中等",
    time: "5分钟"
  },
  {
    id: 2,
    name: "美式咖啡",
    englishName: "Americano",
    description: "简约纯粹，口感清爽",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=americano%20black%20coffee%20in%20glass%20cup%20professional%20photography&image_size=square_hd",
    ratio: {
      espresso: "1/2",
      hotWater: "1/2"
    },
    ingredients: [
      { name: "浓缩咖啡", amount: "60ml" },
      { name: "热水", amount: "120ml" }
    ],
    steps: [
      "准备60ml浓缩咖啡倒入杯中",
      "加入120ml热水（85-90°C）",
      "轻轻搅拌均匀",
      "根据口味可调整水量"
    ],
    tools: ["意式咖啡机", "咖啡杯"],
    difficulty: "简单",
    time: "3分钟"
  },
  {
    id: 3,
    name: "卡布奇诺",
    englishName: "Cappuccino",
    description: "经典意式咖啡，奶泡绵密丰厚",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cappuccino%20coffee%20with%20thick%20foam%20in%20ceramic%20cup%20professional%20photography&image_size=square_hd",
    ratio: {
      espresso: "1/3",
      milk: "1/3",
      foam: "1/3"
    },
    ingredients: [
      { name: "浓缩咖啡", amount: "30ml" },
      { name: "牛奶", amount: "60ml" },
      { name: "奶泡", amount: "60ml" }
    ],
    steps: [
      "准备30ml浓缩咖啡倒入杯中",
      "将牛奶加热至60-65°C",
      "用蒸汽棒打发牛奶产生丰厚奶泡",
      "先倒入牛奶，最后铺上奶泡",
      "表面可撒上可可粉"
    ],
    tools: ["意式咖啡机", "蒸汽棒", "拉花杯", "咖啡杯"],
    difficulty: "中等",
    time: "5分钟"
  },
  {
    id: 4,
    name: "摩卡",
    englishName: "Mocha",
    description: "巧克力与咖啡的甜蜜邂逅",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mocha%20coffee%20with%20chocolate%20syrup%20in%20glass%20professional%20photography&image_size=square_hd",
    ratio: {
      espresso: "1/4",
      chocolate: "1/4",
      milk: "1/2"
    },
    ingredients: [
      { name: "浓缩咖啡", amount: "30ml" },
      { name: "巧克力酱", amount: "30ml" },
      { name: "牛奶", amount: "120ml" },
      { name: "鲜奶油", amount: "适量" }
    ],
    steps: [
      "在杯底加入巧克力酱",
      "准备30ml浓缩咖啡倒入杯中搅拌",
      "将牛奶加热打发后倒入",
      "顶部挤上鲜奶油",
      "可淋上巧克力酱装饰"
    ],
    tools: ["意式咖啡机", "蒸汽棒", "咖啡杯"],
    difficulty: "中等",
    time: "6分钟"
  },
  {
    id: 5,
    name: "玛奇朵",
    englishName: "Macchiato",
    description: "浓缩咖啡上点缀着奶泡的印记",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=macchiato%20espresso%20coffee%20with%20milk%20foam%20in%20small%20cup%20professional%20photography&image_size=square_hd",
    ratio: {
      espresso: "3/4",
      foam: "1/4"
    },
    ingredients: [
      { name: "浓缩咖啡", amount: "30ml" },
      { name: "奶泡", amount: "10ml" }
    ],
    steps: [
      "准备30ml浓缩咖啡倒入小杯中",
      "取少量牛奶打发成细腻奶泡",
      "在咖啡表面点上一小勺奶泡",
      "形成'marked'的效果"
    ],
    tools: ["意式咖啡机", "蒸汽棒", "浓缩咖啡杯"],
    difficulty: "简单",
    time: "3分钟"
  },
  {
    id: 6,
    name: "Flat White",
    englishName: "Flat White",
    description: "澳式白咖啡，奶泡细腻如丝",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=flat%20white%20coffee%20smooth%20microfoam%20in%20ceramic%20cup%20professional%20photography&image_size=square_hd",
    ratio: {
      espresso: "1/3",
      milk: "2/3"
    },
    ingredients: [
      { name: "浓缩咖啡", amount: "60ml" },
      { name: "牛奶", amount: "120ml" }
    ],
    steps: [
      "准备60ml双份浓缩咖啡",
      "将牛奶加热至60°C",
      "打发产生极其细腻的微泡（microfoam）",
      "将牛奶倒入咖啡中，表面平整无厚泡"
    ],
    tools: ["意式咖啡机", "蒸汽棒", "拉花杯", "咖啡杯"],
    difficulty: "较难",
    time: "5分钟"
  }
];
