# 🧠 Freigeist - AI-Powered Personal Journal

**Freigeist** is an AI-enhanced personal journaling platform that helps users track their emotions, evaluate their optimism, and receive personalized mental wellness advice. It leverages state-of-the-art language models to analyze journal entries and visualize emotional trends over time.

## ✨ Key Features

- 📝 Write and store daily journal entries
- 🤖 Analyze entry content with **LLaMA 3.2** via **Ollama**
- 📊 Score each entry's **optimism level**
- 💡 Receive personalized, AI-generated mental health suggestions
- ⏰ Smart reminders to keep journaling consistently
- 📈 Visualize emotional trends through interactive charts
- 🧑‍💼 Dual interface: Admin dashboard & User interface
- 🔐 Secure user authentication and role-based access control

## 🛠️ Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | ReactJS, Vite                       |
| Backend       | Django (Python)                     |
| AI/LLM        | LLaMA 3.2 via [Ollama](https://ollama.com) |
| Database      | MySQL                               |
| Charts        |Recharts                             |

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HuynhNhu009/freigeist.git
cd freigeist
```

### 2. Backend setup (Django)
```bash
cd backend
python -m venv venv
pip install -r requirements.txt
./remake.bat
./run.bat
```
### 3. Frontend setup (ReacrJS + Vite)
User (port: 3000)
```bash
cd user
npm install
npm run dev
```
Admin (port: 3003)
```bash
cd admin
npm install
npm run dev
```
### 4. Ollama & LLaMA 3.2 Setup
Ensure you have Ollama installed and running:
```bash
ollama pull llama3.2
```
Ollama must be running at http://localhost:11434 (or update your API URL in the backend config).

### 🧪 Usage Flow
1. Create or log in to your account

2. Start writing your journal entry

3. After submission, AI automatically analyzes the content:

4. Assigns an optimism score

5. Generates insights and advice

6. View emotional trend charts over time

7. Receive daily or custom reminders to keep journaling

### ⚙️ Environment Variables (.env)

```bash
SECRET_KEY=your_backend_secret_key
DEBUG=True

#MySQL settings
DB_NAME=freigeist_db    
DB_USER=root
DB_PASSWORD=your_DB_password

#Cloudinary settings
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key

# Email settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_app_password
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=your_default_email
```



