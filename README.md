# ShortArchitect

An AI tool that repurposes long-form videos into viral short-form content concepts — scripts, hooks, captions, and posting strategy — powered by Gemini 1.5 Pro.

The problem it solves: creators have hours of good long-form content but no bandwidth to extract short-form value from it efficiently. ShortArchitect handles the creative heavy lifting.

We use the following tech stack:
- Google Gemini 1.5 Pro for content analysis and script generation
- TypeScript + React for the interface
- Tailwind CSS for styling

## 🚀 Features

* **Smart Moment Detection:** AI identifies the most engaging segments from long-form content
* **Script Generator:** Rewrites key moments into 15s, 30s, or 60s platform-optimized scripts
* **Hook Generator:** Creates multiple opening lines per clip — the make-or-break first 3 seconds
* **Caption & Hashtag Package:** Platform-specific captions and hashtag sets for each clip
* **Posting Strategy:** Recommends the right platform, format, and timing for each piece of content
* **Batch Output:** Produces 5–10 short-form concepts from a single long video

## Supported Platforms

* Instagram Reels (15–90s vertical)
* YouTube Shorts (≤60s vertical)
* LinkedIn (30–90s landscape or square)
* TikTok (15–60s vertical)

## Setup

```bash
git clone https://github.com/yatinbhalla/ShortArchitect.git
cd ShortArchitect
npm install
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev
```

## Author

Yatin Bhalla
<br>
🛍️ PM & AI builder | Managing retail businesses | PG Product Management @ BITS School of Management
<br>
🔗 [linkedin.com/in/yatin-bhalla-834632238](https://linkedin.com/in/yatin-bhalla-834632238)
