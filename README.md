# AIC Quest - Gamified Growth Platform

**Tagline**: *"Growers vs Showers"* - A gamified engagement platform that drives growth for both the AI Collective community and participating founders/startups through quest completion, referral mechanics, and competitive leaderboards.

Built for the **F1 Hackathon** as an MVP demonstrating how gamification can accelerate community growth and founder success.

## 🌐 Live Demo

**Experience AIC Quest**: [https://f1-aic.vercel.app/](https://f1-aic.vercel.app/)

Try the live platform to explore the gamification mechanics, complete quests, track your growth, and compete on the leaderboards. The demo includes full authentication, quest progression, and social reach tracking functionality.

## 🎯 What is AIC Quest?

AIC Quest is a growth-oriented gamification platform designed to create a **dual-sided growth flywheel**:

- **For AI Collective**: Increases community engagement, member retention, and organic growth through referrals
- **For Founders & Startups**: Provides structured pathways to build their network, increase their reach, and gain visibility within the AIC ecosystem

The platform combines quest-based progression, competitive leaderboards, tiered rewards, and viral referral mechanics to turn community participation into a game that drives real business outcomes.

## 🚀 Key Features

### 🎮 Gamification Core
- **Quest System**: Event-based and general quests with points, deadlines, and auto-acceptance rules
- **Progressive Badges**: Rookie → Contender → Champion progression based on points earned
- **Dual Leaderboards**: "Growers" (quest points + referral impact) vs "Showers" (social reach metrics)
- **Tiered Rewards**: From sticker packs to VIP showcases to the ultimate "Grand Choice" (Waymo with Elon vs Buggy with Sam)

### 📈 Growth Mechanics
- **Referral Tracking**: LinkedIn follower growth tracking with impact points (1 pt per 10 followers gained)
- **Social Reach Calculator**: Weighted scoring across LinkedIn, Twitter, YouTube, and Newsletter subscribers
- **Viral Sharing**: Personalized referral links with attribution tracking
- **Network Effects**: Growth achievements unlock as your referrals gain followers

### 🔗 Social Integration
- **Auth0 Authentication**: Secure user management with social login
- **LinkedIn Integration**: Automated follower tracking via Proxycurl API (optional)
- **Multi-platform Reach**: Track influence across LinkedIn, Twitter, YouTube, newsletters
- **Real-time Updates**: Live follower count refreshing for active profiles

### 📊 Analytics & Insights
- **Progress Tracking**: Persistent quest completion and acceptance state
- **Growth Attribution**: Track which referrals drive the most follower growth
- **Leaderboard Rankings**: Compare performance across the community
- **Achievement Unlocks**: Visual feedback for milestones and growth targets

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS 4** for styling with custom utility classes
- **Zustand** for client-side state management (quest progress, user preferences)
- **React 19** with Suspense for improved loading states

### Backend & Data
- **Vercel KV** (Redis) for production referral tracking and profile storage
- **Local Storage** fallback for development and offline functionality
- **Auth0** for authentication and user management
- **Proxycurl API** for LinkedIn follower data (optional, graceful degradation)

### Key Libraries
- `@auth0/nextjs-auth0` - Authentication
- `@vercel/kv` - Redis storage
- `zustand` - State management
- `@vercel/speed-insights` - Performance monitoring

## 🎯 Gamification Strategy for Growth

### For AI Collective Community Growth

**1. Member Engagement & Retention**
- Quest system drives consistent platform interaction
- Progressive rewards create long-term engagement loops  
- Event-specific quests increase participation in AIC initiatives
- Leaderboards foster competitive community spirit

**2. Organic Growth Through Referrals**
- Members earn impact points for bringing in new users who grow their networks
- Viral coefficient increases as successful members share their referral links
- Attribution tracking ensures credit for community builders
- Growth achievements provide social proof and recognition

**3. Content & Event Amplification**
- Quests drive traffic to AIC events, resources, and initiatives
- Members become active promoters to complete quests and earn points
- Social reach tracking identifies community influencers and amplifiers

### For Founders & Startups Growth

**1. Network Building**
- Referral mechanics incentivize founders to invite other builders and investors
- LinkedIn integration tracks and rewards network expansion
- Community connections facilitate partnerships and collaborations
- Leaderboard visibility increases founder profile within AIC

**2. Social Media Growth**
- Multi-platform reach tracking encourages consistent content creation
- Weighted scoring system rewards newsletter building and YouTube growth
- Progress visualization motivates sustained social media efforts
- Peer comparison drives competitive improvement

**3. Business Development Opportunities**
- High performers gain access to VIP showcases and mentor sessions
- Leaderboard rankings create social proof for investors and partners
- Quest completion demonstrates commitment to community engagement
- Reward tiers provide networking and visibility opportunities

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git for version control

### Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Required | Description |
|----------|----------|------------|
| `AUTH0_SECRET` | ✅ | Random string for Auth0 session encryption |
| `AUTH0_BASE_URL` | ✅ | Your domain (production) or `http://localhost:3000` (dev) |
| `AUTH0_DOMAIN` | ✅ | Your Auth0 domain (e.g., `your-app.us.auth0.com`) |
| `AUTH0_ISSUER_BASE_URL` | ✅ | Full Auth0 issuer URL (https://your-domain.us.auth0.com) |
| `AUTH0_CLIENT_ID` | ✅ | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | ✅ | Auth0 application client secret |
| `KV_REST_API_URL` | ⚠️ | Vercel KV REST API URL (production referral tracking) |
| `KV_REST_API_TOKEN` | ⚠️ | Vercel KV REST API token (production referral tracking) |
| `PROXYCURL_API_KEY` | ❌ | Proxycurl API key for LinkedIn follower tracking |
| `APP_BASE_URL` | ❌ | Fallback base URL for local development |

**Note**: Variables marked ⚠️ are required for production referral tracking. Variables marked ❌ are optional - the app gracefully degrades without them.

### Local Development

```powershell
# Clone the repository
git clone https://github.com/quotentiroler/F1-AIC.git
cd F1-AIC

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env.local
# Edit .env.local with your Auth0 credentials

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build & Deploy

```powershell
# Build for production
npm run build

# Start production server locally
npm start

# Deploy to Vercel (recommended)
npx vercel --prod
```

## 🌐 API Documentation

### Authentication Endpoints
- `GET/POST /api/auth/[...auth0]` - Auth0 authentication handlers
- `GET/POST /auth/[...auth0]` - Auth0 callback routes

### Referral System
- `POST /api/referrals` - Register a new referral with LinkedIn profile
- `GET /api/referrals?referrer={id}` - Get referrals for a specific user

#### POST /api/referrals
Register a new user referral and track their LinkedIn profile.

**Request Body:**
```json
{
  "profileUrl": "https://www.linkedin.com/in/username",
  "referrer": "referrer_id",
  "name": "Display Name",
  "visitorId": "optional_visitor_id"
}
```

**Response:**
```json
{
  "id": "profile_hash",
  "url": "https://www.linkedin.com/in/username", 
  "referrer": "referrer_id",
  "name": "Display Name",
  "status": "active",
  "initialFollowers": 1500,
  "currentFollowers": 1520,
  "joinedAt": 1695942000000
}
```

## 📱 User Journey & Flow

### New User Onboarding
1. **Landing Page**: Eye-catching hero with "Growers vs Showers" theme
2. **Referral Attribution**: URL parameter captures referring user
3. **Auth0 Sign-in**: Quick social authentication
4. **Profile Setup**: Name, LinkedIn profile, and reach metrics input
5. **Quest Discovery**: Browse available quests and join events
6. **First Actions**: Complete initial quests to earn first points and badge

### Engagement Loop
1. **Quest Completion**: Users visit external links and mark quests complete
2. **Points & Progress**: Immediate feedback with points, badges, and leaderboard updates  
3. **Referral Sharing**: Share personalized referral link to earn impact points
4. **Network Growth**: Track LinkedIn follower increases from referrals
5. **Reward Unlocking**: Progress through tiers for increasingly valuable rewards
6. **Community Competition**: Climb leaderboards and achieve growth milestones

## 🎁 Reward System

### Quest Point Tiers
- **50 points**: Sticker Pack - AIC holographic stickers delivered by mail
- **120 points**: Swag Drop - Exclusive AIC t-shirt for community pride
- **220 points**: VIP Showcase - Live pitch session with mentors and founders
- **1,000 points**: Launch Boost - Signal boost from partner accounts + newsletter feature
- **1,000,000,000 points**: Grand Choice - Pick ONE: Waymo ride with Elon Musk OR buggy ride with Sam Altman

### Growth Achievement Badges
- **Connector** (50+ network growth): Recognition for bringing engaged community members
- **Networker** (200+ network growth): Substantial community building contribution
- **Super Connector** (500+ network growth): Elite community growth catalyst

## 🔒 Privacy & Data

### Data Collection
- **Authentication**: Auth0 manages user authentication and basic profile data
- **Quest Progress**: Stored locally in browser with Zustand persistence
- **Referral Tracking**: LinkedIn profiles and follower counts stored in Vercel KV
- **Social Metrics**: User-provided reach data across social platforms

### Privacy Measures
- **Minimal Data**: Only collect data necessary for gamification features
- **User Control**: Users manually input social media metrics and can update anytime
- **Secure Storage**: Production data encrypted in Vercel KV Redis
- **No Tracking**: No cross-site tracking or unnecessary analytics collection

### GDPR Compliance
- Users can request data deletion through profile settings
- Clear data usage explanation in quest descriptions and onboarding
- Optional features (LinkedIn tracking) require explicit consent

## 🛠️ Troubleshooting

### Common Issues

**Build Errors**
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run build
```

**Auth0 Issues**
- Verify all AUTH0_* environment variables are set correctly
- Check that AUTH0_BASE_URL matches your deployment domain
- Ensure Auth0 application callback URLs include your domain

**KV Storage Issues**
- Referral features require KV_REST_API_URL and KV_REST_API_TOKEN in production
- App falls back to local-only storage if KV is unavailable
- Check Vercel dashboard for KV configuration

**LinkedIn Integration**
- PROXYCURL_API_KEY is optional - app works without LinkedIn tracking
- Rate limits may cause temporary follower count update delays
- Verify LinkedIn profile URLs are publicly accessible

### Development Tips
- Use `npm run dev` for hot reloading during development
- Check browser console for client-side errors and state issues
- Use Vercel CLI for easy deployment and environment variable management

## 🗺️ Roadmap & Future Enhancements

### Phase 2: Enhanced Gamification
- **Team Quests**: Collaborative challenges for startup teams and founder groups
- **Seasonal Events**: Limited-time quests with exclusive rewards and themes
- **Achievement System**: Expanded badge categories and rare achievement unlocks
- **Quest Creator**: Allow community members to create and moderate custom quests

### Phase 3: Business Integration
- **Startup Showcases**: Integrated pitch deck presentations for high-performing founders
- **Investor Connections**: Match high-growth founders with relevant investors based on metrics
- **Partnership Tracking**: Measure and reward successful introductions and collaborations
- **Revenue Sharing**: Monetization through premium features and corporate partnerships

### Phase 4: Platform Expansion
- **Mobile Application**: Native iOS/Android apps for on-the-go quest completion
- **API Ecosystem**: Public APIs for third-party integrations and custom applications
- **White Label**: Customizable platform for other communities and organizations
- **AI Recommendations**: Personalized quest suggestions and networking opportunities

---

## 📞 Support & Community

- **GitHub Issues**: Report bugs and request features
- **Community Discord**: Join the AI Collective Discord for real-time support
- **Documentation**: Comprehensive guides and API documentation
- **Feature Requests**: Submit ideas through GitHub Discussions

Built with ❤️ for the F1 Hackathon • Deployed on Vercel • Powered by Next.js

---

*The gamification revolution starts with one quest. Complete your first challenge and join the growth flywheel today.*