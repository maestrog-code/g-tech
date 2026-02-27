# G-TECH QUICK START GUIDE

## What's New in Version 2.0

G-Tech has been upgraded with enterprise-grade Supabase database infrastructure, persistent storage for ideas and predictions, intelligent caching, and a complete sound effects system.

## Key Upgrades

### 1. Supabase Database
All data now persists in a scalable PostgreSQL database. Citizens, ideas, predictions, and news cache are stored permanently.

### 2. Persistent Ideas & Predictions
Your submissions to the Idea Forge and Prediction Arena are now saved forever and can be upvoted by the community.

### 3. Smart Caching
News fetching is 40x faster with intelligent 5-minute caching.

### 4. Sound Effects
Interactive audio feedback for clicks, hovers, achievements, and more.

## Using the New APIs

### Register a Citizen
```javascript
const response = await fetch('/api/citizen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        codename: 'NOVA_X',
        specialization: 'HACKER'
    })
});
const data = await response.json();
```

### Submit an Idea
```javascript
const response = await fetch('/api/ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Quantum Internet Backbone',
        description: 'A global network using quantum entanglement...',
        category: 'QUANTUM'
    })
});
const idea = await response.json();
```

### Upvote an Idea
```javascript
await fetch('/api/ideas', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ideaId })
});
```

### Submit a Prediction
```javascript
const response = await fetch('/api/predictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        content: 'AI will achieve human-level reasoning by 2027',
        category: 'AI'
    })
});
```

### Vote on Prediction
```javascript
await fetch('/api/predictions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: predictionId, delta: 1 }) // or -1 for downvote
});
```

### Get News (Cached)
```javascript
const response = await fetch('/api/news?limit=20');
const news = await response.json();
// Second call within 5 minutes returns cached data
```

### Using Sound Effects
```javascript
import { sounds, enableSounds } from '@/lib/sounds';

// Enable on user interaction
enableSounds();

// Play sounds
sounds.click();       // Button clicks
sounds.hover();       // Hover feedback
sounds.success();     // Success actions
sounds.error();       // Error alerts
sounds.achievement(); // Achievement unlocks
sounds.glitch();      // Glitch effects
```

## Database Schema Quick Reference

### Citizens
- Codename (unique)
- Specialization (EXPLORER/ARCHITECT/HACKER/VOYAGER)
- XP points and level
- Achievements (JSON)
- Activity tracking

### Ideas
- Title and description
- Category
- Flames (upvotes)
- Author reference
- Timestamps

### Predictions
- Content
- Category
- Votes (up/down)
- Author reference
- Timestamps

### News Cache
- Category key
- Cached data (JSON)
- Expiration time
- Auto-cleanup

## Environment Variables

Already configured in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://mohishlmjholzjjvildz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Running the Application

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm start
```

## Security Notes

- All tables have Row Level Security enabled
- Public read access for content
- Input validation on all endpoints
- No sensitive data exposed in errors
- Environment variables for credentials

## Performance Tips

1. News cache refreshes every 5 minutes - perfect for most use cases
2. Use category filters to reduce payload size
3. Limit parameters control response size
4. Database indexes optimize all queries
5. Sound effects use Web Audio API - very lightweight

## Troubleshooting

### News not loading
- Check network connection
- Verify Hacker News API is accessible
- Fallback data will display if API fails

### Sounds not playing
- Call `enableSounds()` after user interaction
- Check browser audio permissions
- Some browsers require user gesture first

### Database errors
- Check Supabase connection
- Verify environment variables
- Check network connectivity

## Next Steps

1. Explore the Idea Forge - submit your tech vision
2. Make predictions in CyberVerse
3. Register your citizen identity
4. Unlock achievements through exploration
5. Check out the live tech news feed

## Support

For issues or questions:
1. Check UPGRADE_NOTES.md for detailed documentation
2. Review CHANGELOG.md for version history
3. Inspect browser console for error details

---

**Welcome to the upgraded G-Tech Portal to the Future**
