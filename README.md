💼 TaxPal

Personal Finance & Tax Estimator for Freelancers

Track • Budget • Estimate Taxes • Report

A full-stack personal finance platform that helps freelancers manage income, expenses, budgets, tax estimates, and financial reports in one connected workflow.

⭐ Project at a Glance

TaxPal is a full-stack web application designed for freelancers who need a simple and organized way to understand their business finances.

Instead of maintaining separate spreadsheets for income, expenses, budgets, taxes, and reports, TaxPal brings everything together in one application.

🎯 What TaxPal Solves

Freelancers commonly need to:

💵 Track irregular income from different sources

💳 Record and categorize business expenses

📊 Control monthly spending with budgets

🧮 Estimate quarterly tax obligations

📈 Review monthly and quarterly financial performance

📤 Export financial information for further use

TaxPal connects all of these activities into one workflow.

🚀 Core Modules

Module

Purpose

Key Capabilities

💰 A — Income & Expense Management

Track financial activity

Add income, add expenses, categorize transactions, view history, delete transactions

📊 B — Categorization & Budgeting

Organize and control spending

Categories, suggested categories, monthly budgets, budget management

🧮 C — Tax Estimation Engine

Estimate tax obligations

Country/region selection, filing status, deductions, quarterly estimates, tax calendar

📑 D — Reporting & Export

Understand and share financial data

Summary reports, monthly/quarterly analysis, CSV export, PDF reports, report history

✨ Key Features

🔐 Authentication & Security

User registration

Login and logout

Session-based authentication

Protected application routes

Password hashing with bcrypt

User-specific financial data

HTTP-only session cookies

Environment-based database credentials

💵 Transaction Management

Add income

Add expenses

Assign categories

Record transaction dates

View transaction history

Delete transactions

Calculate income and expense totals

🗂️ Categories & Budgeting

Category management

Suggested categories

Monthly budgets

Budget creation and updates

Budget deletion

Category-based spending organization

Monthly spending control

🧮 Tax Estimation

Country selection

State/region selection where applicable

Filing-status selection

Quarterly tax estimates

Gross income input

Business expense deductions

Retirement contribution input

Health insurance premium input

Home-office deduction input

Tax calendar and due-date information

Detailed calculations for supported U.S. scenarios

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

flowchart TD
    A["👤 TaxPal User<br/>Web Browser"] --> B["🖥️ Angular Frontend<br/>localhost:4200"]
    B -->|"HTTP / JSON<br/>Session Cookie"| C["⚙️ Node.js + Express<br/>localhost:5000"]
    C -->|"SQL Queries"| D["🗄️ MySQL Database<br/>taxpal"]

    B --- B1["Login • Dashboard<br/>Transactions • Budgets<br/>Categories • Tax Estimator • Reports"]
    C --- C1["Authentication • Transactions<br/>Budgets • Tax Estimation<br/>Reports • CSV Export"]
    D --- D1["users • transactions • budgets<br/>suggested_categories • tax_estimates<br/>alerts • reports"]

🔄 Application Flow

flowchart LR
    A["Register / Login"] --> B["Authenticated Session"]
    B --> C["Dashboard"]
    C --> D["Income + Expenses"]
    D --> E["Categories + Budgets"]
    E --> F["Tax Estimation"]
    F --> G["Monthly / Quarterly Analysis"]
    G --> H["Reports"]
    H --> I["CSV / PDF Export"]

🛠️ Technology Stack

Frontend

Technology

Purpose

Angular 22

Frontend framework

TypeScript

Application development

Angular Router

Page navigation

Angular Forms

Form handling

RxJS

Reactive programming

HTML5

UI structure

CSS3

UI styling

jsPDF

PDF generation

jsPDF AutoTable

PDF tables

Backend

Technology

Purpose

Node.js

Server runtime

Express.js 5

REST API

Express Session

Session authentication

CORS

Frontend/backend communication

dotenv

Environment configuration

bcrypt

Password hashing

mysql2

MySQL connectivity

JSON Web Token support

Authentication infrastructure

Database

MySQL

Relational database design

Foreign-key relationships

Cascading user-data deletion

