const { sequelize } = require('./src/models');

async function sync() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

sync();
