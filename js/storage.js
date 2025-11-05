
const Storage = {
    saveSettings: (settings) => {
        localStorage.setItem('gameSettings', JSON.stringify(settings));
    },

    getSettings: () => {
        const settings = localStorage.getItem('gameSettings');
        return settings ? JSON.parse(settings) : null;
    },

    saveGameState: (gameState) => {
        localStorage.setItem('gameState', JSON.stringify(gameState));
    },

    getGameState: () => {
        const gameState = localStorage.getItem('gameState');
        return gameState ? JSON.parse(gameState) : null;
    },

    clearGameState: () => {
        localStorage.removeItem('gameState');
    },

    saveToBrowser: () => {
        const gameState = Storage.getGameState();
        if (gameState) {
            localStorage.setItem('browserGameSave', JSON.stringify(gameState));
            alert('遊戲已儲存至瀏覽器！');
        } else {
            alert('沒有遊戲進度可以儲存。');
        }
    },

    loadFromBrowser: () => {
        const browserSave = localStorage.getItem('browserGameSave');
        if (browserSave) {
            try {
                const gameState = JSON.parse(browserSave);
                Storage.saveGameState(gameState);
                Game.load(gameState);
                alert('遊戲已從瀏覽器載入！');
            } catch (error) {
                alert('載入存檔失敗，檔案格式錯誤。');
            }
        } else {
            alert('瀏覽器中沒有儲存的遊戲進度。');
        }
    },

    saveGameToFile: () => {
        const gameState = Storage.getGameState();
        if (gameState) {
            const data = JSON.stringify(gameState, null, 2);
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-text-adventure-save-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            alert('遊戲已儲存為檔案！');
        }
    },

    loadGameFromFile: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const gameState = JSON.parse(e.target.result);
                        Storage.saveGameState(gameState);
                        Game.load(gameState);
                        alert('遊戲已成功載入！');
                    } catch (error) {
                        alert('載入存檔失敗，檔案格式錯誤。');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
};
