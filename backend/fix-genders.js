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

async function updateGenders() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database\n');

        // Get all employees
        const [employees] = await sequelize.query('SELECT * FROM employees');
        console.log(`Found ${employees.length} employees\n`);

        // Update with alternating genders
        const genders = ['Homme', 'Femme'];
        for (let i = 0; i < employees.length; i++) {
            const gender = genders[i % 2];
            await sequelize.query(
                'UPDATE employees SET gender = ? WHERE id = ?',
                { replacements: [gender, employees[i].id] }
            );
            console.log(`✓ ${employees[i].firstName} ${employees[i].lastName} → ${gender}`);
        }

        // Verify
        const [updated] = await sequelize.query("SELECT gender, COUNT(*) as count FROM employees GROUP BY gender");
        console.log('\n=== Final Distribution ===');
        updated.forEach(row => {
            console.log(`${row.gender || 'NULL'}: ${row.count}`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

updateGenders();
