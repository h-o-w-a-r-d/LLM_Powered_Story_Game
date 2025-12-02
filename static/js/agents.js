class AgentSystem {
    constructor() {
        this.agents = []; // 存儲 {id, name, type, x, y, personality, memory}
    }

    spawnAgent(x, y, biome, worldContext) {
        // 根據地點生成一個 NPC
        const types = ['戰士', '商人', '神諭者', '拾荒者'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const agent = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            type: type,
            name: `${type}-${Math.floor(Math.random()*100)}`,
            personality: "神秘且謹慎", // 這裡理想上應該由 LLM 生成
            memory: []
        };
        this.agents.push(agent);
        return agent;
    }

    getAgentsAt(x, y) {
        return this.agents.filter(a => Math.abs(a.x - x) < 2 && Math.abs(a.y - y) < 2);
    }

    async interact(agent, playerInput, worldContext) {
        // 建構 Prompt 讓 LLM 扮演 NPC
        const prompt = `
        你是 ${agent.name}，一個 ${agent.type}。
        個性：${agent.personality}。
        所在地點：${worldContext}。
        玩家說："${playerInput}"。
        請以角色的語氣簡短回應（不超過 50 字）。
        `;
        
        const response = await API.call(prompt, "你是一個遊戲中的 NPC，請沉浸在角色中。", false);
        agent.memory.push({in: playerInput, out: response});
        return response;
    }
}