import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000,
});

// ── Text Analysis ──
export async function analyzeText(text) {
    const res = await API.post('/analyze/text', { text });
    return res.data;
}

// ── Image Analysis ──
export async function analyzeImage(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await API.post('/analyze/image', form);
    return res.data;
}

// ── Combined Analysis ──
export async function analyzeCombined(text, file) {
    const form = new FormData();
    if (text) form.append('text', text);
    if (file) form.append('file', file);
    const res = await API.post('/analyze/combined', form);
    return res.data;
}

// ── Report ──
export async function generateReport(textRes, imageRes, graphData) {
    const res = await API.post('/report/', {
        text: textRes,
        image: imageRes,
        graph: graphData,
    });
    return res.data;
}

// ── History (from backend) ──
export async function fetchHistory() {
    const res = await API.get('/history');
    return res.data;
}

export default API;
