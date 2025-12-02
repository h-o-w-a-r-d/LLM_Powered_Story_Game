const API = {
    key: localStorage.getItem('game_api_key') || '',
    endpoint: localStorage.getItem('game_api_endpoint') || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',

    saveSettings: (key, endpoint) => {
        API.key = key;
        API.endpoint = endpoint;
        localStorage.setItem('game_api_key', key);
        localStorage.setItem('game_api_endpoint', endpoint);
    },

    call: async (prompt, systemPrompt = "", jsonMode = false) => {
        if (!API.key) throw new Error("API Key 未設定");

        const isGemini = API.endpoint.includes('goog');
        let url = API.endpoint;
        let body = {};

        if (isGemini) {
            if (!url.includes('key=')) url += `?key=${API.key}`;
            const fullPrompt = `${systemPrompt}\n\n${prompt}`;
            body = {
                contents: [{ parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    temperature: 1.0,
                    // 若需要 JSON 模式
                    responseMimeType: jsonMode ? "application/json" : "text/plain"
                }
            };
        } else {
            // OpenAI 格式
            body = {
                model: "gpt-4o", // 或其他模型
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                response_format: jsonMode ? { type: "json_object" } : undefined
            };
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: isGemini ? { 'Content-Type': 'application/json' } : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API.key}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            const data = await res.json();
            
            let text = "";
            if (isGemini) {
                text = data.candidates[0].content.parts[0].text;
            } else {
                text = data.choices[0].message.content;
            }
            return text;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
};