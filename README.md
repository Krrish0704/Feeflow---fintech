# FeeFlow - Smart School FinTech Engine

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

The core engine for **FeeFlow**, an append-only school fee management system built for the PaperBuddy EduHack Series. 

FeeFlow bridges the gap between scattered spreadsheets and modern fintech by utilizing a single-write-path financial ledger, a JSONB-driven fee rule engine, and strict maker-checker governance. It features a modern, interactive Next.js frontend with Glassmorphism aesthetics and smooth scrolling, backed by a robust, containerized FastAPI pipeline.

---

##  Project Structure

The repository is strictly separated into a FastAPI backend and a Next.js (App Router) frontend. 

```text
feeflow/
├── feeflow-backend/           # Core API & Ledger Engine
│   ├── main.py                
│   ├── database.py            
│   ├── models.py              
│   ├── schemas.py             
│   ├── ledger_service.py      
│   ├── fee_rule_engine.py     
│   ├── approvals_service.py   
│   ├── wallet_service.py      
│   ├── reconciliation_service.py
│   ├── routers/               
│   ├── docker-compose.yml
│   └── Dockerfile
│
└── feeflow-frontend/          # Web Portals (Glassmorphism & Interactive UI)
    ├── app/
    │   ├── page.tsx           
    │   ├── admin/page.tsx      
    │   ├── principal/page.tsx  
    │   ├── student/page.tsx    
    │   └── layout.tsx          
    ├── components/ui/
    └── lib/
