import Link from 'next/link';

export default function Header() {
 return (
  <header className="w-full bg-white shadow-sm border-b border-gray-200">
   <div className="container mx-auto  px-4 md:px-8 py-4">
    <div className="flex items-center justify-between">
     {/* Left side - Branding */}
     <div className="flex items-center">
      <h1 className="text-2xl font-bold text-gray-900">
       <Link href="/">
        MosaicMind
        {/* <span className="text-indigo-600">MosaicMind</span>Comprehensive */}
       </Link>
      </h1>
     </div>

     {/* Right side - Get Started button */}
     <div className="flex items-center">
      <Link
       href="/test"
       className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
       Get Started
      </Link>
     </div>
    </div>
   </div>
  </header>
 );
}
