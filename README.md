# Mety — Frontend (Mocked)

AI-powered video conferencing frontend built with React, TailwindCSS, and shadcn-style primitives. This project implements a production-ready UI with mocked in-memory logic only. No real backend calls are made.

## Tech Stack
- React + Vite (dev server)
- TailwindCSS for styling
- shadcn/ui style primitives (Button, etc.)
- Lucide icons
- TypeScript for utils, hooks, and components
- Spline 3D hero cover on the dashboard

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Start the dev server
```bash
npm run dev
```

3. Open the app
- The app runs on http://localhost:3000

## Project Structure
- components/: Reusable UI like Button, ParticipantCard, MessageBubble
- pages/: Dashboard and Meeting Room
- hooks/: Reusable hooks (e.g., toast system)
- utils/: Mock API with in-memory stores (mockApi.ts)

## Mock Core Logic
All core features are mocked in `utils/mockApi.ts`:
- Meetings: create/list
- Participants: join/leave, toggle mic/cam
- Chat: list/send
- Files: upload/list/download placeholder
- Captions & AI: streamCaption, translate, summarize
- Recording: start/stop (returns fake IDs and URLs)

Replace these with real services later. Each function includes types and comments.

## Developer Notes
- The UI is responsive and uses accessible form controls and ARIA labels where appropriate.
- Inputs are sanitized in the mock API to strip angle brackets.
- For toasts/notifications, `hooks/useToast.ts` provides a lightweight system; integrate a full toast system or shadcn/ui toasts as needed.
- Heavy components (Spline) are lazy-loaded.
- Replace the placeholder video canvas in the meeting room with your WebRTC implementation. Buttons already wire up mic/cam toggles against the mock API.
- Chat, files, and captions are front-end state only; refreshing the page clears them.

## Replacing Mock with Real Backend
- Swap `utils/mockApi.ts` functions to call your backend endpoints.
- Use proper request/response DTOs and error handling.
- Plug in WebSocket or WebRTC signaling for real-time updates.

## Acceptance Checklist
- npm install → npm run dev works without errors
- Creating meetings, sending chat messages, uploading files (placeholder), captions ticking, and recording toggles all work
- Code is readable, commented, and typed where relevant

