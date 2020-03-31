# Expense Tracker
Built by 
- [Node.js](https://nodejs.org/en/)
- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [method-override](https://www.npmjs.com/package/method-override)
- [Passport](https://www.npmjs.com/package/passport)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [sequelize](https://www.npmjs.com/package/sequelize)
- [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)

## Project Preview
#### Login
![Project Preview](/public/image/expense-tracker_preview.PNG)

#### Show all records
![Project Preview](/public/image/expense-tracker_preview_3.PNG)

## Features
- MySQL
- CRUD: Create, Read, Update, and Delete
- Alert when Delete
- Soft delete in database
- Search
- Sort
- Passport
- bcrypt
- Facebook login & Google login
- Store Facebook & Google's ID & SECRET by dotenv .env
- Partial template

| Method     | URL        | Action     |
|:----------:| ---------- | ---------- |
| GET        | /          | homepage   |
| GET        | /record     | get all records |
| GET        | /record/new | get create page |
| POST       | /record     | create record   |
| GET        | /record/:id/edit | get update page |
| PUT        | /record/:id | update record |
| DELETE     | /record/:id | delete record |
| GET        | /users/login    | get login page   |
| POST       | /users/login    | login   |
| GET        | /users/register | get register page   |
| POST       | /users/register | register   |
| GET        | /users/logout   | logout   |
| GET        | /auth/facebook  | login by Facebook   |
| GET        | /auth/facebook/callback   | Facebook login callback   |
| GET        | /auth/google    | login by Google   |
| GET        | /auth/google/callback     | Google login callback   |

## Installing
1. clone the project
>git clone https://github.com/TimMKChang/AC_S3_expense-tracker-mysql.git

2. install packages
>npm install

3. run the server
>npm run start

It will run user and restaurant seeder and launch the server.

| email    | password | 
|----------|----------|
|user1@example.com|123456|

4. check in cmd
>App is listening on [localhost:3000](http://localhost:3000)

## Contributor
<a href="https://github.com/TimMKChang" target="_blank">Tim Chang</a>
