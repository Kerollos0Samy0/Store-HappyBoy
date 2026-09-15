import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import HeroAdminClient from "./HeroAdminClient";

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

export const revalidate = 0;

export default async function HeroAdminPage() {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);
  
  let allProducts: any[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (Number(data.modelNumber) < 1000) {
      allProducts.push({ id: doc.id, ...data });
    }
  });

  allProducts.sort((a, b) => Number(b.modelNumber) - Number(a.modelNumber));

  const combos = [
    { c: "ولادي", s: "بيبي", label: "بيبي ولادي" },
    { c: "ولادي", s: "وسط", label: "وسط ولادي" },
    { c: "ولادي", s: "محير", label: "محير ولادي" },
    { c: "بناتي", s: "بيبي", label: "بيبي بناتي" },
    { c: "بناتي", s: "وسط", label: "وسط بناتي" },
    { c: "بناتي", s: "محير", label: "محير بناتي" }
  ];

  let heroImages: string[] = [];
  let labels: string[] = [];

  combos.forEach(combo => {
    const matches = allProducts.filter(p => p.mainCategory === combo.c && p.subCategory === combo.s && p.mainImage);
    if (matches.length > 0) {
      heroImages.push(matches[0].mainImage);
      labels.push(combo.label);
    }
  });

  while (heroImages.length > 0 && heroImages.length < 6) {
    heroImages.push(heroImages[0]);
    labels.push(labels[0]);
  }

  // Fetch saved offsets
  let savedOffsets = [-25, -15, -15, -25, -15, -5];
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "hero"));
    if (settingsDoc.exists() && settingsDoc.data().offsets) {
      savedOffsets = settingsDoc.data().offsets;
    }
  } catch(e) {}

  return <HeroAdminClient initialImages={heroImages} initialLabels={labels} initialOffsets={savedOffsets} />;
}
