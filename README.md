# 🚀 Resume Matcher Pro

## Live Demo
👉 Try the app live: https://resume-matcher-pro-rose.vercel.app/

- A modern, AI-powered resume matching tool that analyzes your resume against job descriptions and provides actionable improvement suggestions.
- Build with Next.js, Tailwind CSS, Groq API.

![Resume Matcher Pro](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

## ✨ Features

- 📄 **Resume Upload**: Upload PDF files or paste resume text directly
- 📝 **Job Description Analysis**: Paste any job posting for comparison
- 🤖 **AI-Powered Matching**: Uses Groq's Llama 3 model for intelligent analysis
- 📊 **Match Score**: Get a 0-100% compatibility score
- ✅ **Skills Matching**: See which skills match and which are missing
- 💡 **Smart Suggestions**: Receive personalized improvement recommendations
- 🌓 **Dark Mode**: Easy on the eyes with full dark mode support
- 📱 **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Processing**: PDF.js
- **AI API**: Groq (Llama 3.3 70B)

## Screenshots

- Main Screen
  ![IMG_20260203_181802181_HDR](https://github.com/user-attachments/assets/8678efcc-ec76-4f43-add8-89dcfe816a0f)
  ![IMG_20260203_182442389_HDR](https://github.com/user-attachments/assets/c2b546ac-ec53-4cbd-b921-b9e24727c4ad)
  
- Analysis Results
  ![IMG_20260203_182521726_HDR](https://github.com/user-attachments/assets/69e05235-9ea1-49e1-af54-6d61d176c74b)
  ![IMG_20260203_182629377](https://github.com/user-attachments/assets/f336ccb6-9e0a-4eaa-94d7-e5c251bf6fb5)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Groq API key (free at [console.groq.com](https://console.groq.com))

## 🚀 Quick Start

### 1. Clone or Download

```bash
# If using git
git clone <https://github.com/yashraj022381/resume_matcher_pro.git>
cd resume-matcher-pro

# Or just extract the files to a folder
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Groq API key:

```env
NEXT_PUBLIC_GROQ_API_KEY=your_actual_groq_api_key_here
```

**Getting a Groq API Key (FREE):**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📦 Project Structure

```
resume-matcher-pro/
├── app/
│   ├── layout.jsx          # Root layout with metadata
│   ├── page.jsx            # Main application component
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # This file
```

## 🎯 How It Works

### Simple Explanation:

1. **Resume Input**: You either upload a PDF (which gets converted to text using PDF.js) or paste your resume text
2. **Job Description**: You paste the job description you want to match against
3. **Keyword Analysis**: The app scans both texts for common technical and professional skills
4. **Match Calculation**: Calculates how many required skills from the job description appear in your resume
5. **AI Enhancement**: Sends both texts to Groq's Llama 3 AI model for deeper analysis
6. **Results Display**: Shows match score, matching/missing skills, and AI-generated suggestions

### Key Functions:

- `extractTextFromPDF()`: Converts uploaded PDF to plain text
- `analyzeMatch()`: Performs keyword matching between resume and job description
- `getAISuggestions()`: Calls Groq API for AI-powered analysis
- `handleAnalyze()`: Orchestrates the entire analysis pipeline

## 🌐 Deploy to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable: `NEXT_PUBLIC_GROQ_API_KEY`
6. Click "Deploy"

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variable in Vercel dashboard
# Project Settings > Environment Variables
# Add: NEXT_PUBLIC_GROQ_API_KEY = your_key
```

### Important for Deployment:

Make sure to add your `NEXT_PUBLIC_GROQ_API_KEY` in the Vercel project settings under Environment Variables!

## 🎨 Customization

### Change Colors:

Edit the color classes in `app/page.jsx`. For example, to change the primary blue:
- Replace `bg-blue-500` with `bg-purple-500`
- Replace `text-blue-500` with `text-purple-500`
- etc.

### Add More Skills:

Edit the `commonSkills` array in the `analyzeMatch()` function to include industry-specific terms.

### Modify AI Prompt:

Customize the prompt sent to Groq in the `getAISuggestions()` function for different analysis styles.

## 🐛 Troubleshooting

### PDF Upload Not Working?
- Make sure you're uploading a valid PDF file
- Try pasting text instead as a fallback
- Check browser console for errors

### AI Suggestions Not Appearing?
- Verify your Groq API key is correct in `.env.local`
- Check that the key is active at console.groq.com
- Ensure you've restarted the dev server after adding the key

### Styling Issues?
- Clear browser cache
- Run `npm run dev` again
- Check that Tailwind CSS is properly configured

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests!

## 💬 Support

If you have questions or run into issues:
1. Check this README thoroughly
2. Review the code comments
3. Search for similar issues online
4. Create an issue in the repository

---

Built with ❤️ using Next.js, Tailwind CSS, and Groq AI
