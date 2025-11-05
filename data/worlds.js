
const worldTypes = [
  "奇幻 (Fantasy)",
  "科幻 (Sci-Fi)",
  "武俠 (Wuxia)",
  "仙俠 (Xianxia)",
  "克蘇魯神話 (Cthulhu Mythos)",
  "宮鬥 (Palace Intrigue)",
  "校園異聞 (School Mystery)",
  "架空歷史 (Alternate History)",
  "戀愛 (Romance)",
  "末日生存 (Post-Apocalyptic)",
  "賽博龐克 (Cyberpunk)",
  "懸疑偵探 (Mystery Detective)",
  "恐怖 (Horror)",
  "玄幻 (Xuanhuan)",
  "現代都市 (Modern Urban)",
  "西方魔法 (Western Magic)",
  "穿越 (Transmigration)"
];

// Unique character status system for each world type
const worldStatusSystems = {
  "奇幻 (Fantasy)": {
    "生命值": 100,
    "魔力": 50,
    "體力": 80,
    "等級": 1,
    "經驗值": 0,
    "inventory": [],
    "skills": []
  },
  "科幻 (Sci-Fi)": {
    "生命值": 100,
    "能量": 75,
    "護盾": 50,
    "科技等級": 1,
    "信用點": 1000,
    "inventory": [],
    "skills": []
  },
  "武俠 (Wuxia)": {
    "氣血": 100,
    "內力": 60,
    "輕功": 40,
    "武學境界": 1,
    "江湖聲望": 0,
    "inventory": [],
    "skills": []
  },
  "仙俠 (Xianxia)": {
    "生命力": 100,
    "靈力": 80,
    "神識": 50,
    "修為境界": 1,
    "功德": 0,
    "inventory": [],
    "skills": []
  },
  "克蘇魯神話 (Cthulhu Mythos)": {
    "生命值": 100,
    "理智值": 80,
    "意志力": 60,
    "調查等級": 1,
    "神秘知識": 10,
    "inventory": [],
    "skills": []
  },
  "宮鬥 (Palace Intrigue)": {
    "健康": 100,
    "魅力": 70,
    "智謀": 60,
    "地位": 1,
    "人脈": 20,
    "inventory": [],
    "skills": []
  },
  "校園異聞 (School Mystery)": {
    "體力": 100,
    "精神力": 80,
    "勇氣": 50,
    "學年": 1,
    "人氣": 30,
    "inventory": [],
    "skills": []
  },
  "架空歷史 (Alternate History)": {
    "生命值": 100,
    "士氣": 70,
    "影響力": 40,
    "軍階": 1,
    "資源": 100,
    "inventory": [],
    "skills": []
  },
  "戀愛 (Romance)": {
    "魅力": 70,
    "親和力": 80,
    "自信": 60,
    "戀愛經驗": 1,
    "好感度": 0,
    "inventory": [],
    "skills": []
  },
  "末日生存 (Post-Apocalyptic)": {
    "生命值": 100,
    "飢餓度": 80,
    "口渴度": 90,
    "生存等級": 1,
    "物資": 50,
    "inventory": [],
    "skills": []
  },
  "賽博龐克 (Cyberpunk)": {
    "生命值": 100,
    "網路連結": 75,
    "義體完整度": 90,
    "駭客等級": 1,
    "街頭信譽": 10,
    "inventory": [],
    "skills": []
  },
  "懸疑偵探 (Mystery Detective)": {
    "體力": 100,
    "觀察力": 80,
    "邏輯思維": 70,
    "偵探等級": 1,
    "線索": 0,
    "inventory": [],
    "skills": []
  },
  "恐怖 (Horror)": {
    "生命值": 100,
    "理智值": 80,
    "恐懼抗性": 40,
    "生存等級": 1,
    "驚嚇值": 0,
    "inventory": [],
    "skills": []
  },
  "玄幻 (Xuanhuan)": {
    "生命力": 100,
    "元力": 70,
    "精神力": 60,
    "修煉境界": 1,
    "天賦": 50,
    "inventory": [],
    "skills": []
  },
  "現代都市 (Modern Urban)": {
    "健康": 100,
    "精力": 80,
    "財富": 1000,
    "社會地位": 1,
    "人際關係": 50,
    "inventory": [],
    "skills": []
  },
  "西方魔法 (Western Magic)": {
    "生命值": 100,
    "魔力": 80,
    "精神力": 60,
    "法師等級": 1,
    "魔法親和": 50,
    "inventory": [],
    "skills": []
  },
  "穿越 (Transmigration)": {
    "生命值": 100,
    "適應度": 60,
    "原世界記憶": 90,
    "穿越等級": 1,
    "因果值": 0,
    "inventory": [],
    "skills": []
  }
};
