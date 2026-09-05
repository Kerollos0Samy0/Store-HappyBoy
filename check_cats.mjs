import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
const db = getFirestore(app);

async function check() {
  const snap = await getDocs(collection(db, 'products'));
  const categories = new Set();
  snap.forEach(doc => {
    const d = doc.data();
    categories.add(`${d.mainCategory} | ${d.subCategory} | ${d.gender} | ${d.name}`);
  });
  console.log(Array.from(categories).slice(0, 20));
  process.exit(0);
}
check();
