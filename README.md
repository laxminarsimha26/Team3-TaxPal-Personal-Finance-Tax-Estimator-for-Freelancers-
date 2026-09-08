💼 TaxPal — Personal Finance & Tax Estimator for Freelancers

<p align="center">
  <strong>Track • Budget • Estimate Taxes • Report</strong><br>
  A full-stack personal finance platform designed to help freelancers manage income, expenses, budgets, tax estimates, and financial reports in one place.
</p>

<p align="center">








</p>

⭐ Project at a Glance

TaxPal is a full-stack web application built for freelancers who need a simple way to understand their personal business finances.

Instead of maintaining separate spreadsheets for income, expenses, budgets, taxes, and reports, TaxPal brings these activities into one application.

🎯 What TaxPal Solves

Freelancers commonly need to:

Track irregular income from different sources

Record and categorize business expenses

Control monthly spending through budgets

Estimate quarterly tax obligations

Review monthly and quarterly financial performance

Export financial information for further use

TaxPal combines these activities into one connected workflow.

🚀 Core Modules

Module

Purpose

Key Capabilities

💰 A — Income & Expense Management

Track financial activity

Add income, add expenses, view transactions, delete transactions

📊 B — Categorization & Budgeting

Organize and control spending

Categories, monthly budgets, budget management

🧮 C — Tax Estimation Engine

Estimate tax obligations

Country/region selection, filing status, deductions, quarterly estimates, tax calendar

📑 D — Reporting & Export

Understand and share financial data

Summary reports, monthly/quarterly breakdowns, CSV export, PDF reports, report history

✨ Key Features

🔐 Authentication

User registration

Login and logout

Session-based authentication

Protected application routes

Password hashing with bcrypt

User-specific financial data

💵 Transaction Management

Add income

Add expenses

Assign categories

Record transaction dates

View transaction history

Delete transactions

Income and expense totals

🗂️ Categories & Budgeting

Category management

Suggested categories

Monthly budgets

Budget creation and updates

Budget deletion

Spending organization

🧮 Tax Estimation

Country selection

Region/state selection where applicable

Filing-status selection

Quarterly tax estimates

Gross income input

Business expense deductions

Retirement contribution input

Health insurance premium input

Home-office deduction input

Tax calendar and due-date information

Detailed calculation for supported U.S. tax scenarios

Simplified estimation for other supported countries

📈 Financial Reporting

Financial summary

Total income

Total expenses

Net savings

Transaction count

Category breakdown

Monthly breakdown

Quarterly breakdown

Report history

Report deletion

CSV export

PDF report generation

Printable reports

🏗️ System Architecture

                         ┌─────────────────────────┐
                         │      TaxPal User        │
                         │      Web Browser        │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │   Angular Frontend      │
                         │   localhost:4200        │
                         │                         │
                         │ • Login / Signup        │
                         │ • Dashboard             │
                         │ • Transactions          │
                         │ • Budgets               │
                         │ • Categories            │
                         │ • Tax Estimator         │
                         │ • Reports               │
                         └────────────┬────────────┘
                                      │ HTTP / JSON
                                      │ Session Cookie
                                      ▼
                         ┌─────────────────────────┐
                         │   Node.js + Express     │
                         │   localhost:5000        │
                         │                         │
                         │ • Authentication        │
                         │ • Transactions          │
                         │ • Budgets               │
                         │ • Tax Estimation        │
                         │ • Reports               │
                         │ • CSV Export            │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      MySQL Database     │
                         │         taxpal          │
                         │                         │
                         │ • users                 │
                         │ • transactions          │
                         │ • budgets               │
                         │ • suggested_categories  │
                         │ • tax_estimates         │
                         │ • alerts                │
                         │ • reports               │
                         └─────────────────────────┘

🔄 Application Flow

Register / Login
       ↓
Authenticated Session
       ↓
Dashboard
       ↓
Income + Expenses
       ↓
Categories + Budgets
       ↓
Tax Estimation
       ↓
Monthly / Quarterly Analysis
       ↓
Reports
       ↓
CSV / PDF Export

🛠️ Technology Stack

Frontend

Angular 22

TypeScript

Angular Router

Angular Forms

RxJS

HTML5

CSS3

jsPDF

jsPDF AutoTable

Backend

Node.js

Express.js 5

Express Session

CORS

dotenv

