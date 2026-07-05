# 🎙️ Kiro-AI  
**Your Personal Voice-Based Study Assistant**

Kiro-AI is a smart, voice-controlled study assistant designed to help students learn faster, stay organised, and get instant answers using natural voice commands.  
Whether it's taking notes, creating reminders, solving doubts, or explaining concepts, **Kiro-AI makes studying simple and interactive.**

---

## 🚀 Features

- 🎤 **Voice Commands** — Talk to Kiro-AI to ask questions or give tasks  
- 📝 **Smart Note-Taking** — Automatically save study notes  
- 🧠 **Instant Answers** — Ask doubts and get explanations  
- 🗓️ **Reminders & Timers** — Stay on track during study sessions  
- 🎯 **Focus Mode** — Guided study sessions with timers  
- 📚 **Subject-Wise Help** — Math, science, coding, and more  
- 🌐 **Cross-Platform** — Works on web / desktop (your implementation here)

---

## 🔧 Tech Stack

- Vite + TypeScript + Tailwind CSS
- Web Speech API for STT/TTS
- Murf-AI / Gemini / OpenAI for AI responses
- Supabase for notes & user data
- Node.js (optional) for API routing
- Secure environment variables via .env + gitignore

---

## 📂 Project Structure

```
User (Voice) 
   ↓
Voice Engine (STT/TTS)
   ↓
Command Parser
   ↓
API Request Builder
   ↓
 ┌───────────────────────┐
 │   AI Provider (Murf)  │
 └───────────────────────┘
   ↓
AI Response
   ↓
UI Renderer (src components)
   ↓
Supabase Storage (notes, user data)
```



---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/prangaik-41/kiro-ai-study-buddy
cd Kiro-AI
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Add Your API Keys  
Create a file:
```
.env
```
Inside it:
```
API_KEY=your_api_key_here
```

### 4️⃣ Run the App
```bash
npm run dev
```

---

## 🗣️ Usage Guide  
- Start Kiro-AI  
- Allow **microphone access**  
- Say commands like:  
  - “Take a note”  
  - “Explain photosynthesis”  
  - “Set a study timer for 25 minutes”  
  - “What is Newton’s second law?”  
  - “Remind me to revise math at 7 PM”  

---

## 📸 Screenshots  

<p align="center">
  <img src="ChatGPT Image Dec 4, 2025, 11_00_34 PM.png" alt="Kiro-AI Banner" width="50%">
</p>
<p align="center">
  <img src="Screenshot 2025-12-04 223054.png" alt="Demo" width="100%">
</p>
---

## 🛣️ Roadmap  
- [ ] Add offline mode  
- [ ] Add personalized student profiles  
- [ ] Add subject-wise AI tutoring  
- [ ] Add emotion detection for stress tracking  
- [ ] Mobile app version  
- [ ] Chrome extension  

---

## 🤝 Contributing  
Contributions, issues, and feature requests are welcome!  
Feel free to open a PR or issue.

---

## 📄 License  
This project is licensed under the **MIT License** — free for everyone to use and improve.

---

## 💙 Credits  
Developed with passion by **Pranav Gaikwad** & **Sanchali Torpe**.  
Kiro-AI — *Designed to make learning smarter.*

## Authors

- [@Pranav Gaikwad](https://github.com/prangaik-41)
- [@Sanchali Torpe](https://github.com/sanchalitorpe-source)