📁 Repository Structure

Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── reportController.js
│   │   ├── taxcontroller.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── budgetmodel.js
│   │   ├── reportModel.js
│   │   ├── taxmodel.js
│   │   ├── transactionModel.js
│   │   └── usermodel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taxroutes.js
│   │   └── transactionRoutes.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── readme.md
│   └── server.js
│
├── database/
│   └── databasem1.sql
│
└── frontend/
    └── frontend/
        ├── public/
        ├── src/
        │   ├── app/
        │   │   ├── core/
        │   │   ├── features/
        │   │   └── shared/
        │   ├── index.html
        │   ├── main.ts
        │   └── styles.css
        ├── angular.json
        ├── package.json
        ├── package-lock.json
        └── tsconfig.json

📦 Main Application Areas

Area

Purpose

Backend/config

Database configuration

Backend/controllers

API request handling and application logic

Backend/models

MySQL queries and data access

Backend/routes

REST API endpoint definitions

Backend/middleware

Authentication middleware

database

MySQL database initialization script

frontend/frontend/src/app/core

Shared models, data and services

frontend/frontend/src/app/features

Feature modules and screens

frontend/frontend/src/app/shared

Shared layout and route guards

🗄️ Database Design

Database

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

🔗 Relationships

                    users
                      │
       ┌──────────────┼──────────────┬──────────────┐
       │              │              │              │
       ▼              ▼              ▼              ▼
transactions      budgets      tax_estimates     alerts
       │
       │
       ▼
    reports

User-related records use foreign keys with cascading deletion.

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

🔒 Password hashing using bcrypt

🍪 HTTP-only session cookies

🛡️ Protected frontend routes

🔐 Authenticated backend operations

👤 User-specific database queries

🔑 Database credentials stored in .env

🚫 .env excluded through .gitignore

⚠️ Never commit your real .env file or database password to GitHub.

💰 Income & Expense Management

Transactions are stored using:

Transaction
├── User
├── Type
├── Category
├── Amount
└── Date

Supported Transaction Types

income

expense

The dashboard and reporting system use transaction records to calculate financial summaries.

📊 Budget Management

Users can create budgets based on categories and months.

Budget Capabilities

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

Input

Description

Country

Tax jurisdiction

State / Region

Regional selection where applicable

Filing Status

Filing-status selection

Quarter

Tax quarter

Gross Income

Quarterly income

Business Expenses

Deductible business expenses

Retirement Contributions

Retirement contribution input

Health Insurance

Health insurance premium input

Home Office

Home-office deduction input

🇺🇸 U.S. Detailed Calculation

For supported U.S. scenarios, TaxPal derives:

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

🌍 Simplified Calculation

For supported non-detailed scenarios, TaxPal calculates a simplified taxable amount and estimated tax using the configured generic-rate approach.

📅 Tax Calendar

The application provides quarterly tax-calendar information to help users identify estimated-tax periods and due dates.

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

Field

Description

Month

Reporting month

Income

Total income

Expense

Total expenses

Net Savings

Income minus expenses

Transaction Count

Number of transactions

Quarterly Breakdown

Displays:

Field

Description

Quarter

Q1–Q4

Income

Total income

Expense

Total expenses

Net Savings

Income minus expenses

Transaction Count

Number of transactions

📤 Export Features

CSV Export

The backend supports CSV export containing:

Date, Type, Category, Amount

Example:

"Date","Type","Category","Amount"
"2026-09-07","income","Investment","5000.00"
"2026-09-07","expense","Rent","4000.00"

PDF Export

The Angular frontend can generate formatted PDF reports using:

jsPDF

jsPDF AutoTable

Reports can also be printed directly from the application.

🔌 REST API

Base URL

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

1. Clone the Repository

git clone https://github.com/springboardmentor87/Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers-.git
cd Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers-

2. Configure MySQL

Start MySQL and create the database:

mysql -u root -p

Import the database script:

SOURCE path/to/database/databasem1.sql;

Verify the database:

SHOW DATABASES;
USE taxpal;
SHOW TABLES;

You should see the TaxPal tables.

3. Configure Backend

Open a terminal:

cd Backend
npm install

Create:

Backend/.env

Use your own local credentials:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taxpal
SESSION_SECRET=your_session_secret

⚠️ Keep .env private. Do not commit it to GitHub.

4. Start Backend

From the Backend directory:

node server.js

Expected output:

