# 🌳 KalpavrikshaAI – Empowering Indian Artisans with AI  

> *“Bridging tradition with technology, one craft at a time.”*  

---

## 🚀 Inspiration  
Indian artisans are the custodians of centuries-old traditions. But in today’s digital marketplace, they face **three huge barriers**:  
1. **Creativity gap** – Limited exposure to modern design trends.
2. **Access gap** – Struggle with language and digital tools.  
3. **Trust gap** – Difficulty proving authenticity of handcrafted goods.  

We built **KalpavrikshaAI** 🌳 to solve these problems using **Google Cloud Generative AI**.  

---

## 💡 What it does  

### 🎨 **Feature 1: NavKalpana (New Imagination)**  
- Artisans upload a photo of their craft pattern.  
- **Vertex AI Gemini** analyzes it.  
- **Imagen on Vertex AI** generates modern mockups (e.g., Warli patterns on handbags).  
- Bridges traditional design → modern products.  

### 🎤 **Feature 2: Voice-First, Hyper-Local Interface**  
- Entire app is voice-controlled in local dialects (e.g., Marathi, Hindi, Tamil).  
- **Speech-to-Text + Translation AI + Text-to-Speech** enable natural conversations.  
- Makes digital marketplaces accessible to non-English speaking artisans.  

### 📜 **Feature 3: Kathakar (AI Storytelling + Authenticity)**  
- AI generates authentic stories for each product.  
- A **QR Code** links buyers to artisan profiles, stories, and even short making videos.  
- Increases **trust and product value**.  
 

### 💰 **Feature 4: NyayMoolya (Fair Pricing Engine)**  
- Uses **Vertex AI AutoML + BigQuery** to suggest fair prices.  
- Ensures artisans aren’t underpaid and buyers know they support fair trade.  

### 🛍️ **Feature 5: MantrAI (Buyer Personalization)**  
- Buyers upload a photo of their space/clothes.  
- **Vertex AI Matching Engine** recommends artisan products that fit their lifestyle.  

---

## 🏗️ Tech Stack  

- **Frontend:** Next.js (TypeScript, TailwindCSS)  
- **Backend:** Next.js API Routes  
- **Database:** Firestore (NoSQL), BigQuery (analytics)  
- **AI/ML:** Vertex AI (Gemini, Imagen, AutoML, Matching Engine)  
- **Voice/Translation:** Google Cloud Speech-to-Text, Translation AI, Text-to-Speech  
- **Storage:** Google Cloud Storage (mockups, QR codes, product images)  
- **Deployment:** Vercel (frontend) + Google Cloud Run (APIs)  

---

## 📂 Project Structure  

kalpavrikshaai/
├── src/app/ # Next.js pages + API routes
├── src/components/ # Reusable UI components
├── src/lib/google/ # GCP integrations (Vertex, Speech, Translation, etc.)
├── src/types/ # TypeScript interfaces
├── public/ # Static assets (icons, QR, sample crafts)
└── tests/ # Unit & integration tests

## 🌍 Impact  

- **Artisans** → Reach global markets, discover new product ideas, get fair pricing.  
- **Buyers** → Buy authentic, verified, and personalized crafts.  
- **Culture** → Preserve India’s traditional art forms in the digital economy.  