bcrypt

mysql2

JSON Web Token support

Database

MySQL

Relational database design

Foreign-key relationships

Cascading user-data deletion

📁 Repository Structure

Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers/
│
├── 📁 Backend/
│   ├── 📁 config/
│   │   └── db.js
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── reportController.js
│   │   ├── taxcontroller.js
│   │   └── transactionController.js
│   │
│   ├── 📁 middleware/
│   │   └── authMiddleware.js
│   │
│   ├── 📁 models/
│   │   ├── budgetmodel.js
│   │   ├── reportModel.js
│   │   ├── taxmodel.js
│   │   ├── transactionModel.js
│   │   └── usermodel.js
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taxroutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── readme.md
│   └── server.js
│
├── 📁 database/
│   └── databasem1.sql
│
└── 📁 frontend/
    └── 📁 frontend/
        ├── 📁 public/
        ├── 📁 src/
        │   ├── 📁 app/
        │   │   ├── 📁 core/
        │   │   ├── 📁 features/
        │   │   └── 📁 shared/
        │   ├── index.html
        │   ├── main.ts
        │   └── styles.css
        │
        ├── angular.json
        ├── package.json
        ├── package-lock.json
        └── tsconfig.json

🗄️ Database Design

The database is named:

taxpal

Main Tables

Table

Purpose

users

Stores registered user information

transactions

Stores income and expense transactions

budgets

Stores monthly category budgets

suggested_categories

Stores reusable category suggestions

tax_estimates

Stores tax estimation details

alerts

Stores tax or financial alerts

reports

Stores generated report metadata

Relationships

users
  │
  ├──────< transactions
  │
  ├──────< budgets
  │
  ├──────< tax_estimates
  │
  ├──────< alerts
  │
  └──────< reports

User-related records use foreign keys and cascading deletion.

🔐 Authentication & Security

TaxPal uses session-based authentication between the Angular frontend and Express backend.

Authentication Flow

Signup
  ↓
User stored in MySQL
  ↓
Password hashed with bcrypt
  ↓
Login
  ↓
Express session created
  ↓
HTTP-only session cookie
  ↓
Protected API requests

Security Measures

Password hashing using bcrypt

HTTP-only session cookies

Protected frontend routes

Authenticated backend operations

User-specific database queries

Database credentials stored in .env

.env excluded through .gitignore

⚠️ Never commit your real .env file or database password to GitHub.

💰 Income & Expense Management

Transactions are stored with:

Transaction
├── User
├── Type
├── Category
├── Amount
└── Date

Supported transaction types:

income
expense

The dashboard and reporting system use these transactions to calculate financial summaries.

📊 Budget Management

Users can create budgets based on categories and months.

Budget management supports:

Create budget

View budgets

Update budget

Delete budget

Category-based planning

Monthly spending control

This allows freelancers to compare planned spending with actual financial activity.

🧮 Tax Estimation Engine

TaxPal provides a dedicated tax-estimation module.

Supported Inputs

Country

State/region

Filing status

Quarter

Gross income

Business expenses

Retirement contributions

Health insurance premiums

Home-office deduction

U.S. Detailed Calculation

For supported U.S. calculations, the application derives:

Net Profit
      ↓
Self-Employment Tax
      ↓
Adjusted Gross Income
      ↓
Standard Deduction
      ↓
Taxable Income
      ↓
Income Tax
      ↓
Total Annual Tax
      ↓
Quarterly Tax Due

Simplified Calculation

For supported non-detailed scenarios, TaxPal calculates a simplified taxable amount and estimated tax using the configured generic-rate approach.

Tax Calendar

The application also provides quarterly tax calendar information to help users identify important estimated-tax periods and due dates.

ℹ️ Tax estimates are intended for planning and educational use and should not be treated as professional tax advice.

📑 Reporting & Analytics

TaxPal provides multiple levels of financial reporting.

Summary Report

Provides:

Total income

Total expenses

Net savings

Transaction count

Category breakdown

Monthly Breakdown

Displays:

Month

Income

Expense

Net savings

Transaction count

Quarterly Breakdown

Displays:

Quarter

Income

Expense

Net savings

Transaction count

📤 Export Features

CSV

The backend supports CSV export containing:

Date
Type
Category
Amount

Example:

