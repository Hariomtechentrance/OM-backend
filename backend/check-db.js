import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/blacklocust')
  .then(async () => {
    console.log('✅ Connected to blacklocust database');

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    console.log('📦 Collections:', collections.map(c => c.name));

    const usersCollection = collections.find(c => c.name === 'users');

    if (usersCollection) {
      console.log('✅ Users collection found');

      const count = await db.collection('users').countDocuments();
      console.log('👤 Users count:', count);

      if (count > 0) {
        const users = await db.collection('users').find({}).limit(3).toArray();

        console.log('🔍 Sample users:');
        users.forEach(user => {
          console.log('- ' + user.email + ' (role: ' + (user.role || 'undefined') + ')');
        });
      }
    } else {
      console.log('❌ Users collection NOT found');
    }

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
