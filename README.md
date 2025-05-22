# How to Setup

## Prerequisites

1. Git
2. Node.js (v.18 higher)
   - to check, type "node -v" on terminal
3. PostgreSQL Client (optional)

## Initialize

1. Cloning
   1. On terminal, type "git clone https://github.com/DainzT/inventory-management-system.git"
   2. cd inventory-management-system

## Install Dependencies

1. cd backend
   - **npm install**
2. cd frontend
   - **npm install**

## Running

1. on root
   - **npm run dev**

2. cd backend
   - **npm run dev** (http://localhost:3000)
   - for testing:
     - **npm run test**
       
3. cd frontend

   - **npm run dev** (http://localhost:5173)
   - for testing:
     - **npm run test:e2e** (for e2e testing)
     - **npm run storybook** (for component visual testing)

### Generating Tables
   - **npx prisma generate**