MySQL Connected
Server running on port 5000

5. Start Frontend

Open a second terminal:

cd frontend/frontend
npm install
ng serve

Open:

http://localhost:4200

🧪 Recommended Panel Demonstration

Use the following sequence for a smooth project presentation:

                    TAXPAL DEMO
                         │
                         ▼
                 👤 Create Account
                         │
                         ▼
                      🔐 Login
                         │
                         ▼
                    📊 Dashboard
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        💰 Add Income          💳 Add Expense
              │                     │
              └──────────┬──────────┘
                         ▼
                    🗂️ Categories
                         │
                         ▼
                     📊 Budget
                         │
                         ▼
                  🧮 Tax Estimator
                         │
                         ▼
                     Tax Result
                         │
                         ▼
                    📑 Reports
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       Monthly Report       Quarterly Report
              │                     │
              └──────────┬──────────┘
                         ▼
                  📤 CSV / PDF Export

Suggested Demo Steps

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

Show financial summary

Show monthly and quarterly breakdowns

Export CSV

Generate or preview PDF

Show report history

📌 Example Report Calculation

Suppose a user records:

Income  = 5,000
Expense = 4,000

The financial summary becomes:

Metric

Value

💰 Total Income

5,000

💳 Total Expense

4,000

📈 Net Savings

1,000

The reporting module calculates these values from transaction records stored in MySQL.

🧩 Backend Architecture

TaxPal follows a Controller → Model → Database architecture supported by REST routes.

Client Request
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

Layer

Responsibility

Routes

Define API endpoints

Controllers

Validate requests, authenticate users, coordinate logic

Models

Execute database queries

Database

Permanently store application data

🎨 Frontend Architecture

The Angular application is organized into reusable feature areas:

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

This separation keeps reusable business communication and application logic outside individual UI components.

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

1. 🔗 One Connected Workflow

TaxPal connects:

Transactions → Budgets → Taxes → Reports

rather than treating them as separate tools.

2. 👨‍💻 Freelancer-Focused

The application is designed around the irregular income and expense patterns commonly associated with freelance work.

3. 📈 Actionable Financial View

Users can move from raw financial activity to:

Financial Activity
       ↓
Budget Awareness
       ↓
Tax Planning
       ↓
Financial Reporting

4. 🧑‍💻 Full-Stack Implementation

The project demonstrates:

Angular frontend

Node.js backend

Express REST APIs

MySQL database

Session authentication

Tax calculation logic

Report generation

CSV/PDF export

Frontend/backend integration

🔮 Future Enhancements

Potential improvements include:

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

Frontend  → http://localhost:4200
Backend   → http://localhost:5000
Database  → MySQL / taxpal

👥 Team Project

Project: TaxPal — Personal Finance & Tax Estimator for Freelancers

Repository: springboardmentor87/Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers-

The project demonstrates collaborative full-stack development across:

Frontend development

Backend API development

Database design

Authentication

Financial calculations

Reporting

Testing and integration

🎤 Panel Presentation — Quick Explanation

“TaxPal is a full-stack personal finance and tax estimation platform designed for freelancers. It allows users to manage income and expenses, organize spending with categories and budgets, estimate quarterly taxes, and generate financial reports. The Angular frontend communicates with an Express and Node.js backend, while MySQL provides persistent storage. TaxPal connects the complete workflow from transaction tracking to budgeting, tax planning, and reporting.”

⭐ One-Line Summary

TaxPal turns everyday financial transactions into organized budgets, tax estimates, and actionable financial reports.

📊 Project Status

Feature

Status

🔐 Authentication

✅ Complete

💰 Transactions

✅ Complete

🗂️ Categories

✅ Complete

📊 Budgeting

✅ Complete

🧮 Tax Estimation

✅ Complete

📅 Tax Calendar

✅ Complete

📑 Financial Reports

✅ Complete

📈 Monthly Analysis

✅ Complete

📊 Quarterly Analysis

✅ Complete

📤 CSV Export

✅ Complete

📄 PDF Export

✅ Complete

🗃️ Report History

✅ Complete

🗄️ MySQL Integration

✅ Complete

<div align="center">

💼 TaxPal

Simplifying Finance for Freelancers

Track • Budget • Estimate Taxes • Report

</div>
