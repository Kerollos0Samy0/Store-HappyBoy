import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";

// Initialize Firebase securely
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

export const revalidate = 60; // Revalidate every 60 seconds

async function getProduct(id: string) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as any;
  }
  return null;
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        الموديل غير موجود.
        <br />
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Product Image (Placeholder) */}
        <div className="md:w-1/2 bg-gray-100 h-96 md:h-auto flex items-center justify-center border-b md:border-b-0 md:border-l border-gray-100">
           <span className="text-gray-400 text-xl">سيتم وضع صورة الموديل ({product.modelNumber}) هنا</span>
        </div>

        {/* Product Details & Form */}
        <div className="md:w-1/2 p-8 lg:p-12">
          <p className="text-blue-600 font-bold mb-2">رقم الموديل: {product.modelNumber}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-gray-900 mb-8 border-b pb-6">{product.price} ج.م</p>

          <ProductForm product={product} />
        </div>
      </div>
    </div>
  );
}
