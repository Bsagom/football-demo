export default async function handler(req, res) {
    const API_KEY = process.env.VITE_FOOTBALL_API_KEY;

    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // URL에서 /api/ 이후의 경로 추출
        const path = req.url.replace('/api/proxy', '');
        const apiUrl = `https://api.football-data.org/v4${path}`;

        console.log('Proxying request to:', apiUrl);

        const response = await fetch(apiUrl, {
            method: req.method,
            headers: {
                'X-Auth-Token': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch from API' });
    }
}
