const { sequelize } = require('./src/models');

async function sync() {
  try {
    await sequelize.sync({ force: true }); // drops and recreates every table
    console.log('✅ Tables synced (fresh)');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

sync();