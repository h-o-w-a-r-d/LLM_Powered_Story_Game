/**
 * js/assets.js
 * 
 * 遊戲核心資產庫
 * 包含：狀態效果、陷阱、各類道具與裝備
 */

const GameAssets = {
    
    // ----------------------------------------------------------------
    // 1. 狀態效果定義 (Status Effects)
    // 定義陷阱或道具造成的持續性影響
    // ----------------------------------------------------------------
    status_effects: {
        poisoned: { name: "中毒", desc: "每回合受到毒素傷害", icon: "☠️", color: "#00ff00" },
        burning: { name: "燃燒", desc: "持續受到火焰傷害，防禦降低", icon: "🔥", color: "#ff4500" },
        frozen: { name: "凍結", desc: "無法移動，但防禦力暫時提升", icon: "❄️", color: "#00ffff" },
        bleeding: { name: "流血", desc: "移動時受到傷害", icon: "🩸", color: "#8b0000" },
        stunned: { name: "暈眩", desc: "無法進行任何動作", icon: "💫", color: "#ffff00" },
        emp: { name: "癱瘓(EMP)", desc: "科技類裝備失效", icon: "⚡", color: "#0099ff" },
        radiated: { name: "輻射中毒", desc: "最大生命值上限降低", icon: "☢️", color: "#32cd32" }
    },

    // ----------------------------------------------------------------
    // 2. 陷阱庫 (Traps)
    // 包含 Fantasy, Sci-Fi, Wasteland, Horror 等風格
    // ----------------------------------------------------------------
    traps: [
        // --- 物理/原始類 (Fantasy/Wasteland) ---
        {
            id: "t_spike_pit",
            name: "隱蔽尖刺坑",
            tags: ["fantasy", "wasteland", "dungeon", "physical"],
            level: 1,
            description: "地面鋪著脆弱的枯草，底下是數十根生鏽的鐵刺。",
            trigger_chance: 0.35,
            detect_difficulty: 40,
            disarm_difficulty: 30,
            effect: { type: "damage", val: 15, variance: 5, msg: "你跌入了坑洞，鐵刺刺穿了你的腿！" }
        },
        {
            id: "t_swinging_log",
            name: "擺盪巨木",
            tags: ["forest", "jungle", "physical"],
            level: 2,
            description: "一根粗壯的樹幹被藤蔓懸掛在高處，隨時準備橫掃路徑。",
            trigger_chance: 0.5,
            detect_difficulty: 45,
            disarm_difficulty: 50,
            effect: { type: "damage", val: 25, status: "stunned", duration: 1, msg: "巨木呼嘯而過，重重地撞在你的胸口！" }
        },
        {
            id: "t_bear_trap",
            name: "生鏽捕獸夾",
            tags: ["survival", "forest", "horror", "physical"],
            level: 1,
            description: "隱藏在落葉堆中，滿是鐵鏽的鋸齒狀陷阱。",
            trigger_chance: 0.4,
            detect_difficulty: 35,
            disarm_difficulty: 40,
            effect: { type: "damage", val: 20, status: "bleeding", duration: 5, msg: "咔嚓一聲！鐵齒咬合，深可見骨。" }
        },
        {
            id: "t_arrow_wall",
            name: "連環箭牆",
            tags: ["dungeon", "temple", "ruins"],
            level: 3,
            description: "兩側牆壁有數個規則排列的小孔。",
            trigger_chance: 0.6,
            detect_difficulty: 55,
            disarm_difficulty: 60,
            effect: { type: "damage", val: 10, count: 3, msg: "機關觸發，數支利箭從牆壁射出！" }
        },

        // --- 魔法/超自然類 (Fantasy/Horror) ---
        {
            id: "t_rune_fire",
            name: "爆裂符文",
            tags: ["magic", "dungeon", "fire"],
            level: 4,
            description: "地面上刻印著發出微弱紅光的魔法迴路。",
            trigger_chance: 0.9,
            detect_difficulty: 75,
            disarm_difficulty: 80, // 需要法術檢定
            effect: { type: "damage", val: 40, status: "burning", duration: 3, msg: "符文閃耀，一團烈火瞬間吞噬了你！" }
        },
        {
            id: "t_rune_frost",
            name: "冰霜符文",
            tags: ["magic", "snow", "temple"],
            level: 4,
            description: "空氣中凝結著冰晶，地面上有淡藍色的印記。",
            trigger_chance: 0.8,
            detect_difficulty: 70,
            disarm_difficulty: 75,
            effect: { type: "status", status: "frozen", duration: 2, msg: "極寒之氣爆發，將你凍結在原地！" }
        },
        {
            id: "t_mimic",
            name: "寶箱怪 (Mimic)",
            tags: ["fantasy", "dungeon", "monster"],
            level: 5,
            description: "看起來是一個鑲著金邊的豪華寶箱，但鎖孔處有口水滴落。",
            trigger_chance: 1.0, // 互動必觸發
            detect_difficulty: 65,
            disarm_difficulty: 999, // 無法解除，只能戰鬥
            effect: { type: "combat", enemy_id: "e_mimic_01", msg: "寶箱長出了利齒和舌頭，向你撲來！" }
        },
        {
            id: "t_ghost_hand",
            name: "怨靈之握",
            tags: ["horror", "graveyard", "curse"],
            level: 3,
            description: "地面泥土鬆動，彷彿有東西想爬出來。",
            trigger_chance: 0.5,
            detect_difficulty: 50,
            effect: { type: "status", status: "stunned", val: 0, duration: 2, msg: "蒼白的手從地下伸出，死死抓住了你的腳踝。" }
        },

        // --- 科技/科幻類 (Sci-Fi/Cyberpunk) ---
        {
            id: "t_laser_tripwire",
            name: "高能雷射絆線",
            tags: ["cyberpunk", "sci-fi", "base", "tech"],
            level: 3,
            description: "肉眼幾乎看不見的高能紅色光束橫跨通道。",
            trigger_chance: 0.8,
            detect_difficulty: 70,
            disarm_difficulty: 75, // 需要駭客技能
            effect: { type: "damage", val: 35, element: "energy", msg: "高溫雷射瞬間燒灼了你的皮膚與護甲！" }
        },
        {
            id: "t_turret_sentry",
            name: "自動防禦砲塔",
            tags: ["sci-fi", "military", "tech"],
            level: 5,
            description: "天花板上的球型攝像頭正在掃描移動物體。",
            trigger_chance: 1.0,
            detect_difficulty: 60,
            disarm_difficulty: 85,
            effect: { type: "combat", enemy_id: "e_turret_mk2", msg: "「偵測到入侵者。」砲塔啟動並鎖定了你。" }
        },
        {
            id: "t_tesla_coil",
            name: "超載特斯拉線圈",
            tags: ["sci-fi", "factory", "tech"],
            level: 4,
            description: "空氣中充滿了臭氧的味道，巨大的線圈發出滋滋聲。",
            trigger_chance: 0.4, // 間歇性觸發
            detect_difficulty: 40,
            effect: { type: "damage", val: 25, status: "emp", duration: 3, msg: "高壓電弧擊穿了空氣，你的電子設備瞬間黑屏。" }
        },
        {
            id: "t_rad_vent",
            name: "輻射洩漏孔",
            tags: ["wasteland", "factory", "nuclear"],
            level: 2,
            description: "嘶嘶作響的管道裂縫噴出帶有螢光綠的蒸汽。",
            trigger_chance: 1.0, // 區域性
            detect_difficulty: 20, // 很容易看到，但很難避開
            disarm_difficulty: 50, // 需要修理
            effect: { type: "status", status: "radiated", val: 5, duration: 99, msg: "蓋革計數器瘋狂作響，你感覺體內細胞正在崩壞。" }
        }
    ],

    // ----------------------------------------------------------------
    // 3. 道具庫 (Items)
    // ----------------------------------------------------------------
    items: [
        // ================= 消耗品 (Consumables) =================
        {
            id: "c_hp_potion_small",
            name: "微型治療藥水",
            type: "consumable",
            rarity: "common",
            tags: ["fantasy", "general", "magic"],
            description: "一瓶紅色的液體，散發著廉價草莓糖的味道。",
            effect: { type: "heal", val: 25 },
            weight: 0.5,
            price: 10
        },
        {
            id: "c_hp_potion_large",
            name: "高濃縮回復劑",
            type: "consumable",
            rarity: "rare",
            tags: ["fantasy", "general", "magic"],
            description: "金色的液體在瓶中旋轉，蘊含強大的生命力。",
            effect: { type: "heal", val: 100, status_cure: ["bleeding"] },
            weight: 0.8,
            price: 150
        },
        {
            id: "c_stimpack",
            name: "軍用興奮劑 (Stimpack)",
            type: "consumable",
            rarity: "uncommon",
            tags: ["cyberpunk", "sci-fi", "military"],
            description: "直接注射心臟的腎上腺素混合物，副作用未知。",
            effect: { type: "heal", val: 50, buff: { stat: "str", val: 5, duration: 3 } },
            weight: 0.2,
            price: 50
        },
        {
            id: "c_canned_food",
            name: "神秘肉罐頭",
            type: "consumable",
            rarity: "common",
            tags: ["wasteland", "survival", "food"],
            description: "標籤已磨損，肉質呈粉紅色，大概是...牛肉？",
            effect: { type: "heal", val: 15, hunger: -20 },
            weight: 0.5,
            price: 5
        },
        {
            id: "c_antidote",
            name: "萬能解毒劑",
            type: "consumable",
            rarity: "common",
            tags: ["general", "medical"],
            description: "味道極苦的綠色藥丸。",
            effect: { type: "cure_status", target: "poisoned" },
            weight: 0.1,
            price: 20
        },
        {
            id: "c_rad_away",
            name: "輻射寧",
            type: "consumable",
            rarity: "uncommon",
            tags: ["wasteland", "sci-fi", "medical"],
            description: "像靜脈點滴袋一樣的藥劑，能清除體內輻射。",
            effect: { type: "cure_status", target: "radiated" },
            weight: 0.3,
            price: 80
        },

        // ================= 武器 (Weapons) =================
        // Fantasy Weapons
        {
            id: "w_rusty_sword",
            name: "缺口的鐵劍",
            type: "weapon",
            rarity: "common",
            tags: ["fantasy", "melee"],
            stats: { atk: 5, durability: 50, crit_rate: 0.05 },
            description: "這把劍經歷了太多戰鬥，已經不堪重負。",
            weight: 3.0,
            price: 15
        },
        {
            id: "w_mithril_blade",
            name: "秘銀長劍",
            type: "weapon",
            rarity: "epic",
            tags: ["fantasy", "melee", "elf"],
            stats: { atk: 45, durability: 200, crit_rate: 0.15 },
            description: "輕如羽毛，堅硬如鑽石，劍身泛著藍光。",
            weight: 1.5,
            price: 1200
        },
        {
            id: "w_fire_staff",
            name: "焦痕法杖",
            type: "weapon",
            rarity: "rare",
            tags: ["fantasy", "magic", "ranged"],
            stats: { mag_atk: 30, mp_cost: 5, element: "fire" },
            description: "頂端鑲嵌著一顆溫熱的紅寶石。",
            weight: 2.0,
            price: 450
        },

        // Wasteland/Modern Weapons
        {
            id: "w_crowbar",
            name: "物理學聖劍 (撬棍)",
            type: "weapon",
            rarity: "common",
            tags: ["survival", "horror", "melee", "tool"],
            stats: { atk: 8, durability: 999 },
            description: "高登·弗里曼的最愛。既能開門，又能開腦。",
            weight: 2.5,
            price: 30
        },
        {
            id: "w_spiked_bat",
            name: "帶釘棒球棍",
            type: "weapon",
            rarity: "common",
            tags: ["wasteland", "melee", "thug"],
            stats: { atk: 12, durability: 60, chance_to_bleed: 0.3 },
            description: "簡單粗暴，這就是廢土的法律。",
            weight: 3.0,
            price: 25
        },
        {
            id: "w_pump_shotgun",
            name: "削短型散彈槍",
            type: "weapon",
            rarity: "uncommon",
            tags: ["wasteland", "ranged", "firearm"],
            stats: { atk: 50, range: "short", ammo_type: "shell" },
            description: "近距離威力驚人，但在遠處只能給人撓癢。",
            weight: 4.0,
            price: 200
        },

        // Sci-Fi Weapons
        {
            id: "w_laser_pistol",
            name: "型號-7 脈衝手槍",
            type: "weapon",
            rarity: "uncommon",
            tags: ["sci-fi", "cyberpunk", "ranged", "energy"],
            stats: { atk: 18, energy_cost: 2, penetration: 10 },
            description: "公司保全部隊的標準配置，發射藍色等離子束。",
            weight: 1.5,
            price: 300
        },
        {
            id: "w_monowire",
            name: "單分子線",
            type: "weapon",
            rarity: "epic",
            tags: ["cyberpunk", "stealth", "melee"],
            stats: { atk: 60, ignore_def: true },
            description: "細到肉眼無法看見的纖維，能像切起司一樣切開鋼鐵。",
            weight: 0.1,
            price: 2500
        },

        // ================= 裝備/防具 (Armor) =================
        {
            id: "a_leather_jacket",
            name: "磨損的皮夾克",
            type: "armor",
            slot: "body",
            rarity: "common",
            tags: ["wasteland", "modern"],
            stats: { def: 3, cold_resist: 5 },
            description: "雖然破舊，但至少能擋風。",
            weight: 2.0,
            price: 40
        },
        {
            id: "a_plate_mail",
            name: "騎士板甲",
            type: "armor",
            slot: "body",
            rarity: "rare",
            tags: ["fantasy", "heavy"],
            stats: { def: 25, speed_penalty: -5 },
            description: "閃亮的鋼鐵盔甲，提供極佳的防護，但很笨重。",
            weight: 15.0,
            price: 600
        },
        {
            id: "a_nano_suit",
            name: "納米纖維戰鬥服",
            type: "armor",
            slot: "body",
            rarity: "epic",
            tags: ["sci-fi", "cyberpunk"],
            stats: { def: 15, speed_bonus: 5, stealth_bonus: 20 },
            description: "如同第二層皮膚，能根據環境改變顏色。",
            weight: 3.0,
            price: 1800
        },

        // ================= 材料 (Materials) =================
        {
            id: "m_scrap_metal",
            name: "金屬廢料",
            type: "material",
            rarity: "common",
            tags: ["wasteland", "crafting"],
            description: "生鏽的螺絲、鐵片和齒輪。",
            weight: 0.5,
            price: 1
        },
        {
            id: "m_circuit_board",
            name: "損壞的電路板",
            type: "material",
            rarity: "uncommon",
            tags: ["sci-fi", "crafting"],
            description: "雖然大部分燒焦了，但有些晶片還能用。",
            weight: 0.2,
            price: 15
        },
        {
            id: "m_dragon_scale",
            name: "龍鱗",
            type: "material",
            rarity: "legendary",
            tags: ["fantasy", "crafting"],
            description: "散發著高熱，堅不可摧的紅色鱗片。",
            weight: 1.0,
            price: 5000
        },
        {
            id: "m_glowing_fungus",
            name: "發光真菌",
            type: "material",
            rarity: "uncommon",
            tags: ["nature", "alchemy"],
            description: "洞穴深處採集的，是製作藥水的重要材料。",
            weight: 0.1,
            price: 8
        },

        // ================= 任務/特殊物品 (Key Items) =================
        {
            id: "k_red_keycard",
            name: "紅色權限卡",
            type: "key",
            rarity: "rare",
            tags: ["sci-fi", "base"],
            description: "上面印著 'Level 5 Access' 字樣。",
            weight: 0.0,
            price: 0
        },
        {
            id: "k_ancient_diary",
            name: "受潮的日記本",
            type: "lore",
            rarity: "unique",
            tags: ["horror", "story"],
            description: "最後一頁寫著：『別往上看...』",
            weight: 0.5,
            price: 5
        }
    ],


    // 新增：動態資產庫 (由 LLM 生成)
    dynamic: {
        items: [],
        traps: [],
        biomes: []
    },

    // 新增：注入方法
    injectDynamicAssets: function(data) {
        this.dynamic.items = data.items || [];
        this.dynamic.traps = data.traps || [];
        this.dynamic.biomes = data.biomes || []; // 新增這一行
        // 給每個動態物品加 ID 避免錯誤
        this.dynamic.items.forEach((i, idx) => i.id = `d_item_${idx}`);
        this.dynamic.traps.forEach((t, idx) => t.id = `d_trap_${idx}`);
        console.log("注入動態資產:", this.dynamic);
    },

    // 修改：優先從動態庫取得
    getById: function(id) {
        if (id.startsWith('d_')) {
            let res = this.dynamic.items.find(i => i.id === id) || this.dynamic.traps.find(t => t.id === id);
            if (res) return res;
        }
        // 原本的邏輯
        const item = this.items.find(i => i.id === id);
        if (item) return item;
        const trap = this.traps.find(t => t.id === id);
        if (trap) return trap;
        return null;
    },

    // 修改：優先回傳動態物品
    getRandomItem: function(filters = {}) {
        // 如果有動態物品，優先使用
        if (this.dynamic.items.length > 0) {
            const pool = this.dynamic.items;
            const randomIndex = Math.floor(Math.random() * pool.length);
            return JSON.parse(JSON.stringify(pool[randomIndex]));
        }
        
        // 否則回退到舊邏輯
        let pool = this.items;
        if (pool.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * pool.length);
        return JSON.parse(JSON.stringify(pool[randomIndex]));
    },
    
    // 輔助：獲取隨機動態陷阱
    getRandomTrap: function() {
        if (this.dynamic.traps.length > 0) {
            const pool = this.dynamic.traps;
            return JSON.parse(JSON.stringify(pool[Math.floor(Math.random() * pool.length)]));
        }
        return this.traps[0]; // Fallback
    },

    filterByTags: function(tags, category = 'items') {
        // 簡化邏輯：如果是動態模式，直接忽視 tag 過濾，因為 LLM 生成的整批都是符合該世界的
        if (this.dynamic[category] && this.dynamic[category].length > 0) {
            return this.dynamic[category];
        }
        // 舊邏輯
        const source = this[category] || [];
        return source.filter(asset => tags.some(t => asset.tags.includes(t)));
    }
};

// 狀態效果保持原樣...
GameAssets.status_effects = {
    poisoned: { name: "中毒", desc: "...", icon: "☠️" },
    stunned: { name: "暈眩/震驚", desc: "無法行動", icon: "💫" },
    happy: { name: "開心", desc: "心情愉悅", icon: "✨" }, // 新增通用正面狀態
    stressed: { name: "壓力", desc: "精神緊張", icon: "💢" } // 新增通用負面狀態
};

if (typeof module !== 'undefined' && module.exports) module.exports = GameAssets;
else window.GameAssets = GameAssets;