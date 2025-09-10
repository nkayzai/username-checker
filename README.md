# Username Availability Checker

A modern web application built with Vue.js 3 and Node.js that checks username availability across multiple social media and website platforms.

## Features

### Frontend (Vue.js 3)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Progress**: Animated loading indicators and progress bars
- **Results Display**: Color-coded results (Green=Available, Red=Taken, Yellow=Unknown)
- **Site Logos**: Visual indicators for each platform
- **Download Results**: Export results as JSON
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

### Backend (Node.js/Express)
- **Advanced Detection**: Multi-page checking with fuzzy keyword detection
- **Concurrent Processing**: Checks multiple sites simultaneously for speed
- **Retry Logic**: Automatic retries for failed requests
- **Error Handling**: Comprehensive error handling and logging
- **RESTful API**: Clean API endpoints for frontend integration

### Supported Platforms
- **Social Media**: Twitter, Instagram, TikTok, YouTube, Reddit, Discord, Twitch, Pinterest, Snapchat
- **Professional**: LinkedIn, Medium
- **Development**: GitHub, Dev.to, CodePen, Stack Overflow
- **Creative**: Behance, Dribbble
- **Music**: Spotify, SoundCloud

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd username-checker
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
username-checker/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   └── sites.js        # Platform configurations
│   ├── services/
│   │   └── usernameChecker.js  # Core checking logic
│   ├── package.json
│   └── server.js           # Express server
├── frontend/               # Vue.js 3 frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── composables/    # Vue composables
│   │   ├── App.vue         # Main app component
│   │   └── main.js         # App entry point
│   ├── package.json
│   └── vite.config.js      # Vite configuration
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

### `GET /api/health`
Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Username Checker API is running"
}
```

### `GET /api/sites`
Get list of all supported sites.

**Response:**
```json
[
  {
    "name": "GitHub",
    "url": "https://github.com/{username}",
    "checkType": "http",
    "logo": "https://...",
    "category": "development"
  }
]
```

### `POST /api/check-username`
Check username availability across all platforms.

**Request:**
```json
{
  "username": "example"
}
```

**Response:**
```json
{
  "username": "example",
  "results": [
    {
      "site": "GitHub",
      "url": "https://github.com/example",
      "status": "taken",
      "responseTime": 1234,
      "logo": "https://...",
      "category": "development",
      "details": {
        "statusCode": 200,
        "title": "example (example) · GitHub"
      }
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "totalSites": 20,
  "available": 5,
  "taken": 12,
  "unknown": 3
}
```

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

## Configuration

### Adding New Sites
Edit `backend/config/sites.js` to add new platforms:

```javascript
{
  name: 'NewSite',
  url: 'https://newsite.com/{username}',
  checkType: 'http',
  method: 'GET',
  expectedStatus: 404,
  invertResult: true,
  logo: 'https://newsite.com/logo.png',
  category: 'social'
}
```

### Environment Variables
Create `backend/.env`:
```
PORT=3001
NODE_ENV=development
```

## Advanced Features

### Multi-Page Detection
The checker uses advanced techniques to detect username availability:
- HTTP status code analysis
- Content analysis for false positives
- Fuzzy keyword matching
- Profile image detection

### Concurrency Control
- Configurable concurrent request limits
- Automatic retry with exponential backoff
- Request timeout handling

### Error Handling
- Comprehensive error logging
- Graceful degradation for failed sites
- User-friendly error messages

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### Common Issues

**"Unable to connect to server"**
- Make sure the backend is running on port 3001
- Check if there are any firewall issues

**"Username validation failed"**
- Ensure username is 2-30 characters
- Only use letters, numbers, underscores, and hyphens

**Slow checking**
- Some sites may be slow to respond
- The checker includes retry logic for reliability

### Performance Tips
- The checker processes sites in batches for optimal performance
- Results are cached during the checking process
- Failed sites are marked as "unknown" rather than blocking the entire process

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify backend logs for server issues
