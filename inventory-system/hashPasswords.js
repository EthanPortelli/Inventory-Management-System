const bcrypt = require('bcryptjs');

// Plain text passwords
const adminPassword = 'admin123';
const employeePassword = 'employee123';

// Hashing function for admin password
bcrypt.hash(adminPassword, 10, (err, hashedAdminPassword) => {
    if (err) throw err;
    console.log('Hashed Admin Password:', hashedAdminPassword);
    
    // You can now use this hashed password in your SQL query or insert it into your DB
});

// Hashing function for employee password
bcrypt.hash(employeePassword, 10, (err, hashedEmployeePassword) => {
    if (err) throw err;
    console.log('Hashed Employee Password:', hashedEmployeePassword);
    
    // You can now use this hashed password in your SQL query or insert it into your DB
});
