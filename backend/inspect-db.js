require('dotenv').config();
const db = require('./models');

async function inspectData() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const employees = await db.employee.findAll();
        console.log('--- Employee Data Inspection ---');
        if (employees.length === 0) {
            console.log('No employees found in the database.');
        }
        employees.forEach(emp => {
            console.log(`ID: ${emp.id}, Name: ${emp.firstName} ${emp.lastName}, Gender: '${emp.gender}', Position: ${emp.position}`);
        });
        console.log('--- End Inspection ---');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await db.sequelize.close(); // Ensure connection closes
    }
}

inspectData();
