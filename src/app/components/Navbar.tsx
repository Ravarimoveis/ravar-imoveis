import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled || !isHome ? 'bg-white py-4 border-b border-gray-100 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-10 flex justify-between items-center text-left">
          <Link to="/" className="flex flex-col cursor-pointer group no-underline">
            <span className={`text-2xl font-extralight tracking-[0.4em] transition-colors before:content-none after:content-none ${scrolled || !isHome ? 'text-[#0A1929]' : 'text-white'}`}>RAVAR</span>
            <span className={`text-[8px] font-light tracking-[0.5em] uppercase mt-1 before:content-none after:content-none ${scrolled || !isHome ? 'text-[#AF9042]' : 'text-white/60'}`}>Imóveis Selecionados</span>
          </Link>
          <div className="hidden lg:flex items-center gap-12 text-left">
            {[
              {label: 'Explorar', to: '/explorar'}, 
              {label: 'Comprar', to: '/explorar?type=venda'}, 
              {label: 'Alugar', to: '/explorar?type=aluguel'}, 
              {label: 'Anunciar', to: '/anunciar'}
            ].map((item) => (
              <Link key={item.label} to={item.to} className={`text-[10px] font-light uppercase tracking-[0.3em] transition-all hover:text-[#AF9042] ${scrolled || !isHome ? 'text-[#0A1929]' : 'text-white'}`}>{item.label}</Link>
            ))}
            <button className={`px-8 py-2.5 rounded-full text-[9px] font-light tracking-widest transition-all border ${scrolled ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'bg-[#AF9042] text-white border-[#AF9042]'}`}>
              CONTATO
            </button>
          </div>
          <button className="lg:hidden" onClick={() => setMobileMenu(true)}>
            <Menu className={scrolled || !isHome ? 'text-[#0A1929]' : 'text-white'} />
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="fixed inset-0 z-[110] bg-[#0A1929] flex flex-col items-center justify-center gap-12 text-white">
          <button onClick={() => setMobileMenu(false)} className="absolute top-10 right-10">
            <X size={32} strokeWidth={1} className="text-[#AF9042]"/>
          </button>
          {[
            {label: 'Home', to: '/'},
            {label: 'Explorar', to: '/explorar'},
            {label: 'Comprar', to: '/explorar?type=venda'},
            {label: 'Alugar', to: '/explorar?type=aluguel'},
            {label: 'Anunciar', to: '/anunciar'}
          ].map(item => (
            <Link 
              key={item.to} 
              to={item.to} 
              onClick={() => setMobileMenu(false)}
              className="text-2xl font-extralight uppercase tracking-[0.5em]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}