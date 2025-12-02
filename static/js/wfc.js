// --- static/js/wfc.js ---

class MechanicalWFC {
    constructor() {
        this.biomes = [];
        // 預設機率 (會在 init 被覆寫)
        this.config = {
            trap_chance: 0.05,
            item_chance: 0.10
        };
    }

    // 初始化：接收 LLM 生成的生物群系與設定
    init(dynamicBiomes, dynamicSettings) {
        this.biomes = dynamicBiomes; // 直接使用 LLM 給的列表
        if (dynamicSettings) {
            this.config.trap_chance = dynamicSettings.trap_chance || 0.05;
            this.config.item_chance = dynamicSettings.item_chance || 0.10;
        }
        console.log("WFC Configured:", this.config, this.biomes);
    }

    collapse(x, y, heightValue) {
        // 安全檢查 1: 確保 Biomes 存在
        if (!this.biomes || this.biomes.length === 0) {
            return { biome: "虛空", flavor: "資料未加載", feature: null, item: null };
        }

        // 安全檢查 2: 確保 heightValue 是有效數字，否則給予預設值 (修正 NaN 問題)
        if (typeof heightValue !== 'number' || isNaN(heightValue)) {
            heightValue = 0.5;
        }

        // 1. 決定地形
        const biomeIndex = Math.floor(heightValue * this.biomes.length);
        // 確保 index 不會超出範圍
        const safeIndex = Math.max(0, Math.min(biomeIndex, this.biomes.length - 1));
        const biomeData = this.biomes[safeIndex];

        // === 修正開始 ===
        // 修正 1: 加上 100000 避免在 (0,0) 產生負數鏡像對稱
        // 修正 2: 優化偽隨機算法，確保分佈更均勻
        const seedX = x + 100000; 
        const seedY = y + 100000;
        
        // 經典的偽隨機雜湊算法 (Pseudo-Random Hash)
        const dt = seedX * 12.9898 + seedY * 78.233;
        const sn = Math.sin(dt) * 43758.5453;
        const rand = (sn - Math.floor(sn)); // 只取小數部分 (0.0 ~ 1.0)
        // === 修正結束 ===

        let result = {
            biome: biomeData.name,
            flavor: biomeData.desc || biomeData.name,
            feature: null,
            item: null
        };

        // 3. 使用動態機率生成物件
        if (rand < this.config.trap_chance) {
            result.feature = GameAssets.getRandomTrap();
        }
        else if (rand > (1.0 - this.config.item_chance)) {
            result.item = GameAssets.getRandomItem();
        }

        return result;
    }
}