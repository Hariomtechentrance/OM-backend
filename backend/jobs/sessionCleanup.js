const User = require('../models/User');

// Clean expired sessions - call this function periodically
const cleanupExpiredSessions = async () => {
  try {
    console.log('Running session cleanup job...');
    
    // Clean expired refresh tokens from all users
    const result = await User.updateMany(
      { 'refreshTokens.expiresAt': { $lt: new Date() } },
      { 
        $pull: { 
          refreshTokens: { 
            expiresAt: { $lt: new Date() } 
          } 
        } 
      }
    );
    
    console.log(`Cleaned up expired sessions. Modified ${result.modifiedCount} user records.`);
    return result;
    
  } catch (error) {
    console.error('Error in session cleanup job:', error);
    throw error;
  }
};

// Clean up inactive users (no login for 30 days)
const cleanupInactiveUsers = async () => {
  try {
    console.log('Running inactive user cleanup job...');
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await User.updateMany(
      { 
        lastLogin: { $lt: thirtyDaysAgo },
        isActive: true 
      },
      { 
        $set: { 
          isActive: false,
          deactivationReason: 'Inactive for 30 days'
        }
      }
    );
    
    console.log(`Deactivated ${result.modifiedCount} inactive users.`);
    return result;
    
  } catch (error) {
    console.error('Error in inactive user cleanup job:', error);
    throw error;
  }
};

// Manual cleanup function - can be called from server.js
const runCleanup = async () => {
  try {
    await cleanupExpiredSessions();
    await cleanupInactiveUsers();
    console.log('All cleanup jobs completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// Set up interval-based cleanup (runs every hour)
const startCleanupScheduler = () => {
  // Run cleanup immediately on start
  runCleanup();
  
  // Then run every hour
  setInterval(runCleanup, 60 * 60 * 1000); // 1 hour in milliseconds
};

module.exports = {
  cleanupExpiredSessions,
  cleanupInactiveUsers,
  runCleanup,
  startCleanupScheduler
};
