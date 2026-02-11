require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log
    }
);

async function addGenderColumn() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database\n');

        // Check if column exists
        const [columns] = await sequelize.query("SHOW COLUMNS FROM employees LIKE 'gender'");

        if (columns.length === 0) {
            console.log('Adding gender column...');
            await sequelize.query('ALTER TABLE employees ADD COLUMN gender VARCHAR(255)');
            console.log('✓ Gender column added\n');
        } else {
            console.log('Gender column already exists\n');
        }

        // Now update employees
        const [employees] = await sequelize.query('SELECT * FROM employees');
        console.log(`Updating ${employees.length} employees...\n`);

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
        const [stats] = await sequelize.query("SELECT gender, COUNT(*) as count FROM employees GROUP BY gender");
        console.log('\n=== Gender Distribution ===');
        stats.forEach(row => {
            console.log(`${row.gender}: ${row.count}`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

addGenderColumn();
