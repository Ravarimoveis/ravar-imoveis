import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LogoPlaceholder } from './LogoPlaceholder';

export function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Logo paths from public folder
  const logoBranco = '/logo-ravar-branco.png';
  const logoColorido = '/logo-ravar-colorido.png';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled || !isHome ? 'bg-white py-4 border-b border-gray-100 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-4 sm:px-6 md:px-10 flex justify-between items-center text-left">
          <Link to="/" className="flex items-center cursor-pointer group no-underline">
            {logoError ? (
              <LogoPlaceholder 
                variant={scrolled || !isHome ? 'colored' : 'white'} 
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto transition-all duration-700"
              />
            ) : (
              <img 
                src={scrolled || !isHome ? logoColorido : logoBranco} 
                alt="RAVAR Imóveis Selecionados" 
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain transition-all duration-700"
                onError={() => setLogoError(true)}
              />
            )}
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
            <Link to="/contato" className={`px-8 py-2.5 rounded-full text-[9px] font-light tracking-widest transition-all border ${scrolled ? 'bg-[#0A1929] text-white border-[#0A1929] hover:bg-[#AF9042] hover:border-[#AF9042]' : 'bg-[#AF9042] text-white border-[#AF9042] hover:bg-white hover:text-[#0A1929] hover:border-[#0A1929]'}`}>
              CONTATO
            </Link>
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
          <div className="absolute top-10 left-10">
            {logoError ? (
              <LogoPlaceholder 
                variant="white" 
                className="h-16 sm:h-20 w-auto"
              />
            ) : (
              <img 
                src={logoBranco} 
                alt="RAVAR" 
                className="h-16 sm:h-20 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </div>
          {[
            {label: 'Home', to: '/'},
            {label: 'Explorar', to: '/explorar'},
            {label: 'Comprar', to: '/explorar?type=venda'},
            {label: 'Alugar', to: '/explorar?type=aluguel'},
            {label: 'Anunciar', to: '/anunciar'},
            {label: 'Contato', to: '/contato'}
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