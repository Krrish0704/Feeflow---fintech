# FeeFlow - Smart School FinTech Engine

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

The core engine for **FeeFlow**, an append-only school fee management system built for the PaperBuddy EduHack Series.

FeeFlow bridges the gap between scattered spreadsheets and modern fintech by utilizing a single-write-path financial ledger, a JSONB-driven fee rule engine, and strict maker-checker governance. It features a modern, interactive Next.js frontend with glassmorphism aesthetics and smooth scrolling, backed by a robust, containerized FastAPI pipeline.

---

## Problem Statement

School fee management is typically run through scattered spreadsheets, paper receipts, and fragmented software. Administrators struggle to accurately track fee collections, and reconciling payments across cash, cheque, and digital channels remains a manual, error-prone process with no reliable audit trail.

FeeFlow addresses this with a fee management system where every fee type is configurable without a schema change, every transaction is permanently auditable, and every payment channel writes through the same idempotent path.

---

## Architecture

Rather than treating fee rules, payments, and approvals as separate concerns bolted together, this project is built around one governing principle: every financial write, regardless of origin, passes through a single ledger service.

1. **FastAPI**: Serves the REST API for students, fee structures, payments, waivers, wallet operations, and reconciliation.
2. **Ledger Service**: The only code path permitted to write to the ledger table. Enforces idempotency at both the application and database level, so duplicate webhooks or retried requests can never double-count money.
3. **Fee Rule Engine**: Resolves JSONB-defined conditions (grace periods, late penalties, discounts) into a final charge amount at assignment time, without requiring schema changes for new rule types.
4. **Approvals Service**: Implements maker-checker governance for waivers above a configurable threshold, with self-approval explicitly blocked in code.
5. **PostgreSQL**: Stores all financial data with `Numeric` typing for currency and `JSONB` for rule and metadata storage.
6. **Docker**: Containerizes the API and database for a consistent local and deployment environment.

---

## Key Features

**Dynamic Fee Rule Engine**
Fee structures are defined once with a base amount and a `conditions` JSONB payload. New fee types, penalties, and discounts are added through the API, not through database migrations.

**Append-Only Ledger**
Every charge, payment, and waiver is recorded as an immutable entry. Balances are computed from the full transaction history rather than stored and mutated, so the system remains auditable at any point in time.

**Idempotent Writes**
Every ledger entry carries a unique reference ID, checked at the application level and enforced by a database constraint. A payment webhook or sync request fired twice cannot result in a duplicate charge or credit.

**Maker-Checker Governance**
Waivers below a configured threshold are auto-approved. Waivers above it require approval from a second, distinct identity, with the requesting and approving parties tracked and validated in the data model.

**Closed-Loop Wallet**
Refunds and overpayments can be issued to a student wallet and later applied to fees. Wallet debit and fee credit operations are written as a single atomic database transaction.

**Offline Reconciliation**
Cash payments collected without connectivity are staged before being written to the ledger, then promoted once verified, using the same idempotent write path as every other payment channel.

---

## Tech Stack

### Backend

| Component | Technology | Purpose |
|---|---|---|
| Framework | FastAPI | REST API with automatic OpenAPI documentation |
| ORM | SQLAlchemy | Data access with explicit `Numeric` typing for currency |
| Database | PostgreSQL 16 | Transactional storage with JSONB support |
| Validation | Pydantic v2 | Request and response schema enforcement |
| Containerization | Docker, docker-compose | Consistent local and deployment environment |

### Frontend

| Component | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Role-based portals for admin, principal, and student users |
| Styling | Tailwind CSS v4 | Utility-first styling, glassmorphism design system |
| Animation | Framer Motion | Interface transitions and state changes |
| Scrolling | Lenis | Smooth scroll behavior |
| Icons | Lucide React | Icon system |

---

## Project Structure

The repository is strictly separated into a FastAPI backend and a Next.js (App Router) frontend.

```
feeflow/
├── feeflow-backend/          # Core API & Ledger Engine
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
└── feeflow-frontend/         # Web Portals (Glassmorphism & Interactive UI)
    ├── app/
    │   ├── page.tsx
    │   ├── admin/page.tsx
    │   ├── principal/page.tsx
    │   ├── student/page.tsx
    │   └── layout.tsx
    ├── components/ui/
    └── lib/
```

---

## API Reference

Full interactive documentation is available at `/docs` once the backend is running.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/students` | Register a student |
| GET | `/students/{id}/balance` | Retrieve current fee and wallet balance |
| GET | `/students/{id}/ledger/history` | Retrieve full transaction history |
| POST | `/fees/structures` | Define a new fee rule |
| POST | `/fees/structures/{id}/assign` | Generate per-student charges from a fee rule |
| POST | `/payments/webhook` | Idempotent payment gateway callback |
| POST | `/waivers/request` | Submit a waiver request |
| POST | `/waivers/{id}/approve` | Approve a pending waiver |
| POST | `/wallet/pay` | Pay a fee using wallet balance |
| POST | `/wallet/refund` | Issue a refund to a student wallet |
| POST | `/reconciliation/sync-offline` | Stage an offline cash payment |
| POST | `/reconciliation/{id}/promote` | Promote a staged payment to the ledger |

---

## Quickstart

To run this locally, you need [Git](https://git-scm.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and [Node.js](https://nodejs.org/).

### 1. Clone the repository

```bash
git clone https://github.com/Krrish0704/Feeflow---fintech.git
cd Feeflow---fintech
```

### 2. Backend

```bash
docker-compose up --build
```

API available at `http://localhost:8000`. Interactive documentation at `http://localhost:8000/docs`.

Alternatively, without Docker:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd feeflow-frontend
npm install
npm run dev
```

Application available at `http://localhost:3000`.

### Environment Variables

Backend (`.env`):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feeflow
```

Frontend (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Roadmap

- Neuro-symbolic AI layer combining the rule engine with anomaly detection on payment behavior
- Native mobile application built on the existing API
- Escalating payment reminders through WhatsApp integration
- Multi-tenant support for onboarding multiple schools on a single deployment


---

## License

Distributed under the MIT License.
