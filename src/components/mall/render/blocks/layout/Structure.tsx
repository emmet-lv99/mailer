
export function LiveHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-main)] border-b border-[var(--bg-sub)] h-16 transition-colors">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-bold opacity-90">
             M
           </div>
           <span className="font-bold text-xl font-[family-name:var(--font-display)] text-[var(--brand-primary)]">
             MALL DEMO
           </span>
        </div>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-body)] opacity-80">
           <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">NEW</a>
           <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">BEST</a>
           <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">SALE</a>
           <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">EVENT</a>
        </nav>

        {/* Icons */}
        <div className="flex gap-4 text-[var(--text-title)]">
           <div className="w-5 h-5 rounded border border-current opacity-40" />
           <div className="w-5 h-5 rounded border border-current opacity-40" />
        </div>
      </div>
    </header>
  );
}

export function LiveFooter() {
  return (
    <footer className="bg-[var(--bg-sub)] border-t border-[var(--bg-sub)] py-16 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
         <div className="space-y-4">
            <div className="font-bold text-lg font-[family-name:var(--font-display)] text-[var(--brand-primary)]">
             MALL DEMO
           </div>
           <p className="text-sm opacity-60 leading-relaxed max-w-xs">
             We provide the best shopping experience for you. 
             Premium quality, reasonable price.
           </p>
         </div>
         
         <div>
            <h4 className="font-bold mb-4">SHOP</h4>
            <ul className="space-y-2 text-sm opacity-60">
               <li>New Arrivals</li>
               <li>Best Sellers</li>
               <li>Sale Items</li>
            </ul>
         </div>

         <div>
            <h4 className="font-bold mb-4">SUPPORT</h4>
            <ul className="space-y-2 text-sm opacity-60">
               <li>Help Center</li>
               <li>Shipping</li>
               <li>Returns</li>
            </ul>
         </div>

         <div>
            <h4 className="font-bold mb-4">CONTACT</h4>
            <ul className="space-y-2 text-sm opacity-60">
               <li>cs@example.com</li>
               <li>+82 10-0000-0000</li>
               <li>Seoul, Korea</li>
            </ul>
         </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-black/5 text-center text-xs opacity-40">
        © 2024 Mall Design Engine. All rights reserved.
      </div>
    </footer>
  );
}
