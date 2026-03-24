# JobGuard 🛡️
> **Detect Job Scams Before They Detect You.**

*An AI-powered platform built to verify job postings in real-time, protecting job seekers from employment fraud.*

---

## 📖 Overview
With the rapid growth of online recruitment, fraudulent job postings have become a severe threat to freshers and active job seekers. **JobGuard** is an intelligent web application designed to detect and flag these fraudulent job postings instantly. By leveraging real-time Natural Language Processing (NLP), JobGuard analyzes job descriptions for suspicious keywords, unrealistic offers, and known scam patterns, replacing manual guesswork with explainable AI.

---

## ✨ Key Features
* **Instant Risk Scoring:** Categorizes analyzed job postings as **Low**, **Medium**, or **High** risk.
* **Explainable AI:** Does not just provide a generic warning.It gives clear, logical reasons for the assigned risk score.
* **Red-Flag Highlighting:** Pinpoints and highlights the exact suspicious sentences (e.g., upfront processing fees) directly within the text.
* **Fast & Responsive UI:** A seamless user experience that allows users to paste descriptions or links and get results in seconds.

---

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Responsive UI)  |
| **Backend** | Node.js & Express  |
| **AI Engine** | NLP models via Groq API integration |
| **Database** | MongoDB / Firebase |
| **Deployment** | Vercel (Frontend) & Railway (Backend) |

---

## 🚀 Getting Started (Local Development)

Follow these steps to set up the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* A [Groq API Key](https://console.groq.com/) for the AI engine
* MongoDB URI or Firebase configuration

### Installation

**1. Clone the repository**
```bash
git clone [https://github.com/rehan-jahagirdar/JobGuard.git](https://github.com/rehan-jahagirdar/JobGuard.git)
cd JobGuard
