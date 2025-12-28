# Token Discovery Hub

A high-performance, real-time token market dashboard inspired by modern crypto trading platforms.

## 🔗 Live Demo
👉 https://pulse-token-discovery-hub.vercel.app/

## 🎥 Demo Video
👉 https://youtube.com/YOUR_VIDEO_LINK

## 🚀 Features

- Real-time token price updates (WebSocket mock)
- Token categories:
  - New Pairs
  - Final Stretch
  - Migrated
- Interactive data table
  - Sorting
  - Hover states
  - Tooltips & popovers
  - Modal-based details view
- Smooth price-change color transitions
- Loading states:
  - Skeleton loaders
  - Shimmer effects
  - Error boundaries
- Fully responsive (320px → desktop)
- Pixel-perfect UI aligned with production trading platforms

## 🧠 Technical Architecture

- **Frontend**: React + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query
- **Real-time Updates**: Mock WebSocket server
- **Error Handling**: Global error boundaries
- **Performance**:
  - Memoized components
  - No layout shifts
  - <100ms interactions

## 📁 Project Structure
src/
├─ components/
│ ├─ trading/
│ └─ ui/
├─ hooks/
├─ services/
├─ store/
├─ types/
├─ pages/
└─ lib/


## 🛠️ Local Setup

```bash
git clone https://github.com/Ayan113/Pulse-Token-discovery-hub
cd token-discovery-hub
npm install
npm run dev

📈 Performance

Lighthouse score ≥ 90 (mobile & desktop)

No CLS

Optimized re-renders

📌 Notes

This project was built with a focus on:

Clean architecture

Reusability

Production-grade UI quality

Recruiter-ready code standards
