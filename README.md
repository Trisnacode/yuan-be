# Backend Yuan Membership

This application is backend for yuan membership application.
This backend is build with :
- expressJS as it's framework;
- mysql as database
- objection + knex as ORM

## Installation
1. Create .env file based on .env.example
2. Install npm package
`npm install`
3. Run Migration
`knex migration:latest`
4. Run Seeding
`knex seed:run`
5. Run Express
`npm start`