import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, BedDouble, Bath, Square, ChevronRight, ChevronLeft, Menu, X, 
  Phone, Calendar, ArrowRight, Heart, Share2, CheckCircle2, 
  SlidersHorizontal, Minus, Car, ShieldCheck, Dog, Award, 
  Briefcase, Globe, Info, Download, Mail, ChevronDown, Check,
  Image as ImageIcon, Play, Coffee, PlusSquare, Fuel, ShoppingBag,
  Zap, Users, Accessibility, Wifi, Archive
} from 'lucide-react';

// --- DESIGN SYSTEM: RAVA (Azul e Dourado) ---
const COLORS = {
  navy: '#0A1929',      
  gold: '#AF9042',      
  white: '#FFFFFF',
  offWhite: '#FCFCFC',
  border: '#F1F1F1'
};

// --- MOCK DATA COMPLETO (6 IMÓVEIS COM INFRAESTRUTURA DETALHADA) ---
const MOCK_PROPERTIES = [
  {
    id: "RAVA-001",
    title: "Residência Garden Itaim",
    type: "Venda",
    category: "Residencial",
    price: 4500000,
    condo: 2850,
    iptu: 1200,
    area: 180,
    rooms: 3,
    suites: 3,
    baths: 4,
    parking: 3,
    neighborhood: "Itaim Bibi",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    description: "Uma obra-prima de minimalismo e luz natural no coração do Itaim. Este garden privativo oferece o silêncio de uma casa com a segurança de um dos edifícios mais exclusivos de São Paulo. Com projeto assinado, apresenta marcenaria impecável e integração total entre o verde do jardim e o living social.",
    petPolicy: "Aceita Animais de grande porte",
    features: ["Ar Condicionado Central", "Automação Lutron", "Varanda Gourmet", "Pé Direito Duplo", "Mármore Travertino", "Cozinha Gourmet", "Piso em Carvalho Francês", "Blackouts Motorizados", "Sistema de Som Integrado"],
    amenities: ["Concierge 24h", "Piscina Aquecida", "Academia Technogym", "Spa e Sauna", "Segurança Armada", "Vagas de Visitante", "Gerador Total", "Espaço Gourmet", "Wine Lounge", "Bicicletário"],
    conveniences: [
      { id: 1, icon: <Zap size={20} />, label: "Carga Elétrica", desc: "Infraestrutura para carro elétrico" },
      { id: 2, icon: <Users size={20} />, label: "Visitantes", desc: "10 vagas internas dedicadas" },
      { id: 3, icon: <Accessibility size={20} />, label: "Acessível", desc: "Totalmente adaptado para PNE" },
      { id: 4, icon: <Archive size={20} />, label: "Depósito", desc: "Depósito privativo de 6m²" }
    ],
    location_details: "A 300m do Parque do Povo."
  },
  {
    id: "RAVA-002",
    title: "Penthouse Contemporânea",
    type: "Aluguel",
    category: "Corporativo",
    price: 18000,
    condo: 1950,
    iptu: 600,
    area: 145,
    rooms: 2,
    suites: 2,
    baths: 2,
    parking: 2,
    neighborhood: "Pinheiros",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    description: "Vista infinita para o pôr do sol. Uma penthouse desenhada para o estilo de vida cosmopolita, com integração total de ambientes.",
    petPolicy: "Aceita Animais pequenos",
    features: ["Piso em Carvalho", "Ilha de Cocção", "Som Integrado", "Automação Savant", "Blackout Motorizado", "Jacuzzi Privativa", "Terraço Lounge"],
    amenities: ["Rooftop Lounge", "Piscina Infinita", "Coworking Privativo", "Academia de Grife", "Lavanderia VIP", "Pet Care"],
    conveniences: [
        { id: 1, icon: <Wifi size={20} />, label: "Conectividade", desc: "Fibra dedicada no edifício" },
        { id: 2, icon: <Zap size={20} />, label: "Carga Elétrica", desc: "Vaga com carregador instalado" }
    ],
    location_details: "Eixo privilegiado na Faria Lima."
  },
  {
    id: "RAVA-003",
    title: "Villa nos Jardins",
    type: "Venda",
    category: "Investimento",
    price: 12800000,
    condo: 5500,
    iptu: 2400,
    area: 420,
    rooms: 4,
    suites: 4,
    baths: 6,
    parking: 5,
    neighborhood: "Jardins",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "A máxima expressão da sofisticação urbana. Privacidade absoluta em meio ao verde dos Jardins.",
    petPolicy: "Restrição em áreas comuns",
    features: ["Gerador Total", "Cozinha Industrial", "Adega", "Blindagem", "Elevador Privativo", "Aspiração Central", "Aquecimento Solar"],
    amenities: ["Segurança Armada 24h", "Campo de Tênis", "Jardim Burle Marx", "Piscina com Raia 25m", "Espaço Zen", "Sauna Úmida", "Quadra de Squash"],
    conveniences: [
        { id: 1, icon: <ShieldCheck size={20} />, label: "Segurança", desc: "Protocolo diplomático" },
        { id: 2, icon: <Archive size={20} />, label: "Depósito", desc: "Depósito amplo no subsolo" }
    ],
    location_details: "Rua fechada com monitoramento constante."
  },
  {
    id: "RAVA-004",
    title: "Skyline Moema Pássaros",
    type: "Venda",
    category: "Residencial",
    price: 3200000,
    condo: 1800,
    iptu: 750,
    area: 125,
    rooms: 3,
    suites: 2,
    baths: 3,
    parking: 2,
    neighborhood: "Moema",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80",
    description: "Localização ímpar fora da rota de aviões, com vista definitiva para a copa das árvores.",
    petPolicy: "Aceita Animais",
    features: ["Vista Parque", "Varanda Integrada", "Lareira Ecológica", "Suíte Master", "Marcenaria Premium", "Piso Térmico nos Banheiros"],
    amenities: ["Piscina de Vidro", "Sauna Seca", "Ludoteca Design", "Academia Completa", "Salão Gourmet", "Horta Comunitária"],
    conveniences: [{ id: 1, icon: <Zap size={20} />, label: "Carga Elétrica", desc: "Infraestrutura completa" }],
    location_details: "Próximo à Igreja de Moema e Ibirapuera."
  },
  {
    id: "RAVA-005",
    title: "Mansion Vila Nova",
    type: "Aluguel",
    category: "Luxo Extremo",
    price: 45000,
    condo: 6200,
    iptu: 2800,
    area: 380,
    rooms: 4,
    suites: 4,
    baths: 5,
    parking: 4,
    neighborhood: "Vila Nova Conceição",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    description: "Exclusividade no m² mais valioso de São Paulo. Um projeto de neoclássico moderno.",
    petPolicy: "Aceita Animais",
    features: ["Adega Climatizada", "Cozinha Viking", "Dependência completa", "Banheira de Imersão", "Automação Total", "Pé Direito Triplo"],
    amenities: ["Fitness Center", "Piscina Coberta Aquecida", "Concierge 24h", "Segurança Armada", "Espaço Pilates", "Sala de Motoristas"],
    conveniences: [{ id: 1, icon: <Zap size={20} />, label: "Carga Elétrica", desc: "Vaga dedicada com totem" }],
    location_details: "Ao lado da Praça Pereira Coutinho."
  },
  {
    id: "RAVA-006",
    title: "Arte Higienópolis",
    type: "Venda",
    category: "Clássico Modernista",
    price: 5900000,
    condo: 3400,
    iptu: 1500,
    area: 260,
    rooms: 3,
    suites: 3,
    baths: 4,
    parking: 3,
    neighborhood: "Higienópolis",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    description: "Apartamento modernista icônico com janelões do chão ao teto. Planta livre e muita luz natural.",
    petPolicy: "Aceita Animais",
    features: ["Janelas Panorâmicas", "Pé Direito de 3m", "Piso Original em Taco", "Cozinha Aberta", "Despensa", "Lavabo Design"],
    amenities: ["Segurança Armada 24h", "Jardim Interno", "Vagas Visitantes", "Gerador de Energia", "Salão de Festas Clássico"],
    conveniences: [{ id: 1, icon: <Archive size={20} />, label: "Depósito", desc: "Depósito amplo privativo" }],
    location_details: "Frente à Praça Buenos Aires."
  }
];

