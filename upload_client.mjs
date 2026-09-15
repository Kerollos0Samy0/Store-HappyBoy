import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(l => {
  const m = l.match(/^([^=]+)="?([^"]*)"?$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

async function run() {
  const mappingPath = path.join(process.cwd(), 'public', 'mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const models = Object.keys(mapping);
  let uploaded = 0;

  for (const modelNumber of models) {
    const modelData = mapping[modelNumber];
    const snapshot = await getDocs(query(collection(db, 'products'), where('modelNumber', '==', String(modelNumber))));
    
    if (snapshot.empty) continue;
    
    const docRef = doc(db, 'products', snapshot.docs[0].id);
    const prodData = snapshot.docs[0].data();
    const colorImages = prodData.colorImages || {};
    let updated = false;

    for (const img of modelData.images) {
      if (!img.color) continue;
      
      const localFilePath = path.join(process.cwd(), 'public', img.path);
      const destination = `products/${modelNumber}/${img.color}-${Date.now()}.jpg`;
      
      try {
        const buffer = fs.readFileSync(localFilePath);
        const storageRef = ref(storage, destination);
        await uploadBytes(storageRef, buffer, { contentType: 'image/jpeg' });
        const url = await getDownloadURL(storageRef);
        colorImages[img.color] = url;
        updated = true;
        uploaded++;
        console.log(`Uploaded ${modelNumber} - ${img.color}: ${url}`);
      } catch (e) {
        console.error(`[appspot.com] Failed to upload ${localFilePath}:`, e.message);
      }
    }

    if (updated) {
      await updateDoc(docRef, { colorImages, mainImage: Object.values(colorImages)[0] });
    }
  }

  console.log(`Done! Uploaded ${uploaded} images.`);
}

run().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});