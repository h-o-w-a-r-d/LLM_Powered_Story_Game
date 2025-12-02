let noise;
let settings = {};
const CHUNK_SIZE = 64;

// 簡單的偽隨機
function mulberry32(a) { return function() { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; } }

// Perlin Noise 實作 (簡化版)
function createNoise(seed) {
    const rand = mulberry32(seed);
    const p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for(let i=0; i<256; i++) perm[i] = i;
    for(let i=255; i>0; i--) { const j = Math.floor(rand()*(i+1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    for(let i=0; i<512; i++) p[i] = perm[i & 255];
    
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
        const h = hash & 15; const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    return function(x, y, z) {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        const u = fade(x), v = fade(y), w = fade(z);
        const A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;
        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x-1, y, z)),
                            lerp(u, grad(p[AB], x, y-1, z), grad(p[BB], x-1, y-1, z))),
                    lerp(v, lerp(u, grad(p[AA+1], x, y, z-1), grad(p[BA+1], x-1, y, z-1)),
                            lerp(u, grad(p[AB+1], x, y-1, z-1), grad(p[BB+1], x-1, y-1, z-1))));
    };
}

self.onmessage = function(e) {
    const { type, payload } = e.data;
    if (type === 'init') {
        settings = payload.settings;
        noise = createNoise(payload.seed || 12345);
    } else if (type === 'generate') {
        const { chunkX, chunkY } = payload;
        const data = new Float32Array(CHUNK_SIZE * CHUNK_SIZE);
        
        for (let y = 0; y < CHUNK_SIZE; y++) {
            for (let x = 0; x < CHUNK_SIZE; x++) {
                let globalX = chunkX * CHUNK_SIZE + x;
                let globalY = chunkY * CHUNK_SIZE + y;
                
                // 1. 環形地圖邏輯 (Toroidal)
                if (settings.mapType === 'torus') {
                    globalX = (globalX % settings.width + settings.width) % settings.width;
                    globalY = (globalY % settings.height + settings.height) % settings.height;
                }

                // 噪聲計算 (Octaves)
                let amplitude = 1;
                let frequency = settings.scale;
                let value = 0;
                let maxValue = 0;
                for(let i=0; i<settings.octaves; i++) {
                    value += noise(globalX * frequency, globalY * frequency, 0) * amplitude;
                    maxValue += amplitude;
                    amplitude *= settings.persistence;
                    frequency *= settings.lacunarity;
                }
                let normalized = value / maxValue; 
                
                // 2. 大陸/島嶼邏輯 (Island Mask)
                if (settings.mapType === 'island') {
                    // 簡單的徑向遮罩
                    const centerX = settings.width / 2;
                    const centerY = settings.height / 2;
                    const dx = (chunkX * CHUNK_SIZE + x) - centerX;
                    const dy = (chunkY * CHUNK_SIZE + y) - centerY;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    const maxDist = Math.min(settings.width, settings.height) / 2;
                    const mask = 1 - Math.min(1, Math.max(0, distance / maxDist));
                    normalized = (normalized + 1) / 2 * mask; // 歸一化並應用遮罩
                } else {
                    normalized = (normalized + 1) / 2; // 歸一化 0~1
                }

                data[y * CHUNK_SIZE + x] = normalized;
            }
        }
        self.postMessage({ type: 'chunkReady', chunkX, chunkY, data });
    }
};