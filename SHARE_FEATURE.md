# QR Code Sharing Feature

## Overview
The QR Code Sharing feature allows users to instantly share their typing test results with others through scannable QR codes and social media integrations.

## Features Implemented

### 1. ShareCard Component (`components/ShareCard.tsx`)
A beautiful, animated component featuring:

#### Visual Elements
- **QR Code Generation**: High-quality QR codes using `qrcode.react`
- **Score Card**: Downloadable score card with:
  - Player rank badge with emoji
  - WPM and accuracy stats
  - Max streak display
  - Unixdev branding
  - Tech Summit 2025 footer
  - Glass-morphism design with gradients

#### Sharing Options
- **Copy Link**: One-click URL copying to clipboard
- **Download Card**: Save score card as PNG image using `html2canvas`
- **Share on X (Twitter)**: Pre-formatted tweet with hashtag
- **Share on LinkedIn**: Professional network sharing
- **QR Code**: Scannable code for mobile sharing

### 2. Score Encoding
- Scores are encoded in base64 and added to URL parameters
- Format: `?score=<base64_encoded_json>`
- Decoded automatically when someone visits the shared link
- Shows a beautiful challenge card to motivate others to beat the score

### 3. Integration with ResultScreen
- New "Share & QR Code" button with purple gradient
- Dedicated view for sharing features
- Smooth navigation between results and share card

## User Flow

### Sharing Flow
1. User completes typing test
2. Clicks "Share & QR Code" button
3. Views ShareCard with:
   - Large QR code for scanning
   - Share statistics
   - Multiple sharing options
4. Can:
   - Scan QR code with phone
   - Copy link to clipboard
   - Download score card image
   - Share directly to social media

### Receiving Flow
1. Someone scans QR code or clicks shared link
2. App detects `?score=` parameter
3. Displays beautiful challenge card with scorer's stats
4. "Take the Challenge!" button to start their own test

## Tech Stack
- **QR Code**: `qrcode.react` library
- **Image Export**: `html2canvas` for downloading cards
- **Animations**: Framer Motion for smooth transitions
- **Encoding**: Base64 with Unicode support

## Design Highlights
- Glass-morphism effects throughout
- Gradient backgrounds and borders
- Responsive grid layouts
- Animated buttons with hover effects
- Social media brand colors
- Professional typography

## Perfect for Tech Summit
- **Booth Attraction**: Large QR codes draw attention
- **Viral Potential**: Easy social media sharing with #DevTypeChallenge
- **Branding**: Unixdev logo and "Tech Summit 2025" on every card
- **Mobile-Friendly**: QR codes work instantly with phone cameras
- **Shareable Moments**: Downloadable cards for social proof

## Usage Tips for Summit

1. **Display QR Codes on Screens**: Show leaderboard scores with QR codes
2. **Print Score Cards**: Winners can print their achievements
3. **Social Media Campaign**: Encourage #DevTypeChallenge hashtag
4. **Booth Signage**: "Scan to Challenge Your Team!"
5. **Photo Opportunities**: Share cards make great social media posts

## File Structure
```
components/
├── ShareCard.tsx          # Main sharing component
├── ResultScreen.tsx       # Integrated share button
└── Leaderboard.tsx        # Leaderboard integration

lib/
├── ranks.ts              # Rank calculation
└── developer-quotes.ts   # Fortune cookie messages
```

## Future Enhancements
- Live spectator mode for big screens
- Real-time competition with multiple players
- Custom QR code branding
- Animated score reveals
- Team challenges and group leaderboards
