import { NextResponse } from 'next/server';

const CATEGORIES = {
    AI: ['ai', 'machine learning', 'gpt', 'neural', 'llm', 'deep learning', 'openai', 'anthropic', 'gemini', 'model', 'artificial intelligence'],
    QUANTUM: ['quantum', 'qubit', 'superposition', 'entanglement'],
    SPACE: ['space', 'nasa', 'spacex', 'satellite', 'orbit', 'mars', 'rocket', 'astronomy'],
    SECURITY: ['hack', 'security', 'vulnerability', 'breach', 'exploit', 'malware', 'ransomware', 'zero-day'],
    BIOTECH: ['crispr', 'gene', 'biotech', 'genome', 'dna', 'protein', 'biology', 'medical'],
    ENERGY: ['solar', 'battery', 'fusion', 'nuclear', 'energy', 'renewable', 'lithium'],
    WEB3: ['crypto', 'blockchain', 'ethereum', 'bitcoin', 'defi', 'nft', 'web3'],
};

function detectCategory(text) {
    const lower = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        if (keywords.some(kw => lower.includes(kw))) return cat;
    }
    return 'TECH';
}

function scoreRelevance(story) {
    // Prioritize by score and recency
    const hourAge = (Date.now() / 1000 - story.time) / 3600;
    return (story.score || 0) / Math.pow(hourAge + 1, 0.8);
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
        // Fetch top AND new stories for diversity
        const [topRes, newRes] = await Promise.all([
            fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { next: { revalidate: 300 } }),
            fetch('https://hacker-news.firebaseio.com/v0/newstories.json', { next: { revalidate: 120 } }),
        ]);

        const [topIds, newIds] = await Promise.all([topRes.json(), newRes.json()]);

        // Mix: 15 top stories + 5 newest
        const ids = [...new Set([...topIds.slice(0, 25), ...newIds.slice(0, 10)])].slice(0, 35);

        const stories = await Promise.allSettled(
            ids.map(id =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { next: { revalidate: 60 } })
                    .then(r => r.json())
            )
        );

        let items = stories
            .filter(r => r.status === 'fulfilled' && r.value?.title)
            .map(r => r.value)
            .filter(s => s.type === 'story' && s.title);

        // If a search query was provided, filter by it
        if (query) {
            items = items.filter(s =>
                s.title.toLowerCase().includes(query) ||
                (s.url || '').toLowerCase().includes(query)
            );
        }

        // Sort by relevance score
        items.sort((a, b) => scoreRelevance(b) - scoreRelevance(a));

        const result = items.slice(0, limit).map(s => ({
            id: s.id,
            title: s.title,
            titleUpper: s.title.toUpperCase(),
            url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
            score: s.score || 0,
            by: s.by || 'ANON',
            comments: s.descendants || 0,
            time: s.time,
            age: Math.round((Date.now() / 1000 - s.time) / 60), // minutes ago
            category: detectCategory(s.title),
        }));

        return NextResponse.json({
            items: result,
            fetchedAt: Date.now(),
            source: 'HACKER NEWS NEURAL UPLINK',
            count: result.length,
        });
    } catch (err) {
        console.error('Tech Brain fetch error:', err);
        return NextResponse.json({
            items: [
                { id: 1, titleUpper: 'QUANTUM UPLINK UNSTABLE', category: 'TECH', score: 0, age: 0 },
                { id: 2, titleUpper: 'REAL-TIME INTELLIGENCE BUFFER OVERRUN', category: 'TECH', score: 0, age: 0 },
            ],
            fetchedAt: Date.now(),
            source: 'FALLBACK',
            count: 2,
        }, { status: 200 }); // Still return 200 with fallback data
    }
}
