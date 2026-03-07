# DJ Charle$ Website

## Local Development

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy env file and fill in values:
   ```bash
   cp .env.local.example .env.local
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Adding Content

### Videos
Edit `data/videos.json`. Add an entry with the YouTube video ID:
```json
{ "id": "4", "title": "Your Event", "location": "Oslo", "date": "2026-01-01", "category": "Club", "youtubeId": "YOUR_YOUTUBE_ID" }
```
Categories: `Club`, `Private`, `Festival`, `Other`

### Mixes
Edit `data/mixes.json`. Paste the SoundCloud or YouTube embed URL:
```json
{ "id": "4", "title": "Mix Title", "date": "2026-01-01", "duration": "1:00:00", "platform": "soundcloud", "embedUrl": "https://w.soundcloud.com/player/?url=..." }
```

### Gallery
1. Add photos to `public/images/gallery/`
2. Edit `data/gallery.json` with the filename and metadata

## Deploying to Vercel

1. Push the repo to GitHub
2. Import into Vercel
3. Add a Vercel KV store (Storage → Create → KV)
4. Set all environment variables from `.env.local.example`
5. Deploy

## Admin Dashboard

Visit `/admin/login` and enter the `ADMIN_PASSWORD` you set.
