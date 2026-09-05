import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

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

async function getProductsByCategory(slug: string[]) {
  const productsRef = collection(db, "products");
  let q;

  // [...slug] maps to our URL structure
  // winter/boys/baby -> ['winter', 'boys', 'baby']
  // sports/middle -> ['sports', 'middle']
  // summer/girls/junior -> ['summer', 'girls', 'junior']

  if (slug[0] === "winter") {
    const mainCat = slug[1] === "boys" ? "ولادي" : "بناتي";
    let subCat = "";
    if (slug[2] === "baby") subCat = "بيبي";
    if (slug[2] === "middle") subCat = "وسط";
    if (slug[2] === "junior") subCat = "محير";

    q = query(
      productsRef,
      where("mainCategory", "==", mainCat),
      where("subCategory", "==", subCat)
    );
  } else if (slug[0] === "sports") {
    const subCat = slug[1] === "middle" ? "وسط" : "محير";
    q = query(
      productsRef,
      where("mainCategory", "==", "رياضي"),
      where("subCategory", "==", subCat)
    );
  } else if (slug[0] === "summer") {
    const gender = slug[1] === "boys" ? "ولادي" : "بناتي";
    const subCat = slug[2] === "middle" ? "وسط" : "محير";
    q = query(
      productsRef,
      where("mainCategory", "==", "سمر ميلتون"),
      where("subCategory", "==", subCat),
      where("gender", "==", gender)
    );
  } else {
    return [];
  }

  const snapshot = await getDocs(q);
  const products: any[] = [];
  snapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });

  return products;
}

function getCategoryTitle(slug: string[]) {
  let title = "";
  if (slug[0] === "winter") title += "شتوي ";
  if (slug[0] === "sports") title += "رياضي ";
  if (slug[0] === "summer") title += "سمر ميلتون ";

  if (slug[1] === "boys") title += "- ولادي ";
  if (slug[1] === "girls") title += "- بناتي ";

  const last = slug[slug.length - 1];
  if (last === "baby") title += "- بيبي";
  if (last === "middle") title += "- وسط";
  if (last === "junior") title += "- محير";

  return title;
}

export default async function CategoryPage({ params }: { params: { slug: string[] } }) {
  const products = await getProductsByCategory(params.slug);
  const title = getCategoryTitle(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">
        {title} ({products.length} موديل)
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          لا توجد موديلات في هذا القسم حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
              <div className="h-64 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {/* Temporary Image Placeholder */}
                <span className="text-gray-400">صورة الموديل {product.modelNumber}</span>
              </div>
              <div className="p-5">
                <p className="text-sm text-blue-600 font-semibold mb-1">{product.modelNumber}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {(product.colors || []).map((c: any, i: number) => (
                    // Only show colors that have positive quantity (or just show all for now to see them)
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {c.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xl font-bold text-gray-900">{product.price} ج.م</span>
                  <Link href={`/product/${product.id}`} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                    التفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
