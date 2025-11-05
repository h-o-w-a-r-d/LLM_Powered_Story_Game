const Game = {
    gameState: {},

    start: (worldType, characterDescription, customAttributes = null) => {
        Storage.clearGameState();
        
        // Get the corresponding character status system based on the world view
        const statusSystem = worldStatusSystems[worldType] || {
            "生命值": 100,
            "魔力": 50,
            "體力": 80,
            "等級": 1,
            "經驗值": 0,
            "inventory": [],
            "skills": []
        };
        
        // If there are custom attributes, use custom values to override default values
        let finalStatus = { ...statusSystem };
        if (customAttributes) {
            Object.keys(customAttributes).forEach(key => {
                if (finalStatus.hasOwnProperty(key)) {
                    finalStatus[key] = customAttributes[key];
                }
            });
        }
        
        Game.gameState = {
            worldType: worldType,
            characterDescription: characterDescription,
            characterStatus: finalStatus,
            gameHistory: [],
            currentActions: []
        };
        UI.clearNarrative(); // Clear the narrative display
        Game.generateStory("開始新遊戲");
    },

    handleAction: (action) => {
        Game.gameState.lastPlayerAction = action;
        Game.generateStory(action);
    },

    generateStory: async (playerAction) => {
        UI.setLoading(true);

        try {
            const prompt = Game.constructPrompt(playerAction);
            const aiResponse = await API.call(prompt);

            if (aiResponse) {
                console.log('收到 AI 響應:', aiResponse); // For debugging

                if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
                    throw new Error('API 響應格式不正確，缺少 choices[0].message');
                }

                const responseContent = aiResponse.choices[0].message.content;
                console.log('提取的響應內容:', responseContent); // For debugging

                let responseJson;
                try {
                    let cleanContent = responseContent
                        .replace(/```json\s*/g, '')
                        .replace(/```\s*/g, '')
                        .trim();
                    
                    // Check if JSON is complete, try to fix if not
                    if (!cleanContent.endsWith('}')) {
                        console.warn('JSON 似乎被截斷，嘗試修復...');
                        
                        // Try to find the last complete part
                        const lastCompleteObject = cleanContent.lastIndexOf('}');
                        if (lastCompleteObject > 0) {
                            cleanContent = cleanContent.substring(0, lastCompleteObject + 1);
                        } else {
                            // If a complete object cannot be found, create a basic response
                            throw new Error('無法修復截斷的 JSON');
                        }
                    }
                    
                    responseJson = JSON.parse(cleanContent);
                    
                    // Validate required fields
                    if (!responseJson.narrative) {
                        responseJson.narrative = "故事繼續進行中...";
                    }
                    if (!responseJson.status) {
                        responseJson.status = Game.gameState.characterStatus || {
                            "生命值": 100,
                            "魔力": 50,
                            "體力": 80,
                            "等級": 1,
                            "經驗值": 0,
                            "inventory": [],
                            "skills": []
                        };
                    }
                    if (!responseJson.actions || !Array.isArray(responseJson.actions)) {
                        responseJson.actions = [
                            "繼續探索",
                            "查看周圍環境",
                            "檢查狀態",
                            "休息片刻"
                        ];
                    }
                    
                } catch (parseError) {
                    console.error('JSON 解析錯誤:', parseError);
                    console.error('原始內容:', responseContent);
                    
                    // Try to extract narrative from original content
                    let extractedNarrative = "遊戲繼續進行中...";
                    const narrativeMatch = responseContent.match(/"narrative":\s*"([^"]+)"/);
                    if (narrativeMatch) {
                        extractedNarrative = narrativeMatch[1];
                    }
                    
                    responseJson = {
                        narrative: extractedNarrative,
                        status: Game.gameState.characterStatus || {
                            "生命值": 100,
                            "魔力": 50,
                            "體力": 80,
                            "等級": 1,
                            "經驗值": 0,
                            "inventory": ["基本裝備"],
                            "skills": ["基本技能"]
                        },
                        actions: [
                            "繼續探索",
                            "查看周圍環境",
                            "檢查狀態",
                            "休息片刻",
                            "重新嘗試"
                        ]
                    };
                }

                const newNarrative = Game.updateGameState(responseJson);
                Game.renderGameState(newNarrative);
            }
        } catch (error) {
            console.error("生成故事時發生錯誤:", error);
            
            const errorNarrative = `遊戲暫時遇到了一些問題... 🎲\n\n錯誤詳情：${error.message}`;
            UI.updateNarrative(errorNarrative);
            
            const fallbackActions = [
                "重試上個動作",
                "重新開始",
                "檢查設定",
                "保存遊戲",
                "查看幫助"
            ];
            UI.updateActions(fallbackActions);
        } finally {
            UI.setLoading(false); // Ensure loading is always turned off
        }
    },

    constructPrompt: (playerAction) => {
        const history = Game.gameState.gameHistory
            .slice(-10)
            .map(h => h.narrative)
            .join('\n\n');

        // Check if any attribute is 0 or negative
        const criticalStatus = Game.checkCriticalStatus();

        return `你是一個專業、富有創意的文字冒險遊戲主持人(Game Master)。

**遊戲背景:**
- **世界觀:** ${Game.gameState.worldType}
- **角色:** ${Game.gameState.characterDescription}

**最近的故事情節:**
${history || '遊戲剛開始'}

**當前角色狀態:**
${JSON.stringify(Game.gameState.characterStatus, null, 2)}

**玩家的行動:**
"${playerAction}"

**數值基準參考：**
- 0：極度危險狀態，必須立即處理！
- 1-20：非常低（虛弱/新手/危險）
- 21-50：普通（一般人水準）
- 51-100：優秀（專業/熟練）
- 101-301：卓越（專家/高手）
- 301-400：超凡（大師/英雄）
- 401-500：傳說（神話級/無敵）

**重要規則：**
${criticalStatus.hasCritical ? `
⚠️ **緊急狀況：** ${criticalStatus.message}
- 當任何重要屬性降到0時，必須在故事中體現嚴重後果
- 生命值/健康/氣血等為0：角色瀕死或昏迷，需要緊急救治
- 理智值/精神力為0：角色精神崩潰，行為異常
- 魔力/內力/能量為0：無法使用特殊能力
- 體力/精力為0：角色極度疲憊，行動受限
- 其他重要屬性為0：根據世界觀設定相應的嚴重後果
- 必須提供相關的恢復選項或求助選項` : ''}

**重要：請嚴格按照以下 JSON 格式回應，不要包含任何其他文字：**
**注意：status 中的屬性名稱必須使用中文，並且要根據當前世界觀使用對應的狀態系統！**
**重要：請保持並更新上面提供的當前角色狀態數值，根據上述基準判斷角色能力強弱！**

{
  "narrative": "引人入勝的故事情節，約 150-250 字${criticalStatus.hasCritical ? '，必須描述屬性為0帶來的嚴重後果' : ''}",
  "status": ${JSON.stringify(Game.gameState.characterStatus, null, 4).replace(/\n/g, '\n    ')},
  "actions": [
    "選項1：具體行動",
    "選項2：不同方向", 
    "選項3：與環境互動",
    "選項4：謹慎觀察",
    "選項5：大膽嘗試"
  ]
}`;
    },

    updateGameState: (response) => {
        if (!response.narrative) response.narrative = "故事繼續中...";
        if (!response.status) response.status = Game.gameState.characterStatus;
        if (!response.actions) response.actions = ["繼續", "觀察", "休息"];

        Game.gameState.characterStatus = response.status;
        Game.gameState.currentActions = response.actions;
        
        const newHistoryEntry = {
            narrative: response.narrative,
            status: { ...response.status },
            actions: [...response.actions],
            timestamp: new Date().toISOString()
        };

        Game.gameState.gameHistory.push(newHistoryEntry);

        if (Game.gameState.gameHistory.length > 20) {
            Game.gameState.gameHistory = Game.gameState.gameHistory.slice(-50);
        }

        Storage.saveGameState(Game.gameState);
        return newHistoryEntry.narrative; // Return the new narrative text
    },

    renderGameState: (newNarrative) => {
        // If no new narrative is provided, use the latest history record
        if (!newNarrative && Game.gameState.gameHistory.length > 0) {
            newNarrative = Game.gameState.gameHistory[Game.gameState.gameHistory.length - 1].narrative;
        }
        
        if (newNarrative) {
            UI.updateNarrative(newNarrative);
        }
        UI.updateStatus(Game.gameState.characterStatus);
        UI.updateActions(Game.gameState.currentActions);
    },

    checkCriticalStatus: () => {
        const status = Game.gameState.characterStatus;
        const criticalAttributes = [];
        
        // Check if important attributes are 0 or negative
        for (const [key, value] of Object.entries(status)) {
            if (typeof value === 'number' && value <= 0 && key !== 'inventory' && key !== 'skills') {
                criticalAttributes.push(key);
            }
        }
        
        return {
            hasCritical: criticalAttributes.length > 0,
            attributes: criticalAttributes,
            message: criticalAttributes.length > 0 ? 
                `以下屬性已降至危險水平：${criticalAttributes.join('、')}` : ''
        };
    },

    regenerateLastResponse: async () => {
        if (Game.gameState.gameHistory.length === 0) {
            alert('沒有可重新生成的內容！');
            return;
        }

        // Save the last player action
        const lastAction = Game.gameState.lastPlayerAction || "繼續冒險";
        
        // Remove the last history entry and the last narrative
        const removedEntry = Game.gameState.gameHistory.pop();
        
        // Restore to the previous state
        if (Game.gameState.gameHistory.length > 0) {
            const lastState = Game.gameState.gameHistory[Game.gameState.gameHistory.length - 1];
            Game.gameState.characterStatus = { ...lastState.status };
            Game.gameState.currentActions = [...lastState.actions];
        }

        // Remove the last narrative section from the UI
        UI.removeLastNarrative();
        
        // Regenerate the same player action, but get a different AI response
        await Game.generateStory(lastAction);
    },

    load: (gameState) => {
        Game.gameState = gameState;
        UI.clearNarrative(); // Clear the narrative display first
        // Re-render the entire history
        Game.gameState.gameHistory.forEach(historyItem => {
            UI.updateNarrative(historyItem.narrative);
        });
        // Update status and actions to the latest state
        UI.updateStatus(Game.gameState.characterStatus);
        UI.updateActions(Game.gameState.currentActions);

        // Notify the main script that the game has loaded
        window.dispatchEvent(new CustomEvent('gameLoaded'));
    }
};