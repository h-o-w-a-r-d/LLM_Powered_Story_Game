// --- static/js/game.js ---

const Game = {
    state: {
        player: { x: 0, y: 0, hp: 100, maxHp: 100, inventory: [], status: [] },
        world: { 
            settings: {}, 
            flavorText: "",
            // 新增：用來記錄地圖改變 (例如陷阱被拆除、物品被撿走)
            // 格式: "x,y": { feature: null, item: null, visited: true }
            modifications: {},
            // createWorld 內部
            visited: {} // 格式: "x,y": "LLM生成的關鍵描述摘要"
        },
        chunks: {},
    },
    wfc: new MechanicalWFC(),
    worker: null,
    isGenerating: false,
    currentLocationData: null, 

    init: () => {
        Game.worker = new Worker('./map_worker.js');
        Game.worker.onerror = (e) => {
            console.error("Worker Error:", e);
            UI.log("系統", "地圖核心啟動失敗", "system");
        };
        Game.worker.onmessage = (e) => {
            if (e.data.type === 'chunkReady') {
                const { chunkX, chunkY, data } = e.data;
                Game.state.chunks[`${chunkX},${chunkY}`] = data;
                UI.drawDebugMap(chunkX, chunkY, data);
            }
        };
    },

    createWorld: async (userInput) => {
        UI.log("系統", "正在建構世界規則與資產...", "system");

        // 強大的 Prompt：要求 LLM 直接生成遊戲資料庫
        const prompt = `
        玩家想要體驗的世界："${userInput}"
        
        任務：請作為「遊戲策劃」，為這個世界生成專屬的遊戲配置資料 (JSON)。
        
        需求：
        1. [biomes]: 生成 4-6 個符合該世界觀的地點類型 (例如校園故事：教室、頂樓、福利社)。
        2. [items]: 生成 6-8 個玩家可能撿到的物品。
           - 屬性包含: name, type ("weapon", "consumable", "material"), description, effect。
           - "effect": { "type": "heal", "val": 10 } 或 { "type": "damage", "val": 5 }。
        3. [traps]: 生成 3-5 個可能遇到的「阻礙」或「陷阱」。
           - 注意：若是和平世界，陷阱可以是"社交尷尬"、"踩到香蕉皮"、"突擊測驗"等，不一定要扣血，可以造成 "stressed" 狀態。
           - 屬性: name, description, trigger_chance (0.1~0.8), effect (例如 { "type": "damage", "val": 10 } 或 { "type": "status", "status": "stressed" })。
        4. [settings]: 設定生成機率。
           - trap_chance: 遇到阻礙的機率 (0.01~0.3)。和平世界請設低。
           - item_chance: 撿到東西的機率 (0.05~0.5)。
        5. [intro]: 一段引人入勝的開場白。

        格式範例 (JSON ONLY):
        {
            "biomes": [{"name": "老舊教室", "desc": "桌椅凌亂，黑板上寫著值日生"}],
            "items": [{"name": "硬麵包", "type": "consumable", "effect": {"type":"heal","val":5}, "description":"..."}],
            "traps": [{"name": "搖晃的吊燈", "trigger_chance": 0.5, "effect": {"type":"damage","val":20}, "description":"..."}],
            "settings": {"trap_chance": 0.05, "item_chance": 0.2},
            "intro": "..."
        }
        `;

        try {
            const raw = await API.call(prompt, "JSON output only.", true);
            let config;
            try {
                 config = JSON.parse(raw.replace(/```json|```/g, '').trim());
            } catch (err) {
                 console.error("Parse Error", raw);
                 throw err;
            }

            // 1. 注入資產到 Assets 庫
            GameAssets.injectDynamicAssets(config);

            // 2. 初始化 WFC (傳入動態地形與設定)
            Game.wfc.init(config.biomes, config.settings);
            
            // 3. 設定世界基礎參數
            Game.state.world.settings = { width: 4096, height: 4096, scale: 0.02, octaves: 6 };
            Game.state.world.seed = Math.floor(Math.random() * 99999);
            Game.state.world.flavorText = config.intro;
            Game.state.world.modifications = {};

            // 啟動 Worker
            Game.worker.postMessage({
                type: 'init',
                payload: { settings: Game.state.world.settings, seed: Game.state.world.seed }
            });

            UI.log("AI", config.intro, "ai");
            
            // 顯示系統參數 (讓玩家知道遊戲規則變了)
            const settingsMsg = `規則已生成：遭遇率 ${(config.settings.trap_chance*100).toFixed(0)}% | 尋寶率 ${(config.settings.item_chance*100).toFixed(0)}%`;
            UI.log("系統", settingsMsg, "system");

            await Game.describeCurrentLocation(true);

        } catch (e) {
            console.error(e);
            UI.log("系統", "世界生成失敗，請重試。", "system");
        }
    },

    debugScan: async () => {
        const radius = 2;
        const STEP_SIZE = 10; // 定義每格的大小
        
        // 1. 先算出玩家在「第幾格」 (Grid Index)
        const gridX = Math.round(Game.state.player.x / STEP_SIZE);
        const gridY = Math.round(Game.state.player.y / STEP_SIZE);
        
        let gridHTML = '<div class="god-mode-grid">';
        let details = [];

        UI.log("系統", `=== 上帝視角 [中心: ${gridX},${gridY}] ===`, "system");

        // 2. 用「格數」進行迴圈
        for (let gy = gridY - radius; gy <= gridY + radius; gy++) {
            gridHTML += '<div style="height:30px; white-space:nowrap;">';
            
            for (let gx = gridX - radius; gx <= gridX + radius; gx++) {
                // 3. 轉回「世界座標」傳給 WFC 和 getTerrainValue
                const worldX = gx * STEP_SIZE;
                const worldY = gy * STEP_SIZE;
                
                // 這是存檔用的 key，確保跟玩家移動時生成的 key 一致
                const key = `${worldX},${worldY}`; // 或依據你的邏輯可能需要 `${gx},${gy}`，請看下方說明*
                
                // 注意：這裡我們統一邏輯。
                // 如果 Game.movePlayer 是存 `x=10, y=0`
                // 那存檔的 modifications key 應該要是 `10,0` 或是 `1,0`？
                // 根據之前的程式碼，movePlayer 是 +10，所以 key 應該是世界座標。
                
                const isPlayer = (gx === gridX && gy === gridY);
                
                // 取得地形
                const val = await Game.getTerrainValue(worldX, worldY);
                
                // WFC 計算
                const wfcResult = Game.wfc.collapse(worldX, worldY, val);
                
                // 檢查修改紀錄 (使用世界座標 key)
                // 修正：因為你在 movePlayer 是用 Math.round(x) 存，所以這裡是對的
                const modKey = `${worldX},${worldY}`;
                if (Game.state.world.modifications[modKey]) {
                    const mod = Game.state.world.modifications[modKey];
                    if (mod.feature !== undefined) wfcResult.feature = mod.feature;
                    if (mod.item !== undefined) wfcResult.item = mod.item;
                }

                // ... (圖示顯示邏輯保持不變) ...
                 let icon = "·";
                let cssClass = "god-empty";
                
                if (isPlayer) {
                    icon = "P"; 
                    cssClass = "god-player";
                } else if (wfcResult.feature) {
                    icon = "T"; 
                    cssClass = "god-trap";
                    details.push(`[${gx},${gy}] 陷阱: ${wfcResult.feature.name}`);
                } else if (wfcResult.item) {
                    icon = "I"; 
                    cssClass = "god-item";
                    details.push(`[${gx},${gy}] 物品: ${wfcResult.item.name}`);
                } else {
                    icon = wfcResult.biome.substring(0, 1);
                }

                gridHTML += `<span class="god-cell ${cssClass}" title="[${gx},${gy}] ${wfcResult.biome}">${icon}</span>`;
            }
            gridHTML += '</div>';
        }
        gridHTML += '</div>';

        // 輸出圖形介面
        const outputDiv = document.createElement('div');
        outputDiv.innerHTML = gridHTML;
        UI.output.appendChild(outputDiv);

        // 輸出文字詳情
        if (details.length > 0) {
            UI.log("系統", "偵測到實體:\n" + details.join("\n"), "system");
        } else {
            UI.log("系統", "周圍無特殊物件。", "system");
        }
        
        // 捲動到底部
        UI.output.scrollTop = UI.output.scrollHeight;
    },


    // ----------------------------------------------------------------
    // 核心互動邏輯
    // ----------------------------------------------------------------
    handleInput: async (input) => {
        UI.log("你", input, "user");

        const intent = await Game.parseIntent(input);
        console.log("Parsed Intent:", intent); 

        let systemResult = { success: true, message: "", updates: [] };

        switch (intent.action) {
            case "MOVE":
                await Game.movePlayer(intent.direction); 
                return; 

            case "FLEE": // 新增：逃跑邏輯
                await Game.fleePlayer();
                return;

            case "USE_ITEM":
                systemResult = Game.useItem(intent.target);
                break;

            case "CHECK_INVENTORY":
                Game.showInventory();
                return; 

            case "PICK_UP":
                systemResult = Game.pickUpItem();
                break;

            case "SKILL": 
                systemResult = Game.handleSkillAction(intent.type, intent.target);
                break;
                
            default:
                systemResult.message = "無特殊互動。";
                break;
        }

        // LLM 潤色
        if (intent.action !== "CHECK_INVENTORY") {
            const prompt = `
            玩家動作：${input}
            系統判定：${systemResult.message}
            當前HP：${Game.state.player.hp}%
            
            請描述這個過程。若系統判定失敗或受傷，請如實描述痛苦。
            `;
            const narrative = await API.call(prompt, "你是遊戲旁白。");
            UI.log("AI", narrative, "ai");
            
            if (systemResult.updates.length > 0) {
                UI.log("系統", systemResult.updates.join(" | "), "system");
            }
        }
    },

    parseIntent: async (input) => {
        // 1. 移動指令
        if (input.match(/北|上|前/)) return { action: "MOVE", direction: {x:0, y:-1} };
        if (input.match(/南|下|後/)) return { action: "MOVE", direction: {x:0, y:1} };
        if (input.match(/西|左/)) return { action: "MOVE", direction: {x:-1, y:0} };
        if (input.match(/東|右/)) return { action: "MOVE", direction: {x:1, y:0} };
        
        // 2. 新增：逃跑指令 (對應玩家輸入 "跑走", "逃跑")
        if (input.match(/跑|逃|撤/)) return { action: "FLEE" };

        if (input.match(/背包|道具|物品/)) return { action: "CHECK_INVENTORY" };
        if (input.match(/撿|拿|收/)) return { action: "PICK_UP" };

        // 3. 複雜指令
        const prompt = `
        玩家輸入："${input}"
        環境物件：${Game.currentLocationData?.feature?.name || "無"}
        
        輸出JSON:
        - 拆解/解除 -> { "action": "SKILL", "type": "disarm", "target": "目標" }
        - 搜索/找 -> { "action": "SKILL", "type": "scavenge", "target": "環境" }
        - 吃/用 -> { "action": "USE_ITEM", "target": "物品名" }
        - 攻擊 -> { "action": "ATTACK", "target": "目標" }
        - 其他 -> { "action": "OTHER" }
        `;
        
        try {
            const raw = await API.call(prompt, "JSON output only.", true);
            return JSON.parse(raw.replace(/```json|```/g, '').trim());
        } catch {
            return { action: "OTHER" };
        }
    },

    // ----------------------------------------------------------------
    // 動作實作
    // ----------------------------------------------------------------
    
    // 逃跑：隨機往一個方向移動
    fleePlayer: async () => {
        const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
        const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
        
        // 顯示系統訊息
        UI.log("系統", "你驚慌失措地往隨機方向逃跑！", "system");
        
        // 執行移動
        await Game.movePlayer(randomDir);
    },

    handleSkillAction: (type, target) => {
        const feature = Game.currentLocationData.feature; 
        let updates = [];
        let msg = "";
        let success = false;
        
        // 取得當前座標 Key，用於記錄狀態
        const key = `${Math.round(Game.state.player.x)},${Math.round(Game.state.player.y)}`;

        if (type === "disarm") {
            if (!feature || !feature.id.startsWith("t_")) {
                return { success: false, message: "這裡沒有陷阱。", updates: [] };
            }
            // 成功率計算
            const roll = Math.random();
            if (roll > 0.4) {
                success = true;
                msg = `成功拆除 ${feature.name}。`;
                const scrap = GameAssets.getById("m_scrap_metal");
                Game.state.player.inventory.push(scrap);
                updates.push(`獲得: ${scrap.name}`);
                
                // --- 關鍵：記錄這個地點的陷阱已被移除 ---
                if (!Game.state.world.modifications[key]) Game.state.world.modifications[key] = {};
                Game.state.world.modifications[key].feature = null; // 標記為無
                Game.currentLocationData.feature = null; // 即時更新

            } else {
                success = false;
                msg = `拆除失敗，觸發 ${feature.name}！`;
                if (feature.effect.type === "damage") {
                    const dmg = feature.effect.val;
                    Game.state.player.hp -= dmg;
                    updates.push(`HP -${dmg}`);
                    UI.updateHealth(Game.state.player.hp);
                }
                // 失敗通常也視為陷阱已觸發/損壞
                if (!Game.state.world.modifications[key]) Game.state.world.modifications[key] = {};
                Game.state.world.modifications[key].feature = null;
                Game.currentLocationData.feature = null;
            }
        }
        else if (type === "scavenge") {
            const roll = Math.random();
            if (roll > 0.5) { 
                const possibleItems = GameAssets.items.filter(i => i.type === 'material' || i.type === 'consumable');
                const foundItem = JSON.parse(JSON.stringify(possibleItems[Math.floor(Math.random() * possibleItems.length)]));
                Game.state.player.inventory.push(foundItem);
                success = true;
                msg = `找到了 ${foundItem.name}。`;
                updates.push(`獲得: ${foundItem.name}`);
            } else {
                success = false;
                msg = "什麼也沒找到。";
            }
        }
        else {
            msg = "動作無效。";
        }
        return { success, message: msg, updates };
    },

    useItem: (targetName) => {
        if (!targetName) return { success: false, message: "不知道要用什麼。", updates: [] };
        const idx = Game.state.player.inventory.findIndex(i => i.name.includes(targetName));
        if (idx === -1) {
            return { success: false, message: "背包裡找不到這個東西。", updates: [] };
        }

        const item = Game.state.player.inventory[idx];
        let updates = [];
        let msg = `使用了 ${item.name}。`;

        if (item.type === "consumable") {
            Game.state.player.inventory.splice(idx, 1);
            if (item.effect.type === "heal") {
                const oldHp = Game.state.player.hp;
                Game.state.player.hp = Math.min(Game.state.player.maxHp, Game.state.player.hp + item.effect.val);
                msg += `回復了 ${Game.state.player.hp - oldHp} 點生命。`;
                updates.push(`HP +${Game.state.player.hp - oldHp}`);
            }
        }

        UI.updateHealth(Game.state.player.hp);
        return { success: true, message: msg, updates: updates };
    },

    pickUpItem: () => {
        if (!Game.currentLocationData || !Game.currentLocationData.item) {
            return { success: false, message: "這裡沒什麼好撿的。", updates: [] };
        }
        const item = Game.currentLocationData.item;
        Game.state.player.inventory.push(item);
        
        // 記錄物品已被撿走
        const key = `${Math.round(Game.state.player.x)},${Math.round(Game.state.player.y)}`;
        if (!Game.state.world.modifications[key]) Game.state.world.modifications[key] = {};
        Game.state.world.modifications[key].item = null;
        
        Game.currentLocationData.item = null;
        return { success: true, message: `撿起了 ${item.name}。`, updates: [`獲得: ${item.name}`] };
    },

    showInventory: () => {
        const list = Game.state.player.inventory.map(i => `[${i.name}]`).join(" ");
        UI.log("背包", list || "空空如也", "system");
        UI.log("狀態", `HP: ${Game.state.player.hp}/${Game.state.player.maxHp}`, "system");
    },

    movePlayer: async (dir) => {
        Game.state.player.x += dir.x * 10;
        Game.state.player.y += dir.y * 10;
        Game.loadChunksAround(Game.state.player.x, Game.state.player.y);
        await Game.describeCurrentLocation();
    },

    describeCurrentLocation: async (isFirst = false) => {
        const px = Math.round(Game.state.player.x);
        const py = Math.round(Game.state.player.y);
        const key = `${px},${py}`;

        // 1. 取得機械數據 (Terrain, WFC, Modifications)
        const val = await Game.getTerrainValue(Game.state.player.x, Game.state.player.y);
        const wfcResult = Game.wfc.collapse(Game.state.player.x, Game.state.player.y, val);
        
        // 檢查世界記憶 (物品是否被拿走)
        if (Game.state.world.modifications[key]) {
            const mod = Game.state.world.modifications[key];
            if (mod.feature !== undefined) wfcResult.feature = mod.feature;
            if (mod.item !== undefined) wfcResult.item = mod.item;
        }
        Game.currentLocationData = wfcResult; 

        // 2. 處理系統訊息 (陷阱等)
        let systemAlerts = [];
        // ... (陷阱判定邏輯保持不變) ...
        if (wfcResult.item) systemAlerts.push(`看到: ${wfcResult.item.name}`);

        UI.updateStatus(px, py, wfcResult.biome);

        // ==========================================
        // 3. 核心修改：一致性檢查 (Memory Check)
        // ==========================================
        
        // 檢查是否來過這裡
        const visitMemory = Game.state.world.visited && Game.state.world.visited[key];
        
        let prompt = "";

        if (visitMemory) {
            // Case A: 舊地重遊
            // 我們把「上次的描述」餵給 LLM，要求它保持一致
            prompt = `
            [場景資訊]
            地點：${wfcResult.biome}
            當前狀態：${systemAlerts.length > 0 ? systemAlerts.join(", ") : "平靜"}
            
            [歷史記憶 - 重要]
            玩家之前來過這裡。當時的描述特徵是：
            "${visitMemory}"
            
            任務：
            請描述玩家「回到」這個地方的感覺。
            必須保留上述[歷史記憶]中的視覺特徵（例如顏色、擺設），不要產生矛盾。
            若環境有變化（如陷阱被拆了），請強調變化。
            `;
        } else {
            // Case B: 第一次來
            prompt = `
            [場景資訊]
            地點：${wfcResult.biome}
            氛圍：${wfcResult.flavor}
            物件：${systemAlerts.join(", ")}
            
            任務：
            描述玩家${isFirst ? '醒來' : '抵達'}時的詳細情景。
            請包含一些獨特的視覺細節（如牆上的塗鴉內容、特殊的氣味），讓這個地點變得獨特。
            `;
        }

        // 呼叫 LLM
        const text = await API.call(prompt, "你是遊戲旁白。");
        UI.log("AI", text, "ai");
        
        // 4. 如果是第一次來，將這次的描述「摘要」存起來
        if (!visitMemory) {
            // 為了省 Token，我們不需要存整段話，可以再叫 LLM 摘要一次，或者直接存前 100 字
            // 這裡演示最簡單的方式：直接存整段 (如果記憶體允許)
            if (!Game.state.world.visited) Game.state.world.visited = {};
            
            // 進階：我們可以偷偷叫 LLM 提取特徵 (Background Task)
            // 但為了回應速度，我們先存下這段文字作為參考
            Game.state.world.visited[key] = text.substring(0, 150) + "..."; 
        }

        if (systemAlerts.length > 0) {
            UI.log("系統", systemAlerts.join(" | "), "system");
        }
    },

    getTerrainValue: async (x, y) => {
        const CHUNK_SIZE = 64;
        const cx = Math.floor(x / CHUNK_SIZE);
        const cy = Math.floor(y / CHUNK_SIZE);
        const key = `${cx},${cy}`;
        
        let attempts = 0;
        
        // 修改處：增加對 'loading' 狀態的檢查
        // 當 Chunk 不存在 或者 狀態是 'loading' 時，都需要等待
        while ((!Game.state.chunks[key] || Game.state.chunks[key] === 'loading') && attempts < 20) {
            Game.loadChunksAround(x, y);
            await new Promise(r => setTimeout(r, 100)); // 等待 100ms
            attempts++;
        }
        
        // 修改處：如果超時後仍然是 'loading' 或不存在，回傳預設值
        if (!Game.state.chunks[key] || Game.state.chunks[key] === 'loading') {
            console.warn(`Chunk ${key} loading timeout, using default height.`);
            return 0.5;
        }

        const lx = Math.floor(x) % CHUNK_SIZE;
        const ly = Math.floor(y) % CHUNK_SIZE;
        const finalX = lx < 0 ? lx + CHUNK_SIZE : lx;
        const finalY = ly < 0 ? ly + CHUNK_SIZE : ly;
        
        return Game.state.chunks[key][finalY * CHUNK_SIZE + finalX];
    },

    loadChunksAround: (x, y) => {
        const CHUNK_SIZE = 64;
        const centerCX = Math.floor(x / CHUNK_SIZE);
        const centerCY = Math.floor(y / CHUNK_SIZE);
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const cx = centerCX + dx;
                const cy = centerCY + dy;
                const key = `${cx},${cy}`;
                if (!Game.state.chunks[key]) {
                    Game.state.chunks[key] = 'loading'; 
                    Game.worker.postMessage({ type: 'generate', payload: { chunkX: cx, chunkY: cy } });
                }
            }
        }
    }

};

