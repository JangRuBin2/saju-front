# Epic Fortune - Complete Project Overview

> A modern web service for East Asian fortune-telling (Four Pillars of Destiny / Saju) powered by AI interpretation.

---

## Table of Contents

1. [Product Vision & Concept](#1-product-vision--concept)
2. [Target Audience](#2-target-audience)
3. [Design System: "Midnight Bookshop"](#3-design-system-midnight-bookshop)
4. [Content & Reading Types](#4-content--reading-types)
5. [Revenue Model](#5-revenue-model)
6. [User Journey](#6-user-journey)
7. [Feature Inventory](#7-feature-inventory)
8. [Saju Analysis Engine (How It Works)](#8-saju-analysis-engine-how-it-works)
9. [AI Interpretation Layer](#9-ai-interpretation-layer)
10. [Celebrity Database & Social Features](#10-celebrity-database--social-features)
11. [Internationalization](#11-internationalization)
12. [System Architecture Overview](#12-system-architecture-overview)
13. [Current Status & What's Next](#13-current-status--whats-next)

---

## 1. Product Vision & Concept

**Epic Fortune** is a premium digital fortune-telling platform that brings the ancient East Asian practice of **Saju (Four Pillars of Destiny / 사주팔자)** into the modern web era. The product combines:

- **Traditional Saju calculation** based on authentic lunar calendar algorithms (deterministic, rules-based)
- **AI-powered personalized interpretation** using Anthropic's Claude LLM (natural language, nuanced, constructive)

**Core Value Proposition**: Unlike generic horoscope apps, Epic Fortune provides deep, personalized destiny analysis rooted in millennia of East Asian philosophy - delivered instantly through a beautiful, immersive digital experience.

**Brand Identity**: "Epic Fortune" - evoking grandeur and destiny, appealing to both tradition-minded and modern users across East Asia and beyond.

---

## 2. Target Audience

| Segment | Description | Key Needs |
|---------|-------------|-----------|
| **Primary** | Korean users (20-40s) interested in fortune/destiny | Korean-language, Kakao/Naver login, familiar UX |
| **Secondary** | Japanese & Chinese users | Native language support (ja, zh), cultural familiarity with saju concepts |
| **Tertiary** | English-speaking users globally | English localization, Google login, accessible explanations |
| **K-pop fans** | International fans curious about celebrity compatibility | Celebrity database, entertainment-oriented analysis |

**User Motivation Profiles**:
- **Curiosity seekers**: "What does my birth chart say about me?"
- **Decision makers**: "Is this a good month to change careers?"
- **Relationship seekers**: "Am I compatible with this person?"
- **Daily ritual users**: "What should I watch out for today?"
- **Entertainment users**: "What's my compatibility with my favorite idol?"

---

## 3. Design System: "Midnight Bookshop"

The entire visual identity is built around the concept of a **mystical midnight bookshop** - a dark, intimate space where ancient wisdom is revealed under golden lamplight.

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background (deep) | Midnight navy | `#0a0e1a` |
| Background (mid) | Dark indigo | `#161628` |
| Background (surface) | Muted purple | `#1e1e38` |
| Primary accent | Gold | `#d4a012` |
| Primary highlight | Bright gold | `#f5c526` |
| Warm accent | Amber | `#fbbf24` |
| Mystic accent | Purple | `#6b3fa0` |

### Typography

| Usage | Font | Character |
|-------|------|-----------|
| Body text | Pretendard + Noto Sans KR | Clean, modern readability |
| Headings | Noto Serif KR + Georgia | Classical, authoritative elegance |

### Visual Effects & Animations

- **StarField**: Animated twinkling star background across pages
- **Gold gradient text**: Shimmering gold effect on key headings
- **Glow effects**: Soft gold border glows on interactive elements
- **LoadingBook**: Custom book page-turning animation during loading states
- **Float animation**: 6-second gentle floating motion for decorative elements
- **Shimmer effect**: 2-second shimmer on gold accents

### Custom UI Component Suite ("Gold Components")

All form elements and containers follow the gold-on-midnight theme:
- **GoldButton**: Primary (gold gradient fill), Secondary (gold border outline), Ghost (transparent)
- **GoldCard**: Default, Interactive (hover lift), Highlight (glow border) - with backdrop blur
- **GoldInput**, **GoldSelect**, **GoldToggle**: Themed form controls
- **GoldFrame**: Decorative icon containers with ornamental borders

### Design Mood

The overall experience feels like consulting an ancient fortune-teller in a candlelit study - mysterious yet trustworthy, luxurious yet accessible. Dark backgrounds ensure content readability while gold accents convey premium quality.

---

## 4. Content & Reading Types

Epic Fortune offers **15+ distinct reading types** organized into tiers:

### Core Readings

| Reading | Description | Input Required | Output |
|---------|-------------|----------------|--------|
| **Saju Reading (사주풀이)** | Complete Four Pillars personality & destiny analysis | Birth date/time, gender | Four pillars chart, five elements distribution, yin-yang balance, day master analysis, major life periods, AI interpretation |
| **Daily Fortune (오늘의 운세)** | Today's fortune across 5 life areas | Birth data | Overall luck, money, love, health, career + lucky color & number |
| **Monthly Fortune (월간 운세)** | Month-ahead forecast tied to that month's energy | Birth data + target month | Monthly energy analysis, opportunities, cautions |
| **Compatibility (궁합)** | Two-person harmony analysis | Two people's birth data | Both saju charts + compatibility score + detailed harmony/conflict analysis |
| **Sinsal Analysis (신살 분석)** | Advanced auspicious/inauspicious spirit analysis | Birth data | Detailed analysis of spiritual influences on destiny |

### Relationship Readings

The same person's saju analyzed through different relational lenses:

| Reading | Context |
|---------|---------|
| **Lover Reading** | Romantic relationship dynamics & advice |
| **Boss Reading** | Workplace superior relationship guidance |
| **Child Reading** | Parenting insights & child development |
| **Friend Reading** | Friendship dynamics & compatibility |

### Timing & Decision Readings

| Reading | Purpose |
|---------|---------|
| **Timing Now** | Real-time fortune for the current hour |
| **Best Hours** | Analyzes all 12 traditional time periods for a target date - recommends optimal timing |
| **D-Day Analysis** | Special date analysis (exam, interview, wedding, etc.) |

### Situation Readings

| Reading | Focus |
|---------|-------|
| **Career Change** | Should I change jobs? Analysis of timing & suitability |
| **Wealth Flow** | Financial fortune & money management insights |
| **Hidden Talent** | Undiscovered strengths based on saju chart |
| **Past Life** | Past life interpretation (entertainment/spiritual) |

### Celebrity Compatibility

- Database of **60+ K-pop celebrities** (aespa, BLACKPINK, BTS, NewJeans, IVE, SEVENTEEN, Stray Kids, etc.)
- Users can check their saju compatibility with their favorite idols
- Entertainment-focused analysis with clear disclaimer

### Daily Fortune Categories (5 Areas)

Each daily fortune covers:
1. **Overall Luck (종합운)** - General energy of the day
2. **Money Luck (금전운)** - Financial opportunities & cautions
3. **Love Luck (애정운)** - Romantic & relationship energy
4. **Health Luck (건강운)** - Physical & mental wellbeing
5. **Career Luck (직장운)** - Work & professional matters
6. **Lucky Color** - Color of the day (with animated visual)
7. **Lucky Number** - Deterministically generated
8. **Daily Advice** - AI-generated personalized guidance

---

## 5. Revenue Model

### Model: Per-Service Ticket Purchase (Pay-As-You-Go)

> Recently migrated from a subscription model to a ticket-based model for better conversion.

### Tier Structure

**Free Tier** (no login required for basic access, login required for usage):
- 1 free use per day per service type
- Access to: Saju Reading, Daily Fortune, Compatibility
- No access to: Monthly Fortune, Sinsal Analysis, advanced readings

**Paid Tickets** (one-time purchase per reading):

| Tier | Price Range (KRW) | Readings Included |
|------|-------------------|-------------------|
| **Standard** | ~1,100 KRW (~$0.80 USD) | Saju Reading, Daily Fortune |
| **Premium** | 1,100-3,300 KRW (~$0.80-2.40 USD) | Monthly Fortune, Compatibility |
| **Deluxe** | 3,300+ KRW (~$2.40+ USD) | Sinsal Analysis, advanced readings |

### Payment Flow

1. User selects reading type on payment page
2. Sees available reading types with prices and descriptions
3. Payment processed via **TossPayments** (Korea's leading payment gateway)
4. Supported methods: Credit/Debit Card, Kakao Pay, Naver Pay
5. Ticket is issued upon successful payment
6. Ticket is consumed when the user accesses the reading
7. Unused tickets are visible in "My Tickets" page

### Revenue Optimization Opportunities

- **Bundle packages**: Buy 5 tickets for the price of 4
- **Monthly pass**: Unlimited access for a monthly fee (potential future model)
- **Gift tickets**: Purchase tickets for others
- **Premium content expansion**: New reading types as revenue drivers

---

## 6. User Journey

### First-Time User Flow

```
Landing Page (/)
  |-- Sees feature cards: Saju, Daily Fortune, Compatibility, Monthly
  |-- Dark & gold "Midnight Bookshop" atmosphere creates intrigue
  |
  v
Selects a Reading (e.g., /saju)
  |-- Fills in birth data: Year, Month, Day, Hour, Minute, Gender, Calendar Type
  |-- Submits form
  |
  v
Usage Gate Check
  |-- If not logged in → Prompted to log in
  |-- If logged in + has free use remaining → Proceeds
  |-- If logged in + no free use → Prompted to purchase ticket
  |
  v
Result Page (/saju/result)
  |-- Four Pillars chart displayed immediately (calculation is instant)
  |-- AI interpretation streams in real-time (SSE) - feels like a fortune teller speaking
  |-- Five elements chart, yin-yang balance, major life periods shown
  |
  v
Engagement Hooks
  |-- "Check today's fortune" → Daily Fortune
  |-- "Check compatibility" → Compatibility reading
  |-- "Save to dashboard" → Login prompt if not logged in
```

### Returning User Flow

```
Login via Social Auth (Kakao / Naver / Google)
  |
  v
Dashboard (/dashboard)
  |-- Welcome message with name
  |-- Today's fortune quick summary (5 categories)
  |-- Quick action buttons for all reading types
  |-- Premium upsell banner (if free tier)
  |-- Recent activity feed
  |
  v
My Page (/mypage)
  |-- Profile: Edit birth data (saved for quick access)
  |-- Payment History: All past transactions
  |-- My Tickets: Unused tickets ready to use
  |-- Account: Delete account option (GDPR compliant)
```

### Authentication Methods

| Provider | Primary Market | Button Design |
|----------|---------------|---------------|
| **Kakao** | Korea | Official Kakao yellow button |
| **Naver** | Korea | Official Naver green button |
| **Google** | Global | Official Google white button |

All three follow each platform's official design guidelines for trust and familiarity.

---

## 7. Feature Inventory

### Pages & Routes

| Page | Path | Description | Auth Required |
|------|------|-------------|---------------|
| Home | `/` | Landing page with feature grid | No |
| Saju Input | `/saju` | Birth data form | No (for form), Yes (for result) |
| Saju Result | `/saju/result` | Four Pillars + AI interpretation | Yes |
| Daily Fortune | `/today` | Today's fortune (5 categories) | Yes |
| Compatibility | `/compatibility` | Two-person input + results | Yes |
| Dashboard | `/dashboard` | User home with quick actions | Yes |
| Payment | `/payment` | Ticket purchase page | Yes |
| Payment Success | `/payment/success` | Post-purchase confirmation | Yes |
| Payment Fail | `/payment/fail` | Payment error page | Yes |
| My Page | `/mypage` | Account overview | Yes |
| Profile | `/mypage/profile` | Birth data editor | Yes |
| Payment History | `/mypage/payments` | Transaction history | Yes |
| My Tickets | `/mypage/tickets` | Unused ticket list | Yes |
| Login | `/login` | Social login buttons | No |

All routes are prefixed with `/{locale}` (e.g., `/ko/saju`, `/en/today`).

### Key User-Facing Features

- **Real-time streaming interpretation**: AI text appears word-by-word, creating an engaging "fortune teller speaking" experience
- **Four Pillars visualization**: Beautiful chart showing year/month/day/time pillars with stems & branches
- **Five Elements chart**: Visual distribution of Wood/Fire/Earth/Metal/Water in user's chart
- **Mobile-first responsive design**: Bottom navigation on mobile, full header on desktop
- **Dark mode native**: The entire app is dark-themed (no light mode needed)
- **Deterministic daily fortune**: Same input on same day always produces same result (no randomness confusion)
- **Multi-language switching**: Seamless locale switching preserving current page

---

## 8. Saju Analysis Engine (How It Works)

### What is Saju (Four Pillars of Destiny)?

Saju (사주 / 四柱) is a traditional East Asian fortune-telling system based on the exact time of birth. It analyzes the cosmic energy present at the moment of birth using:

- **Four Pillars**: Year, Month, Day, and Time of birth
- **Eight Characters**: Each pillar has two characters (Heavenly Stem + Earthly Branch)
- **Five Elements**: Wood (木), Fire (火), Earth (土), Metal (金), Water (水)
- **Yin-Yang Balance**: Every element has yin and yang forms

### Calculation Components

| Component | Description |
|-----------|-------------|
| **Heavenly Stems (천간)** | 10 stems: 甲乙丙丁戊己庚辛壬癸 - representing cosmic energy |
| **Earthly Branches (지지)** | 12 branches: 子丑寅卯辰巳午未申酉戌亥 - representing earthly energy |
| **Day Master (일간)** | The stem of the day pillar - represents the self |
| **Ten Gods (십신)** | 10 relational energies between elements (wealth, power, creativity, etc.) |
| **Twelve Fate Positions (12운성)** | Life cycle stages (birth, growth, peak, decline, etc.) |
| **Hidden Stems (지장간)** | Stems hidden within each branch |
| **Major Life Periods (대운)** | 10-year luck cycles throughout life |
| **Tai Yuan (태원)** | Conception pillar |
| **Ming Gong (명궁)** | Destiny palace |
| **Shen Gong (신궁)** | Body palace |
| **Na-Yin (납음)** | Sound/resonance element system |

### Special Calculation Features

- **Night Zi Handling (야자시)**: The 23:00-01:00 hour is ambiguous in traditional saju. Users can choose which interpretation method to use.
- **True Solar Time**: Optional adjustment for geographic longitude (Seoul-based correction)
- **Korean Summer Time**: Historical DST correction for births between 1948-1961
- **Lunar Calendar**: Full solar-to-lunar and lunar-to-solar conversion with leap month support
- **Unknown Birth Time**: Three-pillar analysis when birth hour is unavailable

---

## 9. AI Interpretation Layer

### How Interpretations Are Generated

1. The saju calculation engine produces a structured data result (deterministic, rules-based)
2. This structured data is formatted into a detailed prompt
3. The prompt is sent to **Claude AI** (Anthropic) with a specialized system prompt
4. The AI generates a natural language interpretation
5. The interpretation is **streamed in real-time** to the user via Server-Sent Events (SSE)

### AI Interpretation Guidelines

The AI acts as a "30-year saju analysis expert" with strict guidelines:

**Principles**:
- Day Master (日干) is the center of all analysis
- Five Elements balance is key to understanding strengths/weaknesses
- Always constructive framing - no fear-inducing extreme language
- Practical, actionable advice

**Forbidden**:
- Specific date predictions ("You will get married on March 15")
- Medical or legal advice
- Non-existent saju theories
- Extreme negative predictions

**Quality Control**:
- Premium readings use Claude Sonnet (higher quality, deeper analysis)
- Standard readings use Claude Haiku (faster, more cost-efficient)
- All readings cached for performance (1 hour for interpretations)

### 15+ Specialized Prompt Templates

Each reading type has a unique prompt template that guides the AI to focus on relevant aspects:
- Saju Reading: comprehensive personality, career, relationships, life path
- Compatibility: harmony points, conflict areas, communication advice
- Daily Fortune: practical daily guidance across 5 life areas
- Career Change: timing analysis, suitability assessment
- Celebrity Compatibility: fun, entertainment-focused with disclaimer
- And more...

---

## 10. Celebrity Database & Social Features

### Celebrity Compatibility Feature

A unique, engagement-driving feature where users can check their saju compatibility with **60+ K-pop celebrities**.

**Available Groups & Members**:

| Group | Members |
|-------|---------|
| **aespa** | Karina, Giselle, Winter, Ningning |
| **BLACKPINK** | Jisoo, Jennie, Rose, Lisa |
| **BTS** | RM, Jin, Suga, J-Hope, Jimin, V, Jungkook |
| **NewJeans** | Minji, Hanni, Danielle, Haerin, Hyein |
| **IVE** | Yujin, Gaeul, Rei, Wonyoung, Liz, Leeseo |
| **SEVENTEEN** | S.Coups, Jeonghan, Joshua, Jun, Hoshi, Wonwoo, Woozi, DK, Mingyu, The8, Seungkwan, Vernon, Dino |
| **Stray Kids** | Bang Chan, Lee Know, Changbin, Hyunjin, Han, Felix, Seungmin, I.N |

**Note**: Only publicly available birth dates are used. Birth times are not available for celebrities, so analysis uses three-pillar method.

### Social/Viral Potential

- Celebrity compatibility results are highly shareable on social media
- "Check your compatibility with [idol name]" is a natural viral hook
- K-pop fan communities are highly engaged and share fortune-related content

---

## 11. Internationalization

### Supported Languages

| Language | Code | Primary Market | Login Providers |
|----------|------|----------------|-----------------|
| **Korean** | ko | South Korea | Kakao, Naver, Google |
| **English** | en | Global | Google |
| **Japanese** | ja | Japan | Google |
| **Chinese** | zh | China, Taiwan, SE Asia | Google |

### Localized Content

All user-facing text is fully translated across 4 languages:
- Navigation & UI labels
- Saju form labels & validation messages
- Reading results & interpretation instructions
- Payment page, FAQs, terms
- Error messages & loading states
- Dashboard & My Page content

### AI Response Language

The AI interpretation engine automatically generates responses in the user's selected language. A language instruction is prepended to all prompts for non-Korean users.

---

## 12. System Architecture Overview

### High-Level System Design

```
[User's Browser]
     |
     | HTTPS
     v
[Next.js Frontend + BFF Layer]          <-- "Epic Fortune" web app
  - Server-side rendering (App Router)
  - Social authentication (Kakao/Naver/Google)
  - Payment processing (TossPayments)
  - Usage/ticket management
  - API proxy with HMAC signing
     |
     | HMAC-signed HTTP requests
     v
[FastAPI Backend]                        <-- Saju calculation + AI engine
  - Saju calculation engine (rules-based)
  - Claude AI interpretation (streaming)
  - Redis caching
  - Celebrity database
     |
     | API calls
     v
[Anthropic Claude API]                   <-- AI interpretation generation
```

### Key Design Decisions

1. **BFF Pattern**: The browser never directly accesses the Python API. All requests go through Next.js, which adds authentication, ticket validation, and HMAC-signed service tokens.

2. **Calculation-Interpretation Split**: Saju calculation is purely deterministic (no AI involved). AI is only used for natural language interpretation of the calculated results. This ensures accuracy and consistency.

3. **Streaming Experience**: Interpretations are streamed via Server-Sent Events, creating a real-time "fortune teller speaking" experience rather than a static page load.

4. **Ownership Split**:
   - Next.js owns: Authentication, payments, user profiles, usage limits, UI
   - Python API owns: Saju calculation, AI interpretation, celebrity data, caching

### Database (PostgreSQL via Prisma)

| Table | Purpose |
|-------|---------|
| User | OAuth user accounts |
| Account | OAuth provider credentials |
| Session | Active sessions |
| UserProfile | Birth data (year, month, day, hour, minute, gender, calendar type) |
| Payment | Ticket purchases (orderId, amount, status, readingType) |
| ReadingType | Available reading types (code, name, price, endpoint, isActive) |

---

## 13. Current Status & What's Next

### Completion Status: ~95% Code Complete

**Fully Implemented**:
- All 13+ pages with full UI/UX
- 3 OAuth providers (Kakao, Naver, Google) with official button designs
- Complete database schema (7 tables)
- BFF API layer with server actions + SSE streaming
- TossPayments integration with full payment flow
- Ticket-based usage system (free tier + paid tickets)
- 4-language internationalization (ko, en, ja, zh)
- 40+ custom Gold-themed UI components
- Error handling & form validation
- SEO (metadata, robots.txt, sitemap.xml)
- Account deletion (GDPR compliant)
- Payment history & ticket management
- Mobile-responsive design with bottom navigation
- Backend API with 15+ reading types, 7 routers, caching, streaming

**Awaiting Infrastructure Setup**:
- PostgreSQL database provisioning
- OAuth app registration (Kakao Dev, Naver Dev, Google Cloud)
- TossPayments merchant API keys
- Redis instance for API caching
- Domain & SSL setup
- Production deployment (likely Vercel for frontend, cloud VM for API)

### Enhancement Opportunities

| Area | Opportunity | Impact |
|------|-------------|--------|
| **Content** | Add more reading types (annual fortune, feng shui, naming analysis) | More revenue streams |
| **Social** | Share results on social media, friend referral system | Viral growth |
| **Engagement** | Push notifications for daily fortune, streak rewards | Retention |
| **Monetization** | Ticket bundles, monthly pass, gift tickets | Higher ARPU |
| **Celebrity** | Expand beyond K-pop (actors, athletes, historical figures) | Broader audience |
| **Personalization** | Saved reading history, trend analysis over time | Deeper engagement |
| **Community** | User forums, reading discussions, expert Q&A | Stickiness |
| **Gamification** | Fortune accuracy tracking, daily streaks, badges | Daily active users |
| **B2B** | API access for third-party fortune apps | New revenue channel |
| **AI Enhancement** | More detailed prompts, image generation for results | Premium differentiation |

---

*Document prepared for GenSpark project enhancement planning. March 2026.*
