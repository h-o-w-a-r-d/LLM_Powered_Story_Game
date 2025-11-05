
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language system
    LanguageManager.init();
    
    // --- DOM Elements ---
    const helpPanel = document.getElementById('help-panel');
    const settingsPanel = document.getElementById('settings-panel');
    const characterCreationPanel = document.getElementById('character-creation-panel');
    const mainGamePanel = document.getElementById('main-game-panel');
    const overlay = document.getElementById('overlay');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const worldTypeSelect = document.getElementById('world-type');

    // --- Initialization ---
    const init = () => {
        populateWorldTypes();
        loadSettings();
        addEventListeners();
    };

    // --- Game State ---
    let gameStarted = false;

    // --- Modal Functions ---
    const showModal = (modalElement) => {
        // First hide all other modal panels
        if (modalElement !== helpPanel) {
            helpPanel.classList.remove('active');
            helpPanel.classList.add('hidden');
        }
        if (modalElement !== settingsPanel) {
            settingsPanel.classList.remove('active');
            settingsPanel.classList.add('hidden');
        }
        if (modalElement !== characterCreationPanel) {
            characterCreationPanel.classList.remove('active');
            characterCreationPanel.classList.add('hidden');
        }
        
        overlay.classList.add('active');
        modalElement.classList.remove('hidden');
        modalElement.classList.add('active');
    };

    const hideModal = (modalElement) => {
        modalElement.classList.remove('active');
        // Delay hiding to allow animation to complete
        setTimeout(() => {
            modalElement.classList.add('hidden');
            
            // Check if any other modal panels are open
            if (!helpPanel.classList.contains('active') &&
                !settingsPanel.classList.contains('active') && 
                !characterCreationPanel.classList.contains('active')) {
                overlay.classList.remove('active');
                
                // If the game has started and no modal panels are open, show the main game panel
                if (gameStarted) {
                    mainGamePanel.classList.remove('hidden');
                } else {
                    // If the game has not started, show the character creation panel
                    showModal(characterCreationPanel);
                }
            }
        }, 300);
    };

    const hideAllModals = () => {
        helpPanel.classList.remove('active');
        settingsPanel.classList.remove('active');
        characterCreationPanel.classList.remove('active');
        setTimeout(() => {
            helpPanel.classList.add('hidden');
            settingsPanel.classList.add('hidden');
            characterCreationPanel.classList.add('hidden');
            overlay.classList.remove('active');
            
            // If the game has started, show the main game panel
            if (gameStarted) {
                mainGamePanel.classList.remove('hidden');
            } else {
                // If the game has not started, show the character creation panel
                showModal(characterCreationPanel);
            }
        }, 300);
    };

    // --- Functions ---
    const populateWorldTypes = () => {
        worldTypes.forEach(world => {
            const option = document.createElement('option');
            option.value = world;
            option.textContent = world;
            worldTypeSelect.appendChild(option);
        });
        
        // Initialize attribute sliders
        updateAttributeSliders();
    };
    
    // Attribute allocation related variables
    let currentAttributes = {};
    let totalPoints = 175;
    let usedPoints = 0;
    let cheatMode = false;
    
    // Update attribute sliders
    const updateAttributeSliders = () => {
        const worldType = worldTypeSelect.value;
        const statusSystem = worldStatusSystems[worldType] || worldStatusSystems["奇幻 (Fantasy)"];
        const slidersContainer = document.getElementById('attribute-sliders');
        
        slidersContainer.innerHTML = '';
        currentAttributes = {};
        usedPoints = 0;
        
        // Create sliders for each numeric attribute
        Object.keys(statusSystem).forEach(key => {
            if (typeof statusSystem[key] === 'number' && key !== 'inventory' && key !== 'skills') {
                const defaultValue = Math.min(statusSystem[key], 50); // Default value is the original value or 50, whichever is smaller
                currentAttributes[key] = defaultValue;
                usedPoints += defaultValue;
                
                const sliderGroup = document.createElement('div');
                sliderGroup.className = 'attribute-slider-group';
                sliderGroup.innerHTML = `
                    <label>${key}: <span class="attribute-value">${defaultValue}</span></label>
                    <input type="range" class="attribute-slider" data-attribute="${key}" 
                           min="10" max="100" value="${defaultValue}" step="5">
                `;
                slidersContainer.appendChild(sliderGroup);
            }
        });
        
        updateRemainingPoints();
        addSliderEventListeners();
    };
    
    // Update remaining points display
    const updateRemainingPoints = () => {
        if (cheatMode) {
            document.getElementById('remaining-points').textContent = `(作弊模式: 無限制 ∞)`;
            document.getElementById('remaining-points').style.color = '#f59e0b';
        } else {
            const remaining = totalPoints - usedPoints;
            document.getElementById('remaining-points').textContent = `(剩餘點數: ${remaining})`;
            document.getElementById('remaining-points').style.color = remaining < 0 ? 'red' : '';
        }
    };
    
    // Add slider event listeners
    const addSliderEventListeners = () => {
        document.querySelectorAll('.attribute-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const attribute = e.target.dataset.attribute;
                const oldValue = currentAttributes[attribute];
                const newValue = parseInt(e.target.value);
                const difference = newValue - oldValue;
                
                if (cheatMode) {
                    // Cheat mode: unlimited allocation
                    currentAttributes[attribute] = newValue;
                    usedPoints += difference;
                } else {
                    // Normal mode: check if remaining points are exceeded
                    if (usedPoints + difference > totalPoints) {
                        // If exceeded, set to the maximum possible value
                        const maxPossible = oldValue + (totalPoints - usedPoints);
                        e.target.value = maxPossible;
                        currentAttributes[attribute] = maxPossible;
                        usedPoints = totalPoints;
                    } else {
                        currentAttributes[attribute] = newValue;
                        usedPoints += difference;
                    }
                }
                
                // Update display
                e.target.parentElement.querySelector('.attribute-value').textContent = currentAttributes[attribute];
                updateRemainingPoints();
            });
        });
    };
    
    // Reset attributes
    const resetAttributes = () => {
        updateAttributeSliders();
    };

    const loadSettings = () => {
        const settings = Storage.getSettings();
        if (settings) {
            document.getElementById('api-endpoint').value = settings.apiEndpoint;
            document.getElementById('api-key').value = settings.apiKey;
            document.getElementById('api-model').value = settings.model;
            document.getElementById('theme-selector').value = settings.theme || 'dark';
            applyTheme(settings.theme || 'dark');
        }
    };

    const saveSettings = () => {
        const settings = {
            apiEndpoint: document.getElementById('api-endpoint').value,
            apiKey: document.getElementById('api-key').value,
            model: document.getElementById('api-model').value,
            theme: document.getElementById('theme-selector').value
        };
        Storage.saveSettings(settings);
        applyTheme(settings.theme);
        alert('設定已儲存！');
        hideModal(settingsPanel);
    };

    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;
    };

    const startGame = () => {
        const worldType = worldTypeSelect.value;
        const characterDescription = document.getElementById('character-description').value;

        if (!characterDescription) {
            alert('請輸入角色描述！');
            return;
        }
        
        // Check remaining points (skip check in cheat mode)
        if (!cheatMode) {
            const remaining = totalPoints - usedPoints;
            if (remaining < 0) {
                alert('屬性點數超過限制！請重新分配。');
                return;
            }
        }

        Game.start(worldType, characterDescription, currentAttributes);
        
        // Set game started status
        gameStarted = true;
        
        hideModal(characterCreationPanel);
        mainGamePanel.classList.remove('hidden');
    };

    // --- Event Listeners ---
    const addEventListeners = () => {
        // Help panel events
        document.getElementById('open-help-btn').addEventListener('click', () => showModal(document.getElementById('help-panel')));
        document.getElementById('close-help-btn').addEventListener('click', () => hideModal(document.getElementById('help-panel')));
        
        openSettingsBtn.addEventListener('click', () => showModal(settingsPanel));
        closeSettingsBtn.addEventListener('click', () => hideModal(settingsPanel));
        saveSettingsBtn.addEventListener('click', saveSettings);
        startGameBtn.addEventListener('click', startGame);

        // Click overlay to close modal
        overlay.addEventListener('click', hideAllModals);

        // Listen for game loaded event
        window.addEventListener('gameLoaded', () => {
            gameStarted = true;
            hideAllModals();
            mainGamePanel.classList.remove('hidden');
        });

        // Save/Load button events
        document.getElementById('save-to-browser-btn').addEventListener('click', () => Storage.saveToBrowser());
        document.getElementById('save-to-file-btn').addEventListener('click', () => Storage.saveGameToFile());
        document.getElementById('load-from-browser-btn').addEventListener('click', () => Storage.loadFromBrowser());
        document.getElementById('load-from-file-btn').addEventListener('click', () => Storage.loadGameFromFile());
        document.getElementById('reset-attributes-btn').addEventListener('click', resetAttributes);
        
        // Update attribute sliders when world view changes
        worldTypeSelect.addEventListener('change', updateAttributeSliders);
        
        // Cheat mode checkbox event
        document.getElementById('cheat-mode-checkbox').addEventListener('change', (e) => {
            cheatMode = e.target.checked;
            updateRemainingPoints();
            
            // Update the maximum value of the slider
            document.querySelectorAll('.attribute-slider').forEach(slider => {
                if (cheatMode) {
                    slider.max = 999; // Set a very high maximum value in cheat mode
                } else {
                    slider.max = 100; // Limit to 100 in normal mode
                    // If the current value exceeds 100, reset to 100
                    if (parseInt(slider.value) > 100) {
                        slider.value = 100;
                        const attribute = slider.dataset.attribute;
                        const oldValue = currentAttributes[attribute];
                        currentAttributes[attribute] = 100;
                        usedPoints = usedPoints - oldValue + 100;
                        slider.parentElement.querySelector('.attribute-value').textContent = 100;
                    }
                }
            });
            
            updateRemainingPoints();
        });
        document.getElementById('regenerate-btn').addEventListener('click', () => {
            Game.regenerateLastResponse();
        });
        
        document.getElementById('custom-action-btn').addEventListener('click', () => {
            const customAction = document.getElementById('custom-action-input').value;
            if (customAction) {
                Game.handleAction(customAction);
                document.getElementById('custom-action-input').value = '';
            }
        });
        document.getElementById('custom-action-input').addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const customAction = document.getElementById('custom-action-input').value;
                if (customAction) {
                    Game.handleAction(customAction);
                    document.getElementById('custom-action-input').value = '';
                }
            }
        });

        document.getElementById('theme-selector').addEventListener('change', (event) => {
            applyTheme(event.target.value);
        });

        // Drag and drop
        document.body.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        document.body.addEventListener('drop', (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file && file.name.endsWith('.json')) {
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
        });
    };

    // --- Start Application ---
    init();
});
