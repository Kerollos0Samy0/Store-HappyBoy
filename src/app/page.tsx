import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            مرحباً بك في متجر HappyBoy
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            أحدث وأفضل موديلات الملابس الولادي والبناتي بجودة لا تقارن
          </p>
          <Link 
            href="/category/winter" 
            className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-105 inline-block"
          >
            تسوق الكوليكشن الجديد الآن
          </Link>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="max-w-7xl mx-auto py-16 px-4 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center relative">
          <span className="bg-gray-50 px-4 relative z-10">وصل حديثاً</span>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
              <div className="h-64 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                <span className="text-gray-400">صورة الموديل</span>
              </div>
              <div className="p-5">
                <p className="text-sm text-blue-600 font-semibold mb-1">شتوي - ولادي</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">سوت ولادي أنيق</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-900">350 ج.م</span>
                  <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                    التفاصيل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
