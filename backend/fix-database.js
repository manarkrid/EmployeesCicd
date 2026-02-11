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

async function fixDatabase() {
    try {
        await sequelize.authenticate();
        console.log('\n✓ Connected to database');

        // First, show current state
        console.log('\n--- BEFORE UPDATE ---');
        const [before] = await sequelize.query('SELECT id, firstName, lastName, gender FROM employees');
        before.forEach(emp => console.log(`ID ${emp.id}: ${emp.firstName} ${emp.lastName} - Gender: '${emp.gender}'`));

        // Update all employees
        console.log('\n--- UPDATING ---');
        const updateQuery = `
      UPDATE employees 
      SET gender = CASE 
        WHEN MOD(id, 2) = 0 THEN 'Homme' 
        ELSE 'Femme' 
      END
    `;
        await sequelize.query(updateQuery);
        console.log('✓ Update completed');

        // Show final state
        console.log('\n--- AFTER UPDATE ---');
        const [after] = await sequelize.query('SELECT id, firstName, lastName, gender FROM employees');
        after.forEach(emp => console.log(`ID ${emp.id}: ${emp.firstName} ${emp.lastName} - Gender: ${emp.gender}`));

        // Stats
        const [stats] = await sequelize.query(`
      SELECT gender, COUNT(*) as count 
      FROM employees 
      GROUP BY gender
    `);
        console.log('\n=== FINAL STATS ===');
        stats.forEach(row => console.log(`${row.gender}: ${row.count}`));

        console.log('\n✅ SUCCESS! Now restart your backend server and refresh the page.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

fixDatabase();
