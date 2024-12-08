# Inventory-Management-System
Project 2: Web Based Application

## Disclaimer
- This requires the use of:
- express: A web framework for building APIs and web applications.
- mariadb: A library for connecting your Node.js application to a MariaDB database.
- bcryptjs: A library for hashing passwords securely.
- This project is only ran locally.

## Introduction
- This Project is a Web Based Application attempting to simulate a inventory management system for walmart.
- All necessary files are located in the inventory-system folder

## Run mariaDB using HeidiSQL
- HeidiSQL is a frontend for MariaDB, should come with the installation of MariaDB.
  - Download MariaDb here: https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.5.2&os=windows&cpu=x86_64&pkg=msi&mirror=archive
  - Download Node.js here: https://nodejs.org/en/download/package-manager
- Create a database in MariaDB as per the commands in the tables.txt file.
- Create an admin user in the database to login to (ex: user - admin, pass - admin123)
- Remeber that the password mush be hashed, do so using hashPasswords.js

## Run Server using PowerShell / Command Prompt
- In the proper directory, run: 'npm install mariadb', 'npm install express', 'npm install bcryptjs'
- Run the server with 'node App.js' *Ensure you are in the correct directory*

## Go to http://localhost:3000/ in a web browser
- This will direct you to the login page of the web application.



