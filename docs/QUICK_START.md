# ShelfSync AI - Quick Start Guide

## 🚀 Setup Instructions (5 Minutes)

### Step 1: Install Backend Dependencies

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

The `.env` file has been created in the `backend/` directory. You need to add your OpenAI API key:

**Edit `backend/.env`:**
```env
# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**To get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste it into the `.env` file

**Note:** The app will work without an OpenAI API key (using deterministic fallback), but the AI Copilot and Catalog generation will be more impressive with it.

### Step 3: Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### Step 4: Start the Backend Server

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 5: Start the Frontend Server

Open a **new terminal** and run:

```powershell
cd frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

You should see:
```
  ▲ Next.js 15.x.x
  - Local:        http://127.0.0.1:3000
```

### Step 6: Open the Application

Open your browser and go to:
```
http://127.0.0.1:3000
```

---

## 🎯 Testing the AI Copilot

Once the app is running:

1. **Scroll down** to the "AI Copilot" section
2. **Try these queries:**
   - "Why are sales dropping?"
   - "Which SKU is at highest risk?"
   - "Where should I move inventory?"
   - "Which ads should I pause?"
   - "What are my top actions for today?"

3. **Click suggested questions** for quick testing

---

## 🔧 Troubleshooting

### Backend won't start
- Make sure you're in the `backend/` directory
- Check that the virtual environment is activated
- Verify all dependencies are installed: `.\.venv\Scripts\python.exe -m pip install -r requirements.txt`

### Frontend shows "Backend is not reachable"
- Make sure the backend is running on port 8000
- Check the terminal for any backend errors
- Verify CORS settings in `backend/.env`

### AI Copilot returns errors
- Check if `OPENAI_API_KEY` is set in `backend/.env`
- Verify the API key is valid
- Check backend terminal for error messages
- The app will fall back to deterministic responses if OpenAI fails

### OpenAI API Key Issues
- Make sure there are no extra spaces in the `.env` file
- Verify the key starts with `sk-`
- Check your OpenAI account has credits
- The app works without OpenAI (deterministic mode)

---

## 📊 API Endpoints

Test the backend directly:

```powershell
# Dashboard Summary
Invoke-WebRequest http://127.0.0.1:8000/api/dashboard/summary -UseBasicParsing

# AI Copilot Query
Invoke-WebRequest http://127.0.0.1:8000/api/copilot/query -Method POST -Body '{"query":"Why are sales dropping?"}' -ContentType "application/json" -UseBasicParsing

# Inventory Risks
Invoke-WebRequest http://127.0.0.1:8000/api/inventory/risks -UseBasicParsing

# Ad Recommendations
Invoke-WebRequest http://127.0.0.1:8000/api/ads/recommendations -UseBasicParsing

# Catalog Generation
Invoke-WebRequest http://127.0.0.1:8000/api/catalog/generate -Method POST -Body '{"sku":"SYN-BUDS-MINI"}' -ContentType "application/json" -UseBasicParsing
```

---

## 🎬 Demo Flow

For the hackathon demo, follow this narrative:

1. **Open Dashboard** - Show executive command center
2. **Highlight Critical Alert** - "Blinkit South Delhi stockout in 2 hours"
3. **Ask AI Copilot** - "Why are sales dropping?"
4. **Show AI Response** - Root cause analysis with business impact
5. **Ask for Actions** - "What should I do today?"
6. **Execute Actions** - Transfer inventory, pause ads
7. **Show Other Features** - Catalog generation, returns audit, pooling optimizer

---

## 💡 Tips

- **Use suggested questions** for quick demos
- **The AI Copilot is the star feature** - spend most demo time here
- **Show the business impact** - revenue protected, ad waste prevented
- **Explain the workflow** - Problem → AI Analysis → Action → Impact
- **Highlight OpenAI integration** - GPT-4o-mini for cost optimization

---

## 📝 Environment Variables Reference

### Backend (`backend/.env`)
```env
# Required for AI Copilot and Catalog Generation
OPENAI_API_KEY=your-openai-api-key-here

# CORS (already configured)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (`frontend/.env.local`) - Optional
```env
# Only needed if backend is on a different URL
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

---

## ✅ Verification Checklist

- [ ] Backend running on http://127.0.0.1:8000
- [ ] Frontend running on http://127.0.0.1:3000
- [ ] Dashboard loads without errors
- [ ] AI Copilot responds to queries
- [ ] Catalog generation works
- [ ] All 5 agents show recommendations
- [ ] Action execution simulates workflows

---

## 🆘 Need Help?

1. Check the terminal output for error messages
2. Verify all dependencies are installed
3. Make sure ports 3000 and 8000 are not in use
4. Review the `backend/.env` file configuration
5. Check the browser console for frontend errors

---

## 🎉 You're Ready!

Once everything is running, you have a fully functional AI-native operations copilot for quick-commerce brands!

**Key Features Working:**
- ✅ AI Operations Copilot (conversational interface)
- ✅ 5 AI Agents (Inventory, Ads, Catalog, Returns, Pooling)
- ✅ OpenAI Integration (GPT-4o-mini)
- ✅ Executive Dashboard
- ✅ Action Simulation
- ✅ Professional UI/UX

**Next Steps:**
- Test all features
- Practice the demo flow
- Customize for your use case
- Deploy to Vercel + Railway (see DEPLOYMENT.md)
