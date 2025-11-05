const UI = {
    // --- DOM Elements ---
    narrativeElement: document.getElementById('narrative'),
    statusBarsElement: document.getElementById('status-bars'),
    inventoryElement: document.getElementById('inventory'),
    skillsElement: document.getElementById('skills'),
    actionButtonsElement: document.getElementById('action-buttons'),
    loadingIndicator: document.getElementById('loading-indicator'),

    // --- Update Functions ---
    clearNarrative: () => {
        UI.narrativeElement.innerHTML = '';
    },

    removeLastNarrative: () => {
        const narrativeSections = UI.narrativeElement.querySelectorAll('.narrative-section');
        if (narrativeSections.length > 0) {
            // Remove the last narrative section
            const lastSection = narrativeSections[narrativeSections.length - 1];
            lastSection.remove();
            
            // If there is a previous section, also remove the separator before it
            const hrs = UI.narrativeElement.querySelectorAll('hr');
            if (hrs.length > 0 && narrativeSections.length > 1) {
                const lastHr = hrs[hrs.length - 1];
                lastHr.remove();
            }
        }
    },

    updateNarrative: (text) => {
        // Ensure text is a string
        if (typeof text !== 'string') {
            console.warn('updateNarrative 收到非字符串參數:', text);
            text = String(text || '故事繼續中...');
        }
        
        if (UI.narrativeElement.innerHTML !== '') {
            const hr = document.createElement('hr');
            UI.narrativeElement.appendChild(hr);
        }
        const narrativeSection = document.createElement('div');
        narrativeSection.className = 'narrative-section fade-in';
        
        // Using innerHTML allows for HTML tags in the narrative from the AI
        // Also, replace newlines with <br> for better formatting
        narrativeSection.innerHTML = text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
        UI.narrativeElement.appendChild(narrativeSection);
        
        // Scroll to the bottom to show the latest content
        UI.narrativeElement.scrollTop = UI.narrativeElement.scrollHeight;
    },

    updateStatus: (status) => {
        UI.statusBarsElement.innerHTML = '';
        for (const key in status) {
            if (typeof status[key] === 'number') { // Only display numeric status as bars
                const statusBar = document.createElement('div');
                statusBar.innerHTML = `<span>${key}:</span> <span>${status[key]}</span>`;
                UI.statusBarsElement.appendChild(statusBar);
            }
        }

        UI.inventoryElement.textContent = status.inventory ? status.inventory.join(', ') : LanguageManager.getText('ui.empty');
        UI.skillsElement.textContent = status.skills ? status.skills.join(', ') : LanguageManager.getText('ui.none');
    },

    updateActions: (actions) => {
        UI.actionButtonsElement.innerHTML = '';
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = action;
            button.addEventListener('click', () => Game.handleAction(action));
            UI.actionButtonsElement.appendChild(button);
        });
    },

    setLoading: (isLoading) => {
        if (isLoading) {
            UI.loadingIndicator.classList.remove('hidden');
        } else {
            UI.loadingIndicator.classList.add('hidden');
        }
    }
};