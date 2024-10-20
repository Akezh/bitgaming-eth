# 🎮 Bitgaming

**Play-To-Earn gaming platform & NFT marketplace**

---

## 📑 Table of Contents

- [About](#about)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)
- [Contributors](#contributors)
- [GitHub Repository](#github-repository)

---

## 📖 About

1️⃣ **Frontend**

Web app where you can enjoy **AI-powered Dungeons & Dragons**, earn **blockchain currency**, and **claim NFTs**

- **Features**:
  - Lightning-fast sign-ins with Dynamic auth
  - Play **AI-powered Dungeons & Dragons** with dynamic storylines and images
  - Earn in-game **blockchain currency (BIT)** and unlock **NFT collectibles**.
- **Core Technologies**: TypeScript, React, wagmi, ethers, Dynamic.xyz, Walrus, Morph Holesky Testnet,

2️⃣ **Backend-DnD**

- This backend service powers **Dungeons & Dragons** gameplay by interacting with **OpenAI's GPT LLM (4.0)** to provide immersive storytelling and dynamic player interactions.

3️⃣ **Walrus**

- Scripts for **managing and uploading images** securely on **blockchain storage** using Walrus.

4️⃣ **Hardhat**

- Blockchain development toolkit used to **deploy and manage smart contracts** within the platform.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Akezh/bitgaming-eth
cd bitgaming-eth
```

---

### 2. Frontend Setup

#### Step 1: Set Up Environment Variables

Copy the provided `.env.example` file to `.env`. Make sure to create an account at [Dynamic](https://app.dynamic.xyz/) for your **VITE_DYNAMIC_ENV_ID**:

```bash
cp .env.example .env
```

#### Step 2: Install Dependencies & Launch

You can use **npm** or **yarn** (Node 20 preferred, Node 18+ supported):

```bash
npm install
npm run dev
```

---

### 3. Backend Setup

#### Step 1: Set Up Environment Variables

Copy the `.env.example` file to `.env` and set your **OPEN_AI_API_KEY** by creating a developer account on [OpenAI](https://platform.openai.com/):

```bash
cp .env.example .env
```

#### Step 2: Install Dependencies & Launch

```bash
npm install
npm run dev
```

- The backend runs an **Express server** designed to manage **D&D campaigns**, powered by OpenAI APIs. It handles **Assistants, Threads, Messages**, and **Runs** to provide smooth game management.

---

## 🌍 Environment Variables

Ensure the following keys are properly configured in the `.env` file:

- **Frontend**:

  - `VITE_DYNAMIC_ENV_ID` → [Dynamic](https://app.dynamic.xyz/) Account

- **Backend**:
  - `OPEN_AI_API_KEY` → [OpenAI](https://platform.openai.com/) API Key

Refer to the provided **`.env.example`** file for additional details.

---

## 👥 Contributors

- **[YongyuLiu03](https://github.com/YongyuLiu03)** – GitHub Profile
- **[Akezhan Rakishev](https://github.com/Akezh)** – GitHub Profile
- **[haileyism](https://github.com/haileyism)** – GitHub Profile

---

## 📂 GitHub Repository

Explore the source code and contribute to the project on **GitHub**:  
[Bitgaming Repository](https://github.com/Akezh/bitgaming-eth)
