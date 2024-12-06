Intructions:
   Install MariaDB and Node.Js
   Download nNde.js here: https://nodejs.org/en/download/package-manager
   Download MariaDb here: https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.5.2&os=windows&cpu=x86_64&pkg=msi&mirror=archive 
     In the proper directory (ex: C:\Users\ethan\NodeJs\inventory-system), run:
      npm install mariadb
      npm install express
      npm install bcryptjs
   Create database in MariaDB using tables.txt as reference
      You will have to create a user and grant them all privileges in the database
      In Database.js, change it to have the username and password of the user you just created
      Remember when populating the users table, the passwords should be hashed
      Use the hashPasswords.js script to hash the passwords mentioned at the bottom of this document
   To launch website:
      Go to correct directory (ex: C:\Users\ethan\NodeJs\inventory-system) and run: 
         node App.js
      Then, go to http://localhost:3000


express: A web framework for building APIs and web applications.
mariadb: A library for connecting your Node.js application to a MariaDB database.
bcryptjs: A library for hashing passwords securely.

Login Information:

Admin - test
username: admin
password: admin123

Manager - E P
username: manager
password: manager123

Employee - test
username: employee
password: employee123
