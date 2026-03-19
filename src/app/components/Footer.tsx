import { Link } from 'react-router';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { LogoPlaceholder } from './LogoPlaceholder';
import { useState } from 'react';

export function Footer() {
  const logoBranco = '/logo-ravar-branco.png';
  const [logoError, setLogoError] = useState(false);
  
  return (
    <footer className="bg-[#0A1929] text-white pt-24 pb-12">
      <div className="container mx-auto px-10 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 border-b border-white/5 pb-20">
          <div className="col-span-1">
            {logoError ? (
              <LogoPlaceholder 
                variant="white" 
                className="h-16 sm:h-20 md:h-24 w-auto mb-6"
              />
            ) : (
              <img 
                src={logoBranco} 
                alt="RAVAR Imóveis Selecionados" 
                className="h-16 sm:h-20 md:h-24 w-auto object-contain mb-6"
                onError={() => setLogoError(true)}
              />
            )}
            <p className="text-white/40 font-light text-[11px] leading-relaxed tracking-wider uppercase text-left">
              A definição do morar exclusivo em São Paulo. Curadoria de alto padrão para clientes globais.
            </p>
          </div>
          <div>
            <h4 className="text-[#AF9042] text-[10px] font-medium uppercase tracking-[0.3em] mb-8 italic text-left">Bairros</h4>
            <ul className="text-white/50 text-[11px] font-light flex flex-col gap-4 uppercase tracking-widest text-left">
              {['Itaim Bibi', 'Jardins', 'Pinheiros', 'Higienópolis'].map(b => (
                <li key={b} className="hover:text-[#AF9042] cursor-pointer transition-colors text-left">{b}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#AF9042] text-[10px] font-medium uppercase tracking-[0.3em] mb-8 italic text-left">Serviços</h4>
            <ul className="text-white/50 text-[11px] font-light flex flex-col gap-4 uppercase tracking-widest text-left">
              {['Comprar', 'Alugar', 'Relocation', 'Investir'].map(s => (
                <li key={s} className="hover:text-[#AF9042] cursor-pointer transition-colors text-left">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#AF9042] text-[10px] font-medium uppercase tracking-[0.3em] mb-8 italic text-left">Newsletter</h4>
            <div className="flex border-b border-white/20 pb-2 text-left">
              <input 
                type="email" 
                placeholder="E-mail" 
                className="bg-transparent border-none outline-none text-[11px] w-full placeholder:text-white/20 text-left" 
              />
              <button className="text-[#AF9042] hover:text-white text-left">
                <ArrowRight size={14}/>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-light text-white/30 uppercase tracking-[0.2em] gap-4">
          <p>© 2026 RAVAR IMÓVEIS • CRECI: 158809-F/SP • SÃO PAULO</p>
          <Link to="/admin" className="hover:text-[#AF9042] transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}