require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

async function populateGenders() {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        const [employees] = await sequelize.query('SELECT id, firstName, lastName, gender FROM employees');
        console.log(`Found ${employees.length} employees\n`);

        // Update employees with alternating genders
        const genders = ['Homme', 'Femme'];
        for (let i = 0; i < employees.length; i++) {
            const gender = genders[i % 2];
            await sequelize.query(
                'UPDATE employees SET gender = ? WHERE id = ?',
                { replacements: [gender, employees[i].id] }
            );
            console.log(`✓ Updated: ${employees[i].firstName} ${employees[i].lastName} → ${gender}`);
        }

        // Show final distribution
        const [stats] = await sequelize.query("SELECT gender, COUNT(*) as count FROM employees WHERE gender IS NOT NULL GROUP BY gender");
        console.log('\n=== Gender Distribution ===');
        stats.forEach(row => {
            console.log(`${row.gender}: ${row.count} employees`);
        });

        console.log('\n✓ Done! Refresh your home page to see the stats.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

populateGenders();
