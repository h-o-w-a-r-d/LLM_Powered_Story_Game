// Language pack system
const languages = {
    'zh-TW': {
        name: '繁體中文',
        ui: {
            // Settings panel
            settings: '設定',
            apiEndpoint: 'API 端點',
            apiKey: 'API 金鑰',
            model: '模型',
            theme: '顏色主題',
            language: '語言',
            saveSettings: '儲存設定',
            close: '關閉',
            
            // Theme options
            themes: {
                dark: '深色主題',
                light: '淺色主題',
                cyberpunk: '賽博龐克',
                fantasy: '奇幻',
                steampunk: '蒸汽龐克',
                neon: '霓虹',
                nature: '自然',
                ocean: '海洋',
                sunset: '夕陽',
                galaxy: '銀河'
            },
            
            // Character creation
            characterCreation: '創建你的角色',
            selectWorld: '選擇世界觀',
            characterDescription: '角色描述',
            characterDescriptionPlaceholder: '例如：一個勇敢的騎士，夢想是屠龍。',
            attributeAllocation: '屬性分配',
            remainingPoints: '剩餘點數',
            cheatMode: '🎯 作弊模式 (無限屬性點)',
            resetAttributes: '重置屬性',
            startAdventure: '開始新冒險',
            
            // Game interface
            characterStatus: '角色狀態',
            itemsEquipment: '物品 & 裝備',
            skillsAttributes: '技能 & 屬性',
            regenerateAnswer: '重新生成回答',
            customActionPlaceholder: '輸入自訂行動...',
            submit: '送出',
            
            // Floating buttons
            help: '使用說明',
            helpTitle: '使用說明',
            gotIt: '我知道了',
            saveGame: '儲存遊戲',
            loadGame: '載入遊戲',
            
            // Other
            empty: '空',
            none: '無',
            generating: '正在生成故事...'
        },
        
        // Help content
        help: {
            quickStart: '🚀 快速上手',
            step1: {
                title: '設定 API 金鑰',
                desc: '點擊右下角 ⚙️ 設定按鈕，前往 Google AI Studio 免費申請 Gemini API 金鑰，然後貼上並儲存。'
            },
            step2: {
                title: '創建你的角色',
                desc: '選擇喜歡的世界觀，詳細描述你想扮演的角色，分配 175 點屬性點數（或開啟作弊模式獲得無限點數）。'
            },
            step3: {
                title: '開始冒險',
                desc: '點擊「開始新冒險」，AI 將為你生成專屬的開場故事和初始狀態。'
            },
            step4: {
                title: '享受遊戲',
                desc: '點擊行動選項推動劇情，或使用自訂行動輸入任何想執行的動作。隨時可查看角色狀態、存檔或重新生成回答。'
            },
            features: '✨ 特色功能',
            feature1: {
                title: '10 種精美主題',
                desc: '深色、賽博龐克、奇幻、蒸汽龐克等多種視覺風格任你選擇'
            },
            feature2: {
                title: '無限制使用',
                desc: '想玩多久就玩多久，沒有次數限制，只消耗你自己的 API 額度'
            },
            feature3: {
                title: '17 種世界觀',
                desc: '奇幻、科幻、武俠、仙俠等豐富世界，每種都有獨特的狀態系統'
            },
            feature4: {
                title: '支援多種 AI',
                desc: '支援 OpenAI、Claude、Gemini 等所有相容 API，自由選擇最強模型'
            },
            feature5: {
                title: '本地化部署',
                desc: '可下載到本地運行，完全掌控你的資料和隱私'
            },
            feature6: {
                title: '完全免費',
                desc: '所有功能完全免費開放，無需註冊，無隱藏費用'
            },
            gameplay: '🎮 遊戲玩法',
            tip1: {
                title: '角色描述技巧',
                desc: '描述越詳細，AI 生成的故事越貼合你的想像。包含背景、性格、目標等資訊效果更佳。'
            },
            tip2: {
                title: '重新生成功能',
                desc: '不滿意 AI 的回應？點擊「重新生成回答」按鈕，AI 會給出不同的故事發展。'
            },
            tip3: {
                title: '自訂行動',
                desc: '不侷限於預設選項！輸入任何你想執行的動作，AI 會即時回應生成劇情。'
            },
            tip4: {
                title: '存檔系統',
                desc: '支援瀏覽器存檔和文件下載兩種方式，隨時保存你的冒險進度。'
            },
            faq: '❓ 常見問題',
            faq1: {
                q: 'Q: API 金鑰需要付費嗎？',
                a: 'A: Google AI Studio 提供免費額度，一般使用完全足夠。只有大量使用才需要付費。'
            },
            faq2: {
                q: 'Q: 我的 API 金鑰安全嗎？',
                a: 'A: 金鑰只存在你的瀏覽器本地，不會上傳到我們的服務器，完全安全。'
            },
            faq3: {
                q: 'Q: 可以離線使用嗎？',
                a: 'A: 可以下載到本地運行，但呼叫 AI 時仍需要網路連線。'
            },
            faq4: {
                q: 'Q: 支援哪些 AI 模型？',
                a: 'A: 支援所有 OpenAI 格式的 API，包含 GPT-4、Claude、Gemini 等主流模型。'
            }
        }
    },
    
    'en-US': {
        name: 'English',
        ui: {
            // Settings panel
            settings: 'Settings',
            apiEndpoint: 'API Endpoint',
            apiKey: 'API Key',
            model: 'Model',
            theme: 'Color Theme',
            language: 'Language',
            saveSettings: 'Save Settings',
            close: 'Close',
            
            // Theme options
            themes: {
                dark: 'Dark Theme',
                light: 'Light Theme',
                cyberpunk: 'Cyberpunk',
                fantasy: 'Fantasy',
                steampunk: 'Steampunk',
                neon: 'Neon',
                nature: 'Nature',
                ocean: 'Ocean',
                sunset: 'Sunset',
                galaxy: 'Galaxy'
            },
            
            // Character creation
            characterCreation: 'Create Your Character',
            selectWorld: 'Select World',
            characterDescription: 'Character Description',
            characterDescriptionPlaceholder: 'e.g., A brave knight who dreams of slaying dragons.',
            attributeAllocation: 'Attribute Allocation',
            remainingPoints: 'Remaining Points',
            cheatMode: '🎯 Cheat Mode (Unlimited Attribute Points)',
            resetAttributes: 'Reset Attributes',
            startAdventure: 'Start New Adventure',
            
            // Game interface
            characterStatus: 'Character Status',
            itemsEquipment: 'Items & Equipment',
            skillsAttributes: 'Skills & Attributes',
            regenerateAnswer: 'Regenerate Answer',
            customActionPlaceholder: 'Enter custom action...',
            submit: 'Submit',
            
            // Floating buttons
            saveGame: 'Save Game',
            loadGame: 'Load Game',
            
            // Other
            empty: 'Empty',
            none: 'None',
            generating: 'Generating story...'
        },
        
        // Help content
        help: {
            quickStart: '🚀 Quick Start',
            step1: {
                title: 'Set up API Key',
                desc: 'Click the ⚙️ Settings button in the bottom right, go to Google AI Studio to apply for a free Gemini API key, then paste and save it.'
            },
            step2: {
                title: 'Create Your Character',
                desc: 'Choose your favorite worldview, describe your desired character in detail, and allocate 175 attribute points (or enable cheat mode for unlimited points).'
            },
            step3: {
                title: 'Start Adventure',
                desc: 'Click "Start New Adventure", and the AI will generate an exclusive opening story and initial status for you.'
            },
            step4: {
                title: 'Enjoy the Game',
                desc: 'Click action options to advance the plot, or use custom actions to input any action you want to perform. You can check character status, save, or regenerate responses at any time.'
            },
            features: '✨ Features',
            feature1: {
                title: '10 Exquisite Themes',
                desc: 'Choose from various visual styles such as Dark, Cyberpunk, Fantasy, Steampunk, and more.'
            },
            feature2: {
                title: 'Unlimited Usage',
                desc: 'Play as long as you want, with no usage limits, only consuming your own API quota.'
            },
            feature3: {
                title: '17 Worldviews',
                desc: 'Rich worlds such as Fantasy, Sci-Fi, Wuxia, Xianxia, each with unique status systems.'
            },
            feature4: {
                title: 'Supports Multiple AIs',
                desc: 'Supports all OpenAI-compatible APIs, including mainstream models like GPT-4, Claude, and Gemini, allowing you to freely choose the strongest model.'
            },
            feature5: {
                title: 'Local Deployment',
                desc: 'Can be downloaded and run locally, giving you full control over your data and privacy.'
            },
            feature6: {
                title: 'Completely Free',
                desc: 'All features are completely free and open, no registration required, no hidden fees.'
            },
            gameplay: '🎮 Gameplay',
            tip1: {
                title: 'Character Description Tips',
                desc: 'The more detailed your description, the more the AI-generated story will align with your imagination. Including background, personality, and goals will yield better results.'
            },
            tip2: {
                title: 'Regenerate Function',
                desc: 'Not satisfied with the AI\'s response? Click the "Regenerate Answer" button, and the AI will provide a different story development.'
            },
            tip3: {
                title: 'Custom Actions',
                desc: 'Not limited to default options! Enter any action you want to perform, and the AI will instantly respond and generate the plot.'
            },
            tip4: {
                title: 'Save System',
                desc: 'Supports both browser saving and file download, allowing you to save your adventure progress at any time.'
            },
            faq: '❓ Frequently Asked Questions',
            faq1: {
                q: 'Q: Is the API key paid?',
                a: 'A: Google AI Studio provides a free tier, which is generally sufficient for normal use. Payment is only required for heavy usage.'
            },
            faq2: {
                q: 'Q: Is my API key safe?',
                a: 'A: The API key only exists locally in your browser and will not be uploaded to our servers, ensuring complete security.'
            },
            faq3: {
                q: 'Q: Can it be used offline?',
                a: 'A: It can be downloaded and run locally, but an internet connection is still required to call the AI.'
            },
            faq4: {
                q: 'Q: Which AI models are supported?',
                a: 'A: All OpenAI-formatted APIs are supported, including mainstream models like GPT-4, Claude, and Gemini.'
            }
        }
    }
};