const NEIGHBORHOOD_PAGES = [
  [
    { id: 'itaim', name: 'Itaim Bibi', size: 'large', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
    { id: 'jardins', name: 'Jardins', size: 'medium', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'pinheiros', name: 'Pinheiros', size: 'small', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
    { id: 'moema', name: 'Moema', size: 'small', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
  ],
  [
    { id: 'vilanova', name: 'Vila Nova Conceição', size: 'large', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80' },
    { id: 'higienopolis', name: 'Higienópolis', size: 'medium', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80' },
    { id: 'brooklin', name: 'Brooklin', size: 'small', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { id: 'alto', name: 'Alto de Pinheiros', size: 'small', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
  ]
];

const formatCurrency = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- REUSABLE COMPONENTS ---

const PropertyCard = ({ prop, navigateTo }) => {
  const isAluguel = prop.type === 'Aluguel';
  const totalValue = isAluguel ? (prop.price + (prop.condo || 0) + (prop.iptu || 0)) : prop.price;
  return (
    <div className="group cursor-pointer text-left" onClick={() => navigateTo('detail', prop)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
        <img src={prop.image} className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105" alt={prop.title} />
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1 text-[8px] font-light uppercase tracking-widest text-[#0A1929] border border-gray-100">{prop.type}</span>
        </div>
        <div className="absolute top-5 right-5">
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-xl">
            <Heart size={16} strokeWidth={1} />
          </button>
        </div>
      </div>
      <div className="flex flex-col px-1 text-left">
        <span className="text-[9px] font-light text-[#AF9042] uppercase tracking-[0.3em] mb-2">{prop.neighborhood}</span>
        <h3 className="text-xl font-extralight text-[#0A1929] mb-4 tracking-tight group-hover:text-[#AF9042] transition-colors">{prop.title}</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-light text-[#0A1929]/60 italic mb-5 text-left">
          <div className="flex items-center gap-1.5"><BedDouble size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.rooms} qts</div>
          <div className="flex items-center gap-1.5"><Bath size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.baths} ban</div>
          <div className="flex items-center gap-1.5"><Car size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.parking} vagas</div>
          <div className="flex items-center gap-1.5"><Square size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.area} m²</div>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#AF9042] mb-1 italic">{isAluguel ? 'Pacote Total Mensal' : 'Valor de Investimento'}</span>
          <span className="text-xl font-light text-[#0A1929] text-left">{formatCurrency(totalValue)}{isAluguel && <span className="text-[10px] ml-1">/mês</span>}</span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('home'); 
  const [selectedProp, setSelectedProp] = useState(null);
  const [searchTab, setSearchTab] = useState('Comprar');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [neighborhoodPage, setNeighborhoodPage] = useState(0);

  // Estados dos Filtros
  const [filterType, setFilterType] = useState('Apartamento');
  const [filterRooms, setFilterRooms] = useState('2+');
  const [filterAmenities, setFilterAmenities] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (newView, data = null) => {
    setView(newView);
    setSelectedProp(data);
    window.scrollTo(0, 0);
    setMobileMenu(false);
    setIsFiltersOpen(false);
  };

  const toggleAmenity = (amenity) => {
    setFilterAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const Navbar = () => (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled || view !== 'home' ? 'bg-white py-4 border-b border-gray-100 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-10 flex justify-between items-center text-left">
        <div className="flex flex-col cursor-pointer group" onClick={() => navigateTo('home')}>
          <span className={`text-2xl font-extralight tracking-[0.4em] transition-colors ${scrolled || view !== 'home' ? 'text-[#0A1929]' : 'text-white'}`}>RAVA</span>
          <span className={`text-[8px] font-light tracking-[0.5em] uppercase mt-1 ${scrolled || view !== 'home' ? 'text-[#AF9042]' : 'text-white/60'}`}>Imóveis Selecionados</span>
        </div>
        <div className="hidden lg:flex items-center gap-12 text-left">
          {[{label: 'Explorar', target: 'search'}, {label: 'Comprar', target: 'search'}, {label: 'Alugar', target: 'search'}, {label: 'Anunciar', target: 'about'}].map((item) => (
            <button key={item.label} onClick={() => navigateTo(item.target)} className={`text-[10px] font-light uppercase tracking-[0.3em] transition-all hover:text-[#AF9042] ${scrolled || view !== 'home' ? 'text-[#0A1929]' : 'text-white'}`}>{item.label}</button>
          ))}
          <button className={`px-8 py-2.5 rounded-full text-[9px] font-light tracking-widest transition-all border ${scrolled ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'bg-[#AF9042] text-white border-[#AF9042]'}`}>
            CONTATO
          </button>
        </div>
        <button className="lg:hidden" onClick={() => setMobileMenu(true)}><Menu className={scrolled || view !== 'home' ? 'text-[#0A1929]' : 'text-white'} /></button>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-[#0A1929] text-white pt-24 pb-12">
      <div className="container mx-auto px-10 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 border-b border-white/5 pb-20">
          <div className="col-span-1"><span className="text-2xl font-extralight tracking-[0.4em] block mb-4">RAVA</span><p className="text-white/40 font-light text-[11px] leading-relaxed tracking-wider uppercase text-left">A definição do morar exclusivo em São Paulo. Curadoria de alto padrão para clientes globais.</p></div>
          <div><h4 className="text-[#AF9042] text-[10px] font-medium uppercase tracking-[0.3em] mb-8 italic text-left">Bairros</h4><ul className="text-white/50 text-[11px] font-light flex flex-col gap-4 uppercase tracking-widest text-left">{['Itaim Bibi', 'Jardins', 'Pinheiros', 'Higienópolis'].map(b => (<li key={b} className="hover:text-[#AF9042] cursor-pointer transition-colors text-left">{b}</li>))}</ul></div>
          <div><h4 className="text-[#AF9042] text-[10px] font-medium uppercase tracking-[0.3em] mb-8 italic text-left">Serviços</h4><ul className="text-white/50 text-[11px] font-light flex flex-col gap-4 uppercase tracking-widest text-left">{['Comprar', 'Alugar', 'Relocation', 'Investir'].map(s => (<li key={s} className="hover:text-[#AF9042] cursor-pointer transition-colors text-left">{s}</li>))}</ul></div>
          <div><h4 className="text-[#AF9042] text-[10px] font-medium uppercase tracking-[0.3em] mb-8 italic text-left">Newsletter</h4><div className="flex border-b border-white/20 pb-2 text-left"><input type="email" placeholder="E-mail" className="bg-transparent border-none outline-none text-[11px] w-full placeholder:text-white/20 text-left" /><button className="text-[#AF9042] hover:text-white text-left"><ArrowRight size={14}/></button></div></div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-light text-white/30 uppercase tracking-[0.2em] gap-4"><p>© 2026 RAVA IMÓVEIS • CRECI 00.000-J • SÃO PAULO</p></div>
      </div>
    </footer>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000 text-left">
      <section className="relative h-[95vh] min-h-[750px] flex items-center justify-center bg-[#0A1929] text-left">
        <div className="absolute inset-0 z-0 overflow-hidden"><img src="https://images.unsplash.com/photo-1483366759333-6bd042b0833b?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover opacity-40 grayscale-[0.2]" alt="Hero" /></div>
        <div className="container mx-auto px-10 relative z-10 text-left">
          <div className="max-w-4xl text-left">
            <span className="text-[#AF9042] text-[10px] font-light uppercase tracking-[0.6em] mb-10 block animate-in slide-in-from-left-4 duration-700">Realizando sonhos</span>
            <h1 className="text-5xl md:text-7xl font-extralight text-white mb-16 leading-[1.2] tracking-tighter text-left">Aqui você encontra o <br /><span className="text-[#AF9042] italic">seu novo lar.</span></h1>
            
            <div className="relative max-w-4xl z-20 text-left">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 md:p-3 rounded-[2rem] flex flex-col md:flex-row items-center gap-2 shadow-2xl text-left">
                <div className="hidden lg:flex items-center px-4 gap-6 text-[9px] font-light text-white/50 uppercase tracking-widest border-r border-white/10 pr-8 text-left">
                  {['Comprar', 'Alugar', 'Investir'].map(tab => (
                    <button key={tab} onClick={() => setSearchTab(tab)} className={`transition-all hover:text-white ${searchTab === tab ? 'text-[#AF9042] font-medium' : ''}`}>{tab}</button>
                  ))}
                </div>
                <div className="flex items-center px-6 gap-3 flex-1 text-left">
                  <MapPin size={18} strokeWidth={1} className="text-[#AF9042]" />
                  <input type="text" placeholder="Bairro, Rua ou Condomínio..." className="bg-transparent border-none outline-none w-full text-white font-light text-sm py-3 placeholder:text-white/30 text-left" />
                </div>
                <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-light uppercase tracking-widest transition-all ${isFiltersOpen ? 'bg-white text-[#0A1929]' : 'text-white/70 hover:text-white'} text-left`}>
                  <SlidersHorizontal size={14} strokeWidth={1} className="text-[#AF9042]" /> <span>Mais Filtros</span> <ChevronDown size={12} className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                <button onClick={() => navigateTo('search')} className="bg-[#AF9042] text-white p-4 rounded-full hover:bg-white hover:text-[#0A1929] transition-all transform hover:scale-105 shadow-xl">
                  <Search size={22} strokeWidth={1.5} />
                </button>
              </div>

              {isFiltersOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] p-10 shadow-2xl border border-gray-100 animate-in slide-in-from-top-4 duration-500 overflow-hidden text-[#0A1929] text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left text-left">
                    <div className="space-y-8">
                      <div><span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left text-left text-left">Pretensão</span><div className="flex gap-2 text-left">{['Comprar', 'Alugar', 'Investir'].map(t => (<button key={t} onClick={() => setSearchTab(t)} className={`flex-1 py-3 text-[9px] uppercase tracking-widest border transition-all ${searchTab === t ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}>{t}</button>))}</div></div>
                      <div><span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left text-left text-left text-left">Tipo de Imóvel</span><div className="grid grid-cols-2 gap-2 text-left">{['Apartamento', 'Casa', 'Condomínio', 'Loft'].map(t => (<button key={t} onClick={() => setFilterType(t)} className={`py-3 text-[9px] uppercase tracking-widest border transition-all ${filterType === t ? 'bg-[#AF9042] text-white border-[#AF9042]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}>{t}</button>))}</div></div>
                    </div>
                    <div className="space-y-8 border-x border-gray-50 px-0 md:px-12 text-left">
                      <div><span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left text-left text-left text-left">Dormitórios</span><div className="flex gap-2 text-left">{['1+', '2+', '3+', '4+'].map(r => (<button key={r} onClick={() => setFilterRooms(r)} className={`flex-1 py-3 text-[10px] font-light border transition-all ${filterRooms === r ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}>{r}</button>))}</div></div>
                      <div><span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left text-left text-left text-left text-left">Investimento Máximo</span><input type="range" min="1000000" max="50000000" className="w-full accent-[#AF9042]" /><div className="flex justify-between text-[10px] text-[#0A1929]/30 font-light mt-2 italic text-left"><span>R$ 1M</span><span>R$ 50M+</span></div></div>
                    </div>
                    <div className="space-y-4 text-left">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left text-left text-left text-left">Amenidades</span>
                      <div className="grid grid-cols-1 gap-3">
                        {['Aceita Pet', 'Piscina', 'Varanda Gourmet', 'Academia', 'Segurança 24h'].map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group text-left">
                            <div onClick={() => toggleAmenity(item)} className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center ${filterAmenities.includes(item) ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}>
                              {filterAmenities.includes(item) && <Check size={10} className="text-white" />}
                            </div>
                            <span className={`text-[11px] font-light uppercase tracking-widest transition-colors ${filterAmenities.includes(item) ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/40 group-hover:text-[#0A1929]'}`}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center text-left text-left">
        <div className="container mx-auto px-10 text-left text-left text-left text-left">
          <div className="flex flex-col items-center text-center mb-24 text-center text-center">
            <Minus className="text-[#AF9042] mb-6 text-center text-center" />
            <h2 className="text-3xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] mb-4 text-center">Destaques</h2>
            <p className="text-[#0A1929]/60 font-light max-w-lg text-[13px] leading-relaxed uppercase tracking-wider italic text-center">Confira os imóveis selecionados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 text-left">
            {MOCK_PROPERTIES.map(prop => (<PropertyCard key={prop.id} prop={prop} navigateTo={navigateTo} />))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white border-t border-gray-50 text-center">
        <div className="container mx-auto px-10">
          <div className="flex flex-col items-center text-center mb-16 text-center text-center"><h2 className="text-3xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] mb-4 text-center">Explore por bairros</h2><Minus className="text-[#AF9042] text-center" /></div>
          <div className="relative group text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] animate-in fade-in duration-700 text-left text-left">
              {NEIGHBORHOOD_PAGES[neighborhoodPage].map((b) => (
                <div key={b.id} className={`relative group overflow-hidden rounded-sm cursor-pointer shadow-lg text-left ${b.size === 'large' ? 'md:col-span-2 md:row-span-2' : b.size === 'medium' ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-1'}`}>
                  <img src={b.img} className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 text-left" alt={b.name} />
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 text-left text-left text-left text-left"><span className="text-[#AF9042] text-[10px] font-light uppercase tracking-[0.4em] text-left">Explorar</span><h3 className="text-white text-3xl font-extralight tracking-widest uppercase">{b.name}</h3></div>
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 z-10 text-left"><button onClick={() => setNeighborhoodPage(0)} className={`p-4 bg-white shadow-xl rounded-full transition-all text-left ${neighborhoodPage === 0 ? 'opacity-20' : 'hover:scale-110'}`} disabled={neighborhoodPage === 0}><ChevronLeft size={20} className="text-[#AF9042]" /></button></div>
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-10 text-left"><button onClick={() => setNeighborhoodPage(1)} className={`p-4 bg-white shadow-xl rounded-full transition-all text-left ${neighborhoodPage === 1 ? 'opacity-20' : 'hover:scale-110'}`} disabled={neighborhoodPage === 1}><ChevronRight size={20} className="text-[#AF9042]" /></button></div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: DIFERENCIAIS ANTES DO RODAPÉ (RECUPERADO) */}
      <section className="py-24 bg-[#0A1929] text-white">
        <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-16 text-center text-left">
          {[
            { icon: <ShieldCheck strokeWidth={1} />, title: "Sigilo Absoluto", desc: "Processos pautados pela máxima discrição e segurança jurídica." },
            { icon: <Award strokeWidth={1} />, title: "Curadoria Implacável", desc: "Apenas 5% das propriedades avaliadas entram em nosso catálogo." },
            { icon: <Globe strokeWidth={1} />, title: "Network Global", desc: "Conexão direta com investidores internacionais em hubs de luxo." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-[#AF9042] mb-6 scale-150">{item.icon}</div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.4em] mb-4 italic text-center">{item.title}</h4>
              <p className="text-white/40 font-light text-[12px] leading-relaxed max-w-xs italic text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const DetailView = ({ property }) => {
    const isAluguel = property.type === 'Aluguel';
    const totalValue = isAluguel ? (property.price + (property.condo || 0) + (property.iptu || 0)) : property.price;

    const openWhatsApp = () => {
      const msg = encodeURIComponent(`Olá, vi o imóvel "${property.title}" (Ref: ${property.id}) no site da Rava Imóveis e gostaria de agendar uma consulta.`);
      window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${msg}`, '_blank');
    };

    return (
      <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-1000 bg-white">
        <div className="container mx-auto px-10 lg:px-20 text-left">
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 text-left text-left text-left">
            <div className="flex flex-col max-w-2xl text-left text-left">
              <div className="flex items-center gap-3 mb-6 text-left text-left text-left">
                <span className="text-[#AF9042] text-[9px] font-light uppercase tracking-[0.4em] border-b border-[#AF9042] pb-1 text-left text-left">Ref: {property.id}</span>
                <span className="text-[#0A1929]/30 text-[9px] font-light uppercase tracking-[0.4em] italic text-left text-left text-left text-left">Curadoria Rava Imóveis</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extralight text-[#0A1929] mb-4 leading-tight tracking-tight text-left italic text-left text-left text-left">{property.title}</h1>
              <p className="flex items-center gap-2 text-[#0A1929]/50 font-light text-[13px] tracking-widest uppercase text-left text-left text-left text-left text-left">
                <MapPin size={16} strokeWidth={1} className="text-[#AF9042]" /> {property.neighborhood}, São Paulo
              </p>
            </div>
          </div>

          {/* GRID COM SUPORTE A STICKY DEFINITIVO (self-start + sticky) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start text-left text-left text-left">
            
            {/* CONTEÚDO PRINCIPAL (ESQUERDA) */}
            <div className="lg:col-span-8 text-left text-left text-left text-left">
              <div className="mb-12 group relative overflow-hidden rounded-sm shadow-xl text-left text-left text-left text-left">
                 <img src={property.image} className="w-full h-[650px] object-cover transition-all duration-[3s] group-hover:scale-105 text-left text-left text-left text-left" alt={property.title} />
                 <div className="absolute bottom-10 left-10 flex gap-4 text-left">
                   <button className="bg-white/90 backdrop-blur-md px-10 py-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#0A1929] hover:bg-[#0A1929] hover:text-white transition-all shadow-2xl flex items-center gap-3 border border-white/50 text-left text-left text-left"><ImageIcon size={14} className="text-[#AF9042]" /> Fotos</button>
                   <button className="bg-white/90 backdrop-blur-md px-10 py-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#0A1929] hover:bg-[#0A1929] hover:text-white transition-all shadow-2xl flex items-center gap-3 border border-white/50 text-left text-left text-left text-left"><Play size={14} className="text-[#AF9042]" /> Vídeo</button>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-gray-100 py-16 mb-20 text-left text-left text-left text-left text-left">
                 <div className="flex flex-col gap-3 items-center text-center text-center text-center text-center"><Square size={20} strokeWidth={1} className="text-[#AF9042]" /><span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold text-center text-center text-center">Área Útil</span><span className="text-2xl font-light text-[#0A1929] text-center text-center text-center text-center">{property.area} m²</span></div>
                 <div className="flex flex-col gap-3 items-center text-center text-center text-center text-center text-center text-center"><BedDouble size={20} strokeWidth={1} className="text-[#AF9042]" /><span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold text-center text-center text-center text-center">Suítes</span><span className="text-2xl font-light text-[#0A1929] text-center text-center text-center text-center text-center">{property.suites}</span></div>
                 <div className="flex flex-col gap-3 items-center text-center text-center text-center text-center text-center text-center text-center"><Bath size={20} strokeWidth={1} className="text-[#AF9042]" /><span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold text-center text-center text-center text-center text-center">Banheiros</span><span className="text-2xl font-light text-[#0A1929] text-center text-center text-center text-center text-center text-center">{property.baths}</span></div>
                 <div className="flex flex-col gap-3 items-center text-center text-center text-center text-center text-center text-center text-center text-center text-center"><Car size={20} strokeWidth={1} className="text-[#AF9042]" /><span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold text-center text-center text-center text-center text-center text-center">Vagas</span><span className="text-2xl font-light text-[#0A1929] text-center text-center text-center text-center text-center text-center text-center">{property.parking}</span></div>
              </div>

              <div className="mb-24 text-left text-left text-left text-left text-left">
                <div className="flex items-center gap-6 mb-10 text-left text-left text-left text-left text-left"><Minus className="text-[#AF9042] text-left text-left" /><h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] text-left text-left text-left">O Imóvel</h3></div>
                <p className="text-[#0A1929]/60 font-light text-[15px] leading-loose italic max-w-3xl mb-16 border-l border-[#AF9042]/20 pl-8 text-left text-left text-left text-left">"{property.description}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20 mb-20 text-left text-left text-left text-left">
                  {property.features?.map(f => (<div key={f} className="flex items-center gap-4 text-[11px] font-light text-[#0A1929] border-b border-gray-50 pb-4 uppercase tracking-widest text-left text-left text-left text-left"><CheckCircle2 size={14} strokeWidth={1} className="text-[#AF9042]" /> {f}</div>))}
                </div>

                <div className="flex items-center gap-6 mb-10 text-left text-left text-left text-left text-left"><Minus className="text-[#AF9042] text-left text-left" /><h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] text-left text-left text-left text-left">Infraestrutura do Prédio</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20 mb-20 p-10 bg-slate-50/50 rounded-sm text-left text-left text-left text-left">
                  {property.amenities?.map(a => (
                    <div key={a} className="flex items-center gap-4 text-[11px] font-light text-[#0A1929] uppercase tracking-widest text-left text-left text-left text-left text-left text-left text-left text-left">
                      <ShieldCheck size={14} strokeWidth={1} className="text-[#AF9042]" /> {a}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 mb-10 text-left text-left text-left text-left text-left"><Minus className="text-[#AF9042] text-left text-left" /><h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] text-left text-left text-left text-left text-left">Diferenciais & Facilidades</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 text-left text-left text-left text-left text-left">
                  {property.conveniences?.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group text-left text-left text-left text-left text-left">
                       <div className="text-[#AF9042] group-hover:scale-110 transition-transform text-left text-left text-left text-left text-left text-left text-left">{item.icon}</div>
                       <div className="text-left text-left text-left text-left text-left">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1929] text-left text-left text-left text-left"> {item.label}</p>
                         <p className="text-[11px] font-light text-[#0A1929]/60 italic text-left text-left text-left text-left text-left">{item.desc}</p>
                       </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-6 p-8 border border-gray-100 rounded-sm group text-left text-left text-left text-left text-left">
                     <Dog size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform text-left text-left text-left text-left text-left" />
                     <div className="text-left text-left text-left text-left text-left text-left">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1929] text-left text-left text-left text-left">Pet Friendly</p>
                       <p className="text-[11px] font-light text-[#0A1929]/60 italic text-left text-left text-left text-left text-left text-left">{property.petPolicy}</p>
                     </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-10 text-left text-left text-left text-left text-left text-left text-left"><Minus className="text-[#AF9042] text-left text-left" /><h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] text-left text-left text-left text-left text-left text-left text-left">Vida no Entorno</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 text-center text-center text-center text-center text-center text-center text-center">
                  {[{icon:<Coffee size={24}/>,label:"Padarias"},{icon:<PlusSquare size={24}/>,label:"Farmácias"},{icon:<Fuel size={24}/>,label:"Postos"},{icon:<ShoppingBag size={24}/>,label:"Mercados"}].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group text-center text-center text-center text-center text-center text-center text-center">
                       <div className="text-[#AF9042] group-hover:scale-110 transition-transform text-center">{item.icon}</div>
                       <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929] text-center text-center text-center text-center text-center">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="h-[450px] bg-slate-100 rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-[3s] text-left text-left text-left text-left text-left text-left">
                   <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-30 text-left text-left text-left text-left text-left text-left text-left text-left" alt="Mapa" />
                   <div className="absolute inset-0 flex items-center justify-center text-left text-left text-left text-left text-left">
                     <div className="bg-white p-6 shadow-2xl rounded-sm flex flex-col items-center text-left text-left text-left text-left text-left text-left">
                       <MapPin size={32} className="text-[#AF9042] mb-2 animate-bounce" />
                       <p className="text-[11px] font-light uppercase tracking-widest text-[#0A1929] text-left text-left">{property.neighborhood}</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR COLUNA DIREITA STICKY (SÓ EM DESKTOP) */}
            <div className="lg:col-span-4 self-start sticky top-32 text-left text-left text-left text-left text-left">
              <div className="space-y-8 pb-20 text-left text-left text-left text-left text-left text-left text-left">
                <div className="p-10 border border-gray-100 rounded-sm bg-[#FCFCFC] shadow-sm text-left text-left text-left text-left text-left text-left text-left">
                   <span className="text-[10px] font-light uppercase tracking-[0.4em] text-[#AF9042] mb-2 block italic text-left text-left text-left text-left text-left text-left">
                     {isAluguel ? 'Pacote Total Mensal' : 'Valor de Investimento'}
                   </span>
                   <h2 className="text-3xl font-light text-[#0A1929] mb-6 text-left">{formatCurrency(totalValue)}</h2>
                   <div className="flex flex-col gap-2 text-[11px] font-light text-[#0A1929]/50 uppercase tracking-[0.1em] border-t border-gray-100 pt-6 text-left text-left text-left text-left text-left text-left text-left text-left">
                      <div className="flex justify-between text-left"><span>{isAluguel ? 'Aluguel' : 'Valor'}</span> <span>{formatCurrency(property.price)}</span></div>
                      <div className="flex justify-between text-left text-left text-left"><span>Condomínio</span> <span>{formatCurrency(property.condo)}</span></div>
                      <div className="flex justify-between text-left text-left text-left text-left"><span>IPTU Mensal</span> <span>{formatCurrency(property.iptu)}</span></div>
                   </div>
                </div>
                <div className="bg-[#0A1929] p-12 rounded-sm shadow-2xl relative overflow-hidden text-left text-left text-left text-left text-left text-left text-left">
                  <span className="text-[#AF9042] text-[9px] font-light uppercase tracking-[0.5em] block mb-10 underline underline-offset-[12px] text-left text-left text-left text-left text-left text-left">Atendimento Privativo</span>
                  <div className="space-y-6 mb-12 text-left text-left text-left text-left text-left text-left text-left text-left">
                    <button onClick={openWhatsApp} className="w-full bg-[#AF9042] text-white py-6 text-[10px] font-light uppercase tracking-[0.3em] hover:bg-white hover:text-[#0A1929] transition-all flex items-center justify-center gap-3 shadow-xl border border-[#AF9042] text-left text-left text-left text-left text-left"><Phone size={16} strokeWidth={1} className="text-white" /> WhatsApp Concierge</button>
                    <button className="w-full border border-white/20 text-white py-6 text-[10px] font-light uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-left text-left text-left text-left text-left text-left text-left text-left"><Calendar size={16} strokeWidth={1} className="text-[#AF9042]" /> Agendar Visita VIP</button>
                  </div>
                  <div className="pt-10 border-t border-white/10 flex items-center gap-6 text-left text-left text-left text-left text-left text-left text-left text-left"><div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 grayscale opacity-40 text-left text-left text-left text-left text-left text-left text-left text-left"><ShieldCheck size={24} className="text-[#AF9042]" strokeWidth={1} /></div><div className="text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><p className="text-[10px] font-light uppercase tracking-widest text-[#AF9042] mb-1 text-left text-left text-left text-left text-left text-left">Especialista Rava</p><p className="text-[11px] font-light text-white/50 italic tracking-wide italic text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">Consultoria Bilíngue 24/7</p></div></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A1929] selection:bg-[#AF9042] selection:text-white antialiased text-left text-left text-left text-left text-left">
      <Navbar />
      {mobileMenu && (
        <div className="fixed inset-0 z-[110] bg-[#0A1929] flex flex-col items-center justify-center gap-12 text-white text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><button onClick={() => setMobileMenu(false)} className="absolute top-10 right-10 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><X size={32} strokeWidth={1} className="text-[#AF9042]"/></button>{['home', 'search', 'b2b', 'about'].map(v => (<button key={v} onClick={() => navigateTo(v)} className="text-2xl font-extralight uppercase tracking-[0.5em] text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">{v === 'home' ? 'RAVA' : v}</button>))}</div>
      )}
      <main className="text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">
        {view === 'home' && <HomeView />}
        {view === 'search' && <div className="pt-32 pb-24 text-center text-[10px] uppercase tracking-widest text-[#0A1929]/40 italic text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">Resultados da Busca (Em Construção)</div>}
        {view === 'detail' && <DetailView property={selectedProp} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;