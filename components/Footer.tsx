export default function Footer() {
 return (
  <footer className="bg-gray-900 text-white">
   <div className="container mx-auto px-4 py-4">
    {/* Bottom Bar */}
    <div className="flex justify-center items-center">
     <p className="text-gray-300 text-sm">
      © {new Date().getFullYear()} MosaicMind. All rights reserved.
     </p>
    </div>
   </div>
  </footer>
 );
}
