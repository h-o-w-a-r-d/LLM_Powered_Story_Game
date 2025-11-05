const API = {
    call: async (prompt) => {
        const settings = Storage.getSettings();
        if (!settings || !settings.apiKey) {
            alert('請先在設定中輸入 API 金鑰！');
            return null;
        }

        let { apiEndpoint, apiKey, model } = settings;

        // Auto-complete chat/completions endpoint for OpenAI compatible APIs
        if (!apiEndpoint.includes('/chat/completions')) {
            apiEndpoint = apiEndpoint.replace(/\/$/, '') + '/chat/completions';
        }

        console.log('使用的 API 端點:', apiEndpoint);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: "你是一個專業的文字冒險遊戲主持人，請嚴格按照 JSON 格式回應。"
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 1.2
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 請求失敗，狀態碼：${response.status}\n響應內容：${errorText}`);
            }

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const responseText = await response.text();
                throw new Error(`API 返回了非 JSON 響應：${responseText.substring(0, 200)}...`);
            }

            return await response.json();

        } catch (error) {
            console.error('API 呼叫錯誤:', error);
            alert(`API 呼叫時發生錯誤：${error.message}`);
            return null;
        }
    }
};