// Current language
let currentLanguage = 'zh-TW';

// Language switching function
const LanguageManager = {
    // Get text for current language
    getText: (key) => {
        const keys = key.split('.');
        let text = languages[currentLanguage];
        
        for (const k of keys) {
            if (text && text[k]) {
                text = text[k];
            } else {
                console.warn(`Language key not found: ${key}`);
                return key; // 返回原始key作為fallback
            }
        }
        
        return text;
    },
    
    // Set language
    setLanguage: (lang) => {
        if (languages[lang]) {
            currentLanguage = lang;
            LanguageManager.updateUI();
            // Save to localStorage
            localStorage.setItem('gameLanguage', lang);
        }
    },
    
    // Update UI text
    updateUI: () => {
        // 更新頁面標題
        document.title = currentLanguage === 'zh-TW' ? 'AI 動態文字冒險遊戲' : 'AI Dynamic Text Adventure Game';
        
        // 更新HTML lang屬性
        document.documentElement.lang = currentLanguage === 'zh-TW' ? 'zh-Hant' : 'en';
        
        // 更新所有帶有data-lang-key屬性的元素
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            const text = LanguageManager.getText(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'password')) {
                element.placeholder = text;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.hasAttribute('title')) {
                element.title = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 更新主題選項
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            Array.from(themeSelector.options).forEach(option => {
                const themeKey = option.value;
                option.textContent = LanguageManager.getText(`ui.themes.${themeKey}`);
            });
        }
        
        // 更新語言選項
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            Array.from(languageSelector.options).forEach(option => {
                const langKey = option.value;
                option.textContent = languages[langKey].name;
            });
        }
    },
    
    // Initialize language system
    init: () => {
        // Read saved language settings from localStorage
        const savedLanguage = localStorage.getItem('gameLanguage');
        if (savedLanguage && languages[savedLanguage]) {
            currentLanguage = savedLanguage;
        }
        
        // Set the value of the language selector
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = currentLanguage;
            languageSelector.addEventListener('change', (e) => {
                LanguageManager.setLanguage(e.target.value);
            });
        }
        
        // Initialize UI
        LanguageManager.updateUI();
    }
};