"Date","Type","Category","Amount"
"2026-09-07","income","Investment","5000.00"
"2026-09-07","expense","Rent","4000.00"

PDF

The Angular frontend can generate formatted PDF reports using:

jsPDF

jsPDF AutoTable

Reports can also be printed from the application.

🔌 REST API

Base backend URL:

http://localhost:5000

Authentication

Method

Endpoint

Purpose

POST

/api/auth/signup

Register a user

POST

/api/auth/login

Login

POST

/api/auth/logout

Logout

GET

/api/auth/me

Get current session user

Transactions

Method

Endpoint

Purpose

GET

/api/transactions

Get user transactions

POST

/api/transactions

Create transaction

DELETE

/api/transactions/:id

Delete transaction

Budgets

Method

Endpoint

Purpose

GET

/api/budgets

Get budgets

POST

/api/budgets

Create budget

PUT

/api/budgets/:id

Update budget

DELETE

/api/budgets/:id

Delete budget

Tax Estimates

Method

Endpoint

Purpose

GET

/api/tax

Get tax estimates

GET

/api/tax/:id

Get one estimate

POST

/api/tax

Create tax estimate

PUT

/api/tax/:id

Update estimate

DELETE

/api/tax/:id

Delete estimate

Reports

Method

Endpoint

Purpose

GET

/api/reports/summary

Financial summary

GET

/api/reports/monthly

Monthly breakdown

GET

/api/reports/quarterly

Quarterly breakdown

GET

/api/reports/export/csv

CSV export

GET

/api/reports

Report history

GET

/api/reports/:id

Get report

POST

/api/reports

Create report record

DELETE

/api/reports/:id

Delete report

🖥️ Frontend Routes

Route

Feature

/login

User login

/signup

User registration

/forgot-password

Password recovery

/reset-password/:token

Password reset

/dashboard

Financial dashboard

/transactions

Transaction management

/budgets

Budget management

/categories

Category management

/tax-estimator

Tax calculation and calendar

/reports

Financial reporting and exports

Protected application routes require authentication.

⚙️ Installation & Setup

Prerequisites

Install:

Node.js 18 or later

npm

MySQL Server

MySQL Workbench or MySQL command-line client

Git

1️⃣ Clone the Repository

git clone https://github.com/springboardmentor87/Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers-.git
cd Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers-

2️⃣ Configure MySQL

Start MySQL and create the database using:

mysql -u root -p

Then import:

SOURCE path/to/database/databasem1.sql;

Verify:

SHOW DATABASES;
USE taxpal;
SHOW TABLES;

You should see the TaxPal tables.

3️⃣ Configure Backend

Open a terminal:

cd Backend
npm install

Create:

Backend/.env

Use your own local database credentials:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taxpal

SESSION_SECRET=your_session_secret

⚠️ Important

Do not copy a real password into this README.

Do not commit .env to GitHub.

4️⃣ Start Backend

From the Backend folder:

node server.js

Expected startup messages:

MySQL Connected
Server running on port 5000

5️⃣ Start Frontend

Open a second terminal:

cd frontend/frontend
npm install
ng serve

Open:

http://localhost:4200

🧪 Recommended Demo / Testing Flow

For a panel demonstration, use this sequence:

                    TAXPAL DEMO
                         │
                         ▼
                 Create Account
                         │
                         ▼
                       Login
                         │
                         ▼
                    Dashboard
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Add Income              Add Expense
              │                     │
              └──────────┬──────────┘
                         ▼
                    Categories
                         │
                         ▼
                      Budget
                         │
                         ▼
                  Tax Estimator
                         │
                         ▼
                    Tax Result
                         │
                         ▼
                      Reports
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
         Monthly Report       Quarterly Report
              │                     │
              └──────────┬──────────┘
                         ▼
                  CSV / PDF Export

Suggested Panel Demonstration

Register a new user

Login

Add one income transaction

Add one expense transaction

Open the dashboard

Create a monthly budget

Open Tax Estimator

Enter income and deductions

Calculate estimated tax

Open Reports

Show summary

Show monthly/quarterly breakdown

Export CSV

Generate/preview PDF

Show report history

📌 Example Report Calculations

If a user records:

Income   = ₹/ $ 5,000
Expense  = ₹/ $ 4,000

The financial summary becomes:

Total Income  = 5,000
Total Expense = 4,000
Net Savings   = 1,000

