/**
 * setCors.js
 * Run this ONCE to configure Firebase Storage CORS so that browsers
 * from localhost (dev) and the production domain can upload files.
 *
 * Prerequisites:
 *   1.  Download a Firebase Admin SDK service account key:
 *         Firebase Console → Project Settings → Service Accounts → Generate new private key
 *         Save the JSON file as: serviceAccountKey.json  (in the project root)
 *
 *   2.  Run:  node setCors.js
 *
 * This uses the Google Cloud Storage XML/JSON API via firebase-admin.
 */

const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

// ── 1.  Load service account ──────────────────────────────────────────────────
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error('\n❌  serviceAccountKey.json not found!');
  console.error('   Download it from: Firebase Console → Project Settings → Service Accounts');
  console.error('   → "Generate new private key" → save as serviceAccountKey.json in project root\n');
  process.exit(1);
}

const serviceAccount = require(keyPath);

// ── 2.  Init firebase-admin ───────────────────────────────────────────────────
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'ndases.appspot.com'   // ← must match firebase.js storageBucket
});

// ── 3.  CORS config to apply ──────────────────────────────────────────────────
const CORS_CONFIG = [
  {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:4173',
      'https://ndases.web.app',
      'https://ndases.firebaseapp.com'
    ],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    responseHeader: [
      'Content-Type',
      'Authorization',
      'Content-Length',
      'User-Agent',
      'x-goog-resumable',
      'x-goog-meta-firebaseStorageDownloadTokens'
    ],
    maxAgeSeconds: 3600
  }
];

// ── 4.  Apply CORS ────────────────────────────────────────────────────────────
async function applyCors() {
  console.log('\n🔧  Setting Firebase Storage CORS…');
  try {
    const bucket = admin.storage().bucket();
    await bucket.setCorsConfiguration(CORS_CONFIG);
    console.log('✅  CORS configuration applied successfully!');
    console.log('    Bucket:', bucket.name);
    console.log('\n    Origins allowed:');
    CORS_CONFIG[0].origin.forEach(o => console.log('    •', o));
    console.log('\n    You can now upload images from localhost without CORS errors.\n');
  } catch (err) {
    console.error('\n❌  Failed to set CORS:', err.message);
    if (err.message.includes('storage.buckets.update')) {
      console.error('   The service account does not have "Storage Admin" or "Editor" role.');
      console.error('   Go to: Google Cloud Console → IAM → find your service account → add "Storage Admin" role.\n');
    }
    process.exit(1);
  }
}

applyCors();
