const { sequelize, Course, Topic } = require('./src/models');

const seedData = [
  { code: 'CISC 3130', name: 'Data Structures', topics: ['Linked Lists', 'Stacks and Queues', 'Trees', 'Hash Tables', 'Sorting Algorithms'] },
  { code: 'CISC 3115', name: 'Intro to Modern Programming Techniques', topics: ['Object-Oriented Design', 'Inheritance', 'Interfaces'] },
  { code: 'CISC 3140', name: 'Large Scale Web Applications', topics: ['REST APIs', 'Databases', 'Authentication'] }
];

async function seed() {
  try {
    for (const item of seedData) {
      const [course] = await Course.findOrCreate({ where: { code: item.code }, defaults: { name: item.name } });
      for (const title of item.topics) {
        await Topic.findOrCreate({ where: { title, course_id: course.id } });
      }
    }
    console.log('✅ Seed data inserted');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

seed();
