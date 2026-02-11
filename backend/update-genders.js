require('dotenv').config();
const db = require('./models');

async function updateGenders() {
    try {
        await db.sequelize.authenticate();
        console.log('Connected to database');

        const employees = await db.employee.findAll();
        console.log(`Found ${employees.length} employees`);

        // Update employees with alternating genders
        for (let i = 0; i < employees.length; i++) {
            const gender = i % 2 === 0 ? 'Homme' : 'Femme';
            await employees[i].update({ gender: gender });
            console.log(`Updated ${employees[i].firstName} ${employees[i].lastName} to ${gender}`);
        }

        console.log('All employees updated!');

        // Verify
        const updated = await db.employee.findAll();
        const maleCount = updated.filter(e => e.gender === 'Homme').length;
        const femaleCount = updated.filter(e => e.gender === 'Femme').length;
        console.log(`\nFinal count: ${maleCount} Hommes, ${femaleCount} Femmes`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await db.sequelize.close();
    }
}

updateGenders();
