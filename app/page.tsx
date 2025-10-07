import Link from 'next/link';

export default function Home() {
 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
   <div className="container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto text-center">
     <div className="mb-8">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">MosaicMind</h1>
      <p className="text-2xl text-gray-600 mb-8">
       Beyond Personality Types - Discover Your Unique Pattern
      </p>
     </div>

     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
       Why MosaicMind?
      </h2>
      <div className="grid md:grid-cols-3 gap-6 text-left">
       <div className="p-4">
        <h3 className="text-xl font-semibold text-indigo-600 mb-3">
         Multi-Dimensional
        </h3>
        <p className="text-gray-600">
         Move beyond simple categories to explore the complex interplay of your
         personality dimensions.
        </p>
       </div>
       <div className="p-4">
        <h3 className="text-xl font-semibold text-indigo-600 mb-3">
         Visual Insight
        </h3>
        <p className="text-gray-600">
         See your personality as a unique mosaic pattern that captures your
         individual complexity.
        </p>
       </div>
       <div className="p-4">
        <h3 className="text-xl font-semibold text-indigo-600 mb-3">
         Growth Oriented
        </h3>
        <p className="text-gray-600">
         Understand your strengths and opportunities for development through
         nuanced analysis.
        </p>
       </div>
      </div>
     </div>

                 <div className="space-y-6">
                     
      <Link
       href="/test"
       className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
       Take the Assessment
      </Link>
      <div className="text-sm text-gray-500">
       ~15 minutes • 16 questions • Free personalized report
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
