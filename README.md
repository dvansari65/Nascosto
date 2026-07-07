# Nascosto

<p align="center">
  <strong>Privacy-first marketplace for digital trading cards on Avalanche.</strong>
</p>

<p align="center">
  Buy • Sell • Negotiate • Settle — All with Confidential Transactions
</p>

---

## 📖 Overview

Nascosto is a privacy-first marketplace that enables collectors to buy, sell, and negotiate digital trading cards without exposing sensitive financial information.

Unlike traditional NFT marketplaces where listing prices, offers, and sale history are publicly visible, Nascosto keeps negotiations and settlements confidential using **Avalanche eERC (Encrypted ERC)** while preserving secure on-chain ownership.

---

## ❌ The Problem

Today's NFT marketplaces expose everything.

Anyone can see:

- Listing prices
- Offer amounts
- Final sale prices
- Trading history
- Wallet activity
- Buying and selling patterns

For collectors of high-value digital collectibles, this creates unnecessary information leakage and weakens negotiation privacy.

---

## 💡 Our Solution

Nascosto introduces **confidential trading** for digital collectibles.

Collectors can:

- List cards without revealing asking prices
- Receive encrypted offers
- Negotiate privately
- Complete confidential settlements
- Transfer ownership securely on-chain

Financial information stays private while ownership remains verifiable.

---

# ✨ Features

### 🔒 Confidential Listings

Create marketplace listings without exposing the asking price publicly.

---

### 💬 Encrypted Offers

Buyers submit confidential offers.

Only the seller can decrypt and compare them.

---

### 💸 Confidential Settlement

Payments are settled privately using **Avalanche eERC**.

Transaction amounts remain hidden from the public.

---

### 🃏 Secure Ownership

Card ownership is transferred securely on-chain after settlement.

---

### ⚡ Built on Avalanche

Fast, low-cost, and secure blockchain infrastructure powered by Avalanche.

---

# 🔄 How It Works

```text
Seller
   │
   ▼
List Trading Card
   │
   ▼
Card Appears in Marketplace
(Price Hidden)
   │
   ▼
Buyers Submit Encrypted Offers
   │
   ▼
Seller Reviews Private Offers
   │
   ▼
Accept Winning Offer
   │
   ▼
Confidential eERC Settlement
   │
   ▼
Ownership Transfers to Buyer
```

---

# 🏗️ Architecture

```text
                Next.js Frontend
                       │
                       ▼
           Marketplace Smart Contract
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   Trading Card NFT             eERC Contract
        │                             │
        └──────────────┬──────────────┘
                       ▼
            Confidential Settlement
                       │
                       ▼
           Ownership Transfer On-chain
```

---

# 🛠️ Tech Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- GSAP
- Lucide Icons

### Blockchain

- Avalanche Fuji Testnet
- Solidity
- Encrypted ERC (eERC)

---

# 🎬 Demo Flow

1. Seller lists a rare trading card.
2. The marketplace displays the card while hiding the asking price.
3. Multiple buyers submit encrypted offers.
4. The seller privately reviews all received offers.
5. The seller accepts the preferred offer.
6. Payment is settled confidentially through eERC.
7. Ownership of the trading card transfers to the buyer.

---

# 🌟 Why Nascosto?

Traditional marketplaces provide transparency.

Nascosto provides **confidential commerce**.

By leveraging Avalanche's privacy primitives, collectors gain:

- Private negotiations
- Hidden payment amounts
- Confidential settlements
- Secure on-chain ownership
- Better protection of trading strategies and collection value

---

# 🚀 Future Scope

Nascosto's infrastructure can be extended beyond trading cards to support:

- Luxury collectibles
- Sports memorabilia
- Digital art
- Rare collectibles
- Tokenized real-world assets
- Exclusive membership collectibles

---

# 📂 Project Structure

```
app/
components/
contracts/
hooks/
lib/
public/
styles/
```

---

# ⚙️ Getting Started

Clone the repository

```bash
git clone https://github.com/<your-username>/nascosto.git
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

## 🏔️ Built for

**Avalanche Privacy Speedrun**

Exploring how confidential commerce can be built using Avalanche's privacy primitives and Encrypted ERC (eERC).