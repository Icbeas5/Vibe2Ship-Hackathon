# NOVA // Autonomous Task Control & Proactive Productivity Companion

Nova is an industry-ready, production-grade application engineered for the **Vibe2Ship Hackathon**. It answers the "Last-Minute Life Saver" challenge prompt by implementing an autonomous multi-agent productivity network designed around Google's official `@google/genai` TypeScript SDK and a responsive WebGL 3D Gravitational Canvas dashboard interface.

---

## 🌌 Architectural Design Overview

### 🤖 Multi-Agent Engine Framework
Nova moves beyond traditional static calendar prompts by combining multiple specific sub-agents that act dynamically on user actions:
1. **Strategic Planner Agent (`plannerAgent.ts`)**: When inputting a large objective, this agent uses **Gemini 2.5 Flash** to analyze requirements and output structural breakdowns into sequential actionable checklists.
2. **Critical Assessment Priority Agent (`priorityAgent.ts`)**: Evaluates overall task backlogs against deadline constraints, calculation speeds, and user description weights to assign logical severity ratings (0–100) and priority tiers.
3. **Active Autonomous Action Agent (`actionAgent.ts`)**: Operates inside background cycles to calculate immediate proactive measures (e.g., drafting alerts, scheduling tracking events, dispatching escalation notices via email vectors).
4. **Vocal Processing Unit (`voiceAgent.ts`)**: Uses language mapping to extract intent parameter strings from continuous speech streams dynamically.

### 🎮 Signature 3D Visual Mechanics
- The dashboard replaces uninspiring static lists with a WebGL **3D Task Galaxy** (React Three Fiber + Drei).
- Open items orbit a central **"NOW" Star** core. Orbit radius is calculated logarithmically using hours remaining until deadline pressure.
- As deadlines approach, orbits decay inward and change colors (Cyan → Violet → Yellow → Amber Red), visually depicting temporal priority rules.

---

## 🛠️ Technology Stack Ecosystem

- **Frontend Container UI**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **3D Graphics Layer**: Three.js, React Three Fiber, React Three Drei
- **Backend Architecture Engine**: Node.js, Express, strict TypeScript compiled outputs
- **Artificial Intelligence Core**: Google Cloud GenAI SDK (`@google/genai`), Gemini 2.5 Flash
- **Session Layer/Persistence**: Google Firebase Client + Firebase Admin (Firestore Fallback Node configured)

---

## 🚀 Rapid Development Installation

### 1. Initialize Backend Container Node
```bash
cd backend
npm install
# Configure variables inside your local .env file
npm run dev
```

### 2. Launch Frontend UI Frame
```bash
cd frontend
npm install
npm run dev