const UI = {
    output: document.getElementById('terminal-output'),
    input: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    modal: document.getElementById('settings-modal'),
    debugBtn: document.getElementById('debug-btn'), // 1. 取得按鈕
    
    // Debug Map
    canvas: document.getElementById('mapCanvas'),
    ctx: document.getElementById('mapCanvas') ? document.getElementById('mapCanvas').getContext('2d') : null,

    init: () => {
        // 檢查 API Key
        if (!localStorage.getItem('game_api_key')) {
            UI.modal.style.display = 'flex';
        } else {
            Game.init();
        }

        UI.sendBtn.addEventListener('click', UI.handleSend);
        UI.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') UI.handleSend();
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const key = document.getElementById('api-key-input').value;
            const ep = document.getElementById('api-endpoint-input').value;
            if (key) {
                API.saveSettings(key, ep);
                UI.modal.style.display = 'none';
                Game.init();
                UI.log("系統", "連線已建立。請描述世界。", "system");
            }
        });
        if (UI.debugBtn) {
            UI.debugBtn.addEventListener('click', () => {
                if (Game.state.world.seed) {
                    Game.debugScan(); // 呼叫遊戲內的掃描功能
                } else {
                    UI.log("系統", "世界尚未生成，無法使用上帝視角。", "system");
                }
            });
        }

        // Debug Toggle (Ctrl + M)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                const mapContainer = document.getElementById('debug-map-container');
                if (mapContainer) mapContainer.classList.toggle('hidden');
            }
        });
    },

    // 處理發送訊息
    handleSend: () => {
        const val = UI.input.value.trim();
        if (!val) return;
        UI.input.value = '';

        if (!Game.state.world.seed) {
            // 第一步：創建世界
            Game.createWorld(val);
        } else {
            // 遊戲中
            Game.handleInput(val);
        }
    },

    // 顯示訊息日誌
    log: (speaker, text, type) => {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        // 處理換行符號
        const formattedText = text.replace(/\n/g, '<br>');
        div.innerHTML = `<strong>${speaker}:</strong> ${formattedText}`;
        UI.output.appendChild(div);
        UI.output.scrollTop = UI.output.scrollHeight;
    },

    // 更新狀態列：位置
    updateStatus: (x, y, biome) => {
        const el = document.getElementById('location-display');
        if (el) el.innerText = `LOC: [${x.toFixed(0)}, ${y.toFixed(0)}] ${biome}`;
    },

    // 關鍵修復：新增 updateHealth 函式
    updateHealth: (hp) => {
        const el = document.getElementById('health-display');
        if (el) {
            el.innerText = `HP: ${Math.max(0, hp).toFixed(0)}%`;
            if (hp < 30) el.style.color = 'red';
            else el.style.color = '#33ff33';
        }
    },

    // 繪製 Debug 小地圖
    drawDebugMap: (cx, cy, data) => {
        if (!UI.ctx) return;
        
        // 簡化：只畫最新的一個 Chunk 示意
        const size = 64; // Chunk Size
        UI.canvas.width = size;
        UI.canvas.height = size;
        
        const imgData = UI.ctx.createImageData(size, size);
        for (let i = 0; i < data.length; i++) {
            const val = data[i] * 255;
            imgData.data[i*4] = val;     // R
            imgData.data[i*4+1] = val;   // G
            imgData.data[i*4+2] = val;   // B
            imgData.data[i*4+3] = 255;   // Alpha
        }
        UI.ctx.putImageData(imgData, 0, 0);
    }
};

window.onload = UI.init;