The reporting module uses the transaction records stored in MySQL to generate these values.

🧩 Backend Architecture

TaxPal follows a controller-model-route structure.

Request
  ↓
Route
  ↓
Controller
  ↓
Model
  ↓
MySQL
  ↓
Controller Response
  ↓
Angular Frontend

Backend Responsibilities

Routes

Define API endpoints

Controllers

Validate requests

Check authentication

Coordinate application logic

Return API responses

Models

Execute database queries

Retrieve and persist application data

Database

Permanently stores user and financial information

🎨 Frontend Architecture

The Angular application is organized around:

src/app/
│
├── core/
│   ├── data/
│   ├── models/
│   └── services/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── transactions/
│   ├── budgets/
│   ├── categories/
│   ├── tax-estimator/
│   └── reports/
│
└── shared/
    ├── guards/
    └── layout/

Core Services

auth.service.ts

transaction.service.ts

budget.service.ts

tax.service.ts

report.service.ts

category.service.ts

This separation keeps business communication and reusable logic outside individual UI components.

📋 Project Requirements Mapping

Requirement

TaxPal Implementation

User signup/login

Authentication module

Manual income entry

Transaction management

Manual expense entry

Transaction management

Dashboard

Dashboard module

Category suggestions

Category module

Manual categories

Category module

Monthly budgets

Budget module

Budget progress

Budget module

Country/region selection

Tax Estimator

Tax slab/calculation

Tax Estimation Engine

Quarterly alerts/calendar

Tax Estimator calendar

Summary reports

Reports module

Monthly breakdown

Reports module

Quarterly breakdown

Reports module

CSV export

Reports module

PDF export

Reports module

Report history

Reports module

🏆 Why TaxPal Stands Out

1. One Connected Workflow

TaxPal connects:

Transactions → Budgets → Taxes → Reports

rather than treating them as separate tools.

2. Freelancer-Focused

The system is designed around the irregular income and expense patterns commonly associated with freelance work.

3. Actionable Financial View

Users can move from raw transactions to:

Financial Activity
       ↓
Budget Awareness
       ↓
Tax Planning
       ↓
Financial Reporting

4. Full-Stack Implementation

The application demonstrates:

Angular frontend

Node.js backend

Express REST APIs

MySQL database

Session authentication

Tax calculation logic

Report generation

CSV/PDF export

🔮 Future Enhancements

Potential future improvements include:

Automated bank-account transaction import

Advanced spending analytics

Interactive charts and dashboards

Email-based tax reminders

More country-specific tax rules

Cloud deployment

Role-based administration

Automated scheduled reports

Advanced audit history

Mobile application support

⚠️ Important Notes

Environment

The application requires a local .env configuration for database and session settings.

Tax Information

Tax estimates are for planning purposes. Actual tax liability can depend on current laws, individual circumstances, deductions, credits, filing requirements, and jurisdiction-specific rules.

Local Development

The documented configuration assumes:

Frontend → http://localhost:4200
Backend  → http://localhost:5000
Database → MySQL / taxpal

👥 Team Project

Project: TaxPal — Personal Finance & Tax Estimator for Freelancers

Repository:
springboardmentor87/Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers-

This project demonstrates collaborative full-stack development across:

Frontend development

Backend API development

Database design

Authentication

Financial calculations

Reporting

Testing and integration

🎤 Panel Presentation — Quick Explanation

“TaxPal is a full-stack personal finance and tax estimation platform designed for freelancers. It allows users to manage income and expenses, organize spending with categories and budgets, estimate quarterly taxes, and generate financial reports. The Angular frontend communicates with an Express and Node.js backend, while MySQL provides persistent storage. The system connects the complete workflow from transaction tracking to budgeting, tax planning, and reporting.”

⭐ One-Line Summary

TaxPal turns everyday financial transactions into organized budgets, tax estimates, and actionable financial reports.

📄 Project Status

<p align="center">

✅ Authentication
✅ Transactions
✅ Categories
✅ Budgeting
✅ Tax Estimation
✅ Tax Calendar
✅ Financial Reports
✅ Monthly Analysis
✅ Quarterly Analysis
✅ CSV Export
✅ PDF Export
✅ Report History
✅ MySQL Integration

</p>

<p align="center">
  <strong>💼 TaxPal — Simplifying Finance for Freelancers</strong>
</p>
