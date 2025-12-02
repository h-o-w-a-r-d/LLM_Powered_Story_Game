// js/world_data.js

const WorldData = {
    // 預定義的世界風格 (Presets)
    presets: {
        "fantasy": {
            id: "fantasy",
            name: "傳統奇幻",
            tags: ["fantasy", "magic", "nature"],
            atmosphere: "充滿魔力與古老傳說的氣息。",
            biomes: ["FOREST", "MOUNTAIN", "DUNGEON"]
        },
        "wasteland": {
            id: "wasteland",
            name: "核末日廢土",
            tags: ["wasteland", "survival", "scavenge"],
            atmosphere: "乾燥、輻射與絕望的氣息。",
            biomes: ["DESERT", "RUINS", "CITY_WRECK"]
        },
        "cyberpunk": {
            id: "cyberpunk",
            name: "賽博龐克都市",
            tags: ["cyberpunk", "sci-fi", "tech", "modern"],
            atmosphere: "霓虹燈閃爍，高科技與低生活的結合。",
            biomes: ["CYBER_CITY", "SLUMS", "FACTORY"]
        },
        "horror": {
            id: "horror",
            name: "克蘇魯恐怖",
            tags: ["horror", "magic", "curse"],
            atmosphere: "陰冷、潮濕，空氣中瀰漫著不可名狀的恐懼。",
            biomes: ["SWAMP", "GRAVEYARD", "MANOR"]
        }
    },

    // 生態系 (Biome) 定義：決定該地形會產出什麼類型的 Tag
    biomes: {
        // 通用
        "FOREST": { terrain: "森林", difficulty: 1, tags: ["forest", "nature"] },
        "MOUNTAIN": { terrain: "山脈", difficulty: 2, tags: ["mountain", "cold"] },
        "WATER": { terrain: "水域", difficulty: 1, tags: ["water"] },
        
        // 廢土/沙漠
        "DESERT": { terrain: "輻射沙漠", difficulty: 2, tags: ["wasteland", "hot"] },
        "RUINS": { terrain: "廢墟", difficulty: 2, tags: ["wasteland", "concrete"] },
        "CITY_WRECK": { terrain: "城市殘骸", difficulty: 3, tags: ["wasteland", "tech"] },

        // 賽博
        "CYBER_CITY": { terrain: "霓虹核心區", difficulty: 3, tags: ["cyberpunk", "rich"] },
        "SLUMS": { terrain: "貧民窟", difficulty: 1, tags: ["cyberpunk", "thug"] },
        "FACTORY": { terrain: "自動化工廠", difficulty: 2, tags: ["sci-fi", "robot"] },

        // 恐怖
        "SWAMP": { terrain: "迷霧沼澤", difficulty: 2, tags: ["horror", "poison"] },
        "GRAVEYARD": { terrain: "亂葬崗", difficulty: 3, tags: ["horror", "undead"] },
        "DUNGEON": { terrain: "地下城", difficulty: 4, tags: ["dungeon", "dark"] }
    }
};