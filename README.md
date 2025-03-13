# How to Setup

## Prerequisites

1. Git
2. Node.js (v.18 higher)
   - to check, type "node -v" on terminal
3. Docker Composer (https://docs.docker.com/compose/install/)
   - install link (https://www.docker.com/products/docker-desktop/)
4. PostgreSQL Client (optional)

## Initialize

1. Cloning
   1. On terminal, type "git clone https://github.com/DainzT/inventory-management-system.git"
   2. cd inventory-management-system

## Set up Environmental Variables

1. cd backend
   - Create a ".env" file
   - Add the environment variables to the .env file:
     - DATABASE_URL="postgresql://postgres:newpassword@db:5432/inventory"
     - PORT=3000
2. cd frontend
   - Create a ".env" file

## Install Dependencies

1. cd backend
   - npm install
2. cd frontend
   - npm install

## Running

1. cd {root}
   - docker-compose up --build
2. cd backend
   - npm start (http://localhost:3000)
   - for testing:
     - npm test
3. cd frontend

   - (http://localhost:5173)
   - for testing:

     - npx playwright test

   - #### Running the seed
   - npx prisma db seed

   - #### Adding More Fields
   - npx prisma migrate dev --name add_new_feature
