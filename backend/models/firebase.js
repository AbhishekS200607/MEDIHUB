const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Helper: Get next token number (atomic increment with daily reset)
async function getNextToken(doctorId, date) {
  const tokenRef = db.collection('tokens').doc(`${doctorId}_${date}`);
  
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(tokenRef);
    
    if (!doc.exists) {
      transaction.set(tokenRef, { current: 1, date, doctorId });
      return 1;
    }
    
    const newToken = doc.data().current + 1;
    transaction.update(tokenRef, { current: newToken });
    return newToken;
  });
}

// Helper: Get current token for doctor
async function getCurrentToken(doctorId, date) {
  const tokenRef = db.collection('tokens').doc(`${doctorId}_${date}`);
  const doc = await tokenRef.get();
  return doc.exists ? doc.data().current : 0;
}

// Helper: Reset tokens (can be called via cron)
async function resetDailyTokens() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const oldTokens = await db.collection('tokens')
    .where('date', '<=', yesterdayStr)
    .get();
  
  const batch = db.batch();
  oldTokens.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}

module.exports = {
  admin,
  db,
  auth,
  getNextToken,
  getCurrentToken,
  resetDailyTokens
};
