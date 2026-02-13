<div align="center">
  <br />
  <br />
  <h1 align="center">SONA<span style="color: #CCFA00;">.</span></h1>
  <p align="center">
    <strong style="font-size: 1.5rem;">SLICE THE CHAOS</strong>
  </p>
  <p align="center">
    The AI Agent that lives in your WhatsApp. Summarizes noise, schedules meetings, and manages tasks.
  </p>

  <br />

  <p align="center">
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://react.dev">
      <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
    <a href="https://fastapi.tiangolo.com">
      <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    </a>
    <a href="https://supabase.com">
      <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    </a>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
  <br />
</div>

## 🚀 What is Sona?

**Sona** is your personal AI operations manager, integrated directly into WhatsApp. It acts as a filter for your digital life, handling the mundane so you can focus on what matters.

Instead of scrolling through 500+ unread messages, Sona gives you a **Smart Summary**. Instead of back-and-forth scheduling emails, Sona **negotiates times** and sends invites. Instead of forgetting tasks mentioned in chat, Sona **captures them instantly**.

## ✨ Features

- **🧠 Smart Summaries**: Wake up to a clean TL;DR of your group chats. Sona reads the noise so you don't have to.
- **⚡ Instant Tasks**: Turn mentions into action items. "@Sona remind me to call mom" becomes a tracked task.
- **📅 Auto Scheduling**: Forget Doodle polls. Sona coordinates availability with everyone and books the meeting.
- **🔗 Integrations**: Connects with Google Calendar, Notion, Jira, and more.

## 🛠️ Tech Stack

### Frontend (`/app`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visuals**: Framer Motion, Three.js (via React Three Fiber & Drei)

### Backend (`/lifeops-ai`)
- **API**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI**: OpenAI GPT-4o
- **Messaging**: WhatsApp Business API

## 🏁 Getting Started

Follow these steps to get Sona running locally.

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **Supabase Account**
- **OpenAI API Key**
- **Meta/WhatsApp Business Account**

### 1. Clone the Repository

```bash
git clone https://github.com/Vikasverma9515/sona.ai.git
cd sona.ai
```

### 2. Frontend Setup

Move into the project root (where `package.json` is) and install dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env` file in the root directory (refer to `.env.example` if available) and add your public env variables.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### 3. Backend Setup

Move into the `lifeops-ai` directory:

```bash
cd lifeops-ai
```

Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `lifeops-ai/` with your secrets:

```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_KEY=...
WHATSAPP_TOKEN=...
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

## 🤝 Contributing

We love contributions! Sona is built by the community, for the community.

Please read our [**Contributing Guide**](CONTRIBUTING.md) to learn how you can get involved. whether it's fixing bugs, suggesting features, or improving documentation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the Sona Team
</div>
