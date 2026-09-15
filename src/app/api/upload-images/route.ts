import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

export async function GET() {
  const mappingPath = path.join(process.cwd(), 'public', 'mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const models = Object.keys(mapping);
  let uploaded = 0;

  for (const modelNumber of models) {
    const modelData = mapping[modelNumber];
    const snapshot = await getDocs(query(collection(db, 'products'), where('modelNumber', '==', String(modelNumber))));
    
    if (snapshot.empty) continue;
    
    const docRef = snapshot.docs[0].ref;
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
        console.log(`Uploaded ${modelNumber} - ${img.color}`);
      } catch (e) {
        console.error(`Failed to upload ${localFilePath}:`, e);
      }
    }

    if (updated) {
      await updateDoc(docRef, { colorImages, mainImage: Object.values(colorImages)[0] });
    }
  }

  return NextResponse.json({ success: true, uploaded });
}
