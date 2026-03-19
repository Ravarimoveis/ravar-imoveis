import { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Minus, ChevronDown, Check, ChevronLeft, ChevronRight, ShieldCheck, Award, Globe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { NEIGHBORHOOD_PAGES } from '../data/properties';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from '../components/PropertyCard';
import { Waves, Building2, Droplets, Dog, Train, Wine, Briefcase, UtensilsCrossed, Smartphone, Key, Home as HomeIcon, TreePine } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import SlickSlider from 'react-slick';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e68c254a`;

interface SectionConfig {
  neighborhoodsEnabled: boolean;
  neighborhoodsTitle: string;
  categoriesEnabled: boolean;
  categoriesTitle: string;
}

export function Home() {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [searchTab, setSearchTab] = useState('Comprar');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [neighborhoodPage, setNeighborhoodPage] = useState(0);
  const [categoryPage, setCategoryPage] = useState(0);
  const [filterType, setFilterType] = useState('Apartamento');
  const [filterRooms, setFilterRooms] = useState('2+');
  const [filterBathrooms, setFilterBathrooms] = useState('Todos');
  
  // Sections config from admin
  const [sectionsConfig, setSectionsConfig] = useState<SectionConfig>({
    neighborhoodsEnabled: true,
    neighborhoodsTitle: 'Explore por bairros',
    categoriesEnabled: true,
    categoriesTitle: 'Buscar por Categoria'
  });
  
  // Range Sliders com 2 thumbs
  const [areaRange, setAreaRange] = useState<number[]>([50, 800]);
  const [priceRange, setPriceRange] = useState<number[]>([300000, 50000000]);
  const [rentRange, setRentRange] = useState<number[]>([2000, 150000]);
  const [downPaymentRange, setDownPaymentRange] = useState<number[]>([50000, 10000000]);
  const [installmentRange, setInstallmentRange] = useState<number[]>([1000, 100000]);
  
  // Checkbox Condomínio
  const [includeCondominium, setIncludeCondominium] = useState(false);
  
  // 4 Categorias de filtros padronizados
  const [filterInfraestrutura, setFilterInfraestrutura] = useState<string[]>([]);
  const [filterImovel, setFilterImovel] = useState<string[]>([]);
  const [filterDiferenciais, setFilterDiferenciais] = useState<string[]>([]);
  const [filterProximidade, setFilterProximidade] = useState<string[]>([]);
  const [filterNeighborhoods, setFilterNeighborhoods] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  // Load sections config on mount
  useEffect(() => {
    loadSectionsConfig();
  }, []);

  const loadSectionsConfig = async () => {
    try {
      console.log('🔄 Loading sections config from backend...');
      const response = await fetch(`${API_BASE}/sections/config`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sections config loaded:', data);
        if (data.success && data.config) {
          setSectionsConfig(data.config);
          console.log('✅ Sections config applied:', data.config);
        }
      } else {
        console.log('❌ Failed to load config, status:', response.status);
      }
    } catch (error) {
      console.log('❌ Could not load sections config, using defaults:', error);
    }
  };

  // Toggle functions
  const toggleInfraestrutura = (item: string) => {
    setFilterInfraestrutura(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const toggleImovel = (item: string) => {
    setFilterImovel(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const toggleDiferenciais = (item: string) => {
    setFilterDiferenciais(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const toggleProximidade = (item: string) => {
    setFilterProximidade(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setFilterNeighborhoods(prev => 
      prev.includes(neighborhood) ? prev.filter(n => n !== neighborhood) : [...prev, neighborhood]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTab === 'Comprar') params.set('pretensao', 'comprar');
    if (searchTab === 'Alugar') params.set('pretensao', 'alugar');
    if (searchTab === 'Investir') params.set('pretensao', 'investir');
    
    if (searchText.trim()) params.set('search', searchText.trim());
    if (filterType !== 'Apartamento') params.set('tipo', filterType.toLowerCase());
    if (filterRooms !== '2+') params.set('rooms', filterRooms);
    if (filterBathrooms !== 'Todos') params.set('bathrooms', filterBathrooms);
    
    if (areaRange[0] > 50) params.set('minarea', areaRange[0].toString());
    if (areaRange[1] < 800) params.set('maxarea', areaRange[1].toString());
    
    if (searchTab === 'Comprar') {
      if (priceRange[0] > 300000) params.set('minprice', priceRange[0].toString());
      if (priceRange[1] < 50000000) params.set('maxprice', priceRange[1].toString());
    }
    
    if (searchTab === 'Alugar') {
      if (rentRange[0] > 2000) params.set('minrent', rentRange[0].toString());
      if (rentRange[1] < 150000) params.set('maxrent', rentRange[1].toString());
      if (includeCondominium) params.set('includecondominium', 'true');
    }
    
    if (searchTab === 'Investir') {
      if (downPaymentRange[0] > 50000) params.set('mindown', downPaymentRange[0].toString());
      if (downPaymentRange[1] < 10000000) params.set('maxdown', downPaymentRange[1].toString());
      if (installmentRange[0] > 1000) params.set('mininstall', installmentRange[0].toString());
      if (installmentRange[1] < 100000) params.set('maxinstall', installmentRange[1].toString());
    }
    
    if (filterInfraestrutura.length > 0) params.set('infraestrutura', filterInfraestrutura.join(','));
    if (filterImovel.length > 0) params.set('imovel', filterImovel.join(','));
    if (filterDiferenciais.length > 0) params.set('diferenciais', filterDiferenciais.join(','));
    if (filterProximidade.length > 0) params.set('proximidade', filterProximidade.join(','));
    if (filterNeighborhoods.length > 0) params.set('bairros', filterNeighborhoods.join(','));
    
    navigate(`/explorar?${params.toString()}`);
  };

  const availableNeighborhoods = [
    { id: 'itaim', name: 'Itaim Bibi' },
    { id: 'jardins', name: 'Jardins' },
    { id: 'pinheiros', name: 'Pinheiros' },
    { id: 'moema', name: 'Moema' },
    { id: 'vilanova', name: 'Vila Nova Conceição' },
    { id: 'higienopolis', name: 'Higienópolis' },
    { id: 'brooklin', name: 'Brooklin' },
    { id: 'alto', name: 'Alto de Pinheiros' },
    { id: 'vilaolimpia', name: 'Vila Olímpia' },
    { id: 'cidadejardim', name: 'Cidade Jardim' }
  ];

  // 4 CATEGORIAS PADRONIZADAS
  const infraestruturaOptions = [
    'Academia', 'Piscina', 'Sauna/SPA', 'Salão de Festas', 
    'Quadra Esportiva', 'Playground', 'Espaço Gourmet', 
    'Segurança 24h', 'Portaria 24h', 'Coworking', 
    'Lavanderia', 'Bicicletário', 'Espaço Pet', 'Mercadinho'
  ];

  const imovelOptions = [
    'Varanda Gourmet', 'Sacada', 'Home Office', 'Adega Climatizada',
    'Smart Home', 'Closet', 'Suíte Master', 'Churrasqueira Privativa',
    'Lareira', 'Banheira/Jacuzzi'
  ];

  const diferenciaisOptions = [
    'Aceita Pet', 'Mobiliado', 'Pronto para Morar', 'Pé-direito Alto',
    'Vista Panorâmica', 'Cobertura', 'Loft/Duplex', 'Jardim/Terraço',
    'Piscina Privativa', 'Blindagem', 'Energia Solar'
  ];

  const proximidadeOptions = [
    'Metrô', 'Escolas', 'Hospitais', 'Shoppings',
    'Padarias', 'Farmácias', 'Postos', 'Mercados'
  ];

  const categories = [
    { id: 1, name: 'SPA/Sauna', emoji: '♨️', img: 'https://images.unsplash.com/photo-1757940661240-f2e8d2ff93bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'spa', icon: <Waves size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 2, name: 'Cobertura', emoji: '🏛️', img: 'https://images.unsplash.com/photo-1519380400109-9ef80d934359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'cobertura', icon: <Building2 size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 3, name: 'Piscina Privativa', emoji: '🏊', img: 'https://images.unsplash.com/photo-1615762289422-4e4bc422a784?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'piscina', icon: <Droplets size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 4, name: 'Aceita Pet', emoji: '🐕', img: 'https://images.unsplash.com/photo-1672764788664-9f5844477a0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'pet', icon: <Dog size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 5, name: 'Perto do Metrô', emoji: '🚇', img: 'https://images.unsplash.com/photo-1572177229069-dca5ed8afdb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'metro', icon: <Train size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 6, name: 'Adega Climatizada', emoji: '🍷', img: 'https://images.unsplash.com/photo-1760856269357-e82ffeb240d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'adega', icon: <Wine size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 7, name: 'Home Office', emoji: '💼', img: 'https://images.unsplash.com/photo-1764410481612-7544525b2991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'homeoffice', icon: <Briefcase size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 8, name: 'Varanda Gourmet', emoji: '🍽️', img: 'https://images.unsplash.com/photo-1714692601149-3b76bd0b300f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'varanda', icon: <UtensilsCrossed size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 9, name: 'Smart Home', emoji: '🤖', img: 'https://images.unsplash.com/photo-1752262167753-37a0ec83f614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'smarthome', icon: <Smartphone size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 10, name: 'Pronto para Morar', emoji: '🔑', img: 'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'pronto', icon: <Key size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 11, name: 'Loft/Duplex', emoji: '🏢', img: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'loft', icon: <HomeIcon size={20} strokeWidth={1} className="text-[#AF9042]" /> },
    { id: 12, name: 'Jardim/Terraço', emoji: '🌿', img: 'https://images.unsplash.com/photo-1723119832675-0031e0f0408c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', filter: 'jardim', icon: <TreePine size={20} strokeWidth={1} className="text-[#AF9042]" /> }
  ];

  const categoryPages = [
    categories.slice(0, 6),
    categories.slice(6, 12)
  ];

  const handleCategoryClick = (filter: string) => {
    navigate(`/explorar?categoria=${filter}`);
  };

  // Formatação de valores
  const formatPrice = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  const formatRent = (value: number) => {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="animate-in fade-in duration-1000 text-left">
      {/* HERO SECTION */}
      <section className="relative h-[95vh] min-h-[750px] flex items-center justify-center bg-[#0A1929] text-left">
        <div className="container mx-auto px-10 relative z-10 text-left">
          <div className="flex flex-col items-center text-center">
            <span className="text-[#AF9042] text-[10px] font-light uppercase tracking-[0.6em] mb-10 block animate-in slide-in-from-left-4 duration-700">
              Realizando sonhos
            </span>
            <h1 className="text-5xl md:text-7xl font-extralight text-white mb-16 leading-[1.2] tracking-tighter text-center max-w-4xl">
              Aqui você encontra o <br />
              <span className="text-[#AF9042] italic">seu novo lar.</span>
            </h1>
            
            <div className="relative flex flex-col items-center w-full z-20 text-left">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 md:p-3 rounded-[2rem] flex flex-col md:flex-row items-center gap-2 shadow-2xl text-left max-w-4xl w-full">
                <div className="hidden lg:flex items-center px-4 gap-6 text-[9px] font-light text-white/50 uppercase tracking-widest border-r border-white/10 pr-8 text-left">
                  {['Comprar', 'Alugar'/* , 'Investir' */].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setSearchTab(tab)} 
                      className={`transition-all hover:text-white ${searchTab === tab ? 'text-[#AF9042] font-medium' : ''}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center px-6 gap-3 flex-1 text-left">
                  <MapPin size={18} strokeWidth={1} className="text-[#AF9042]" />
                  <input 
                    type="text" 
                    placeholder="Bairro, Rua ou Condomínio..." 
                    className="bg-transparent border-none outline-none w-full text-white font-light text-sm py-3 placeholder:text-white/30 text-left" 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-light uppercase tracking-widest transition-all ${isFiltersOpen ? 'bg-white text-[#0A1929]' : 'text-white/70 hover:text-white'} text-left`}
                >
                  <SlidersHorizontal size={14} strokeWidth={1} className="text-[#AF9042]" /> 
                  <span>Mais Filtros</span> 
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={handleSearch} 
                  className="bg-[#AF9042] text-white p-4 rounded-full hover:bg-white hover:text-[#0A1929] transition-all transform hover:scale-105 shadow-xl"
                >
                  <Search size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* PAINEL DE FILTROS AVANÇADOS - 4 COLUNAS */}
              {isFiltersOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 animate-in slide-in-from-top-4 duration-500 text-left">
                  <div className="container mx-auto px-10">
                    <div className="bg-white rounded-[2rem] p-10 shadow-2xl border border-gray-100 overflow-hidden text-[#0A1929]">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                        
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        {/* COLUNA 1: SELEÇÕES                                  */}
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        <div className="space-y-6 text-left">
                          {/* Pretensão */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Pretensão</span>
                            <div className="grid grid-cols-2 gap-2 text-left">
                              {['Comprar', 'Alugar'/* , 'Investir' */].map(t => (
                                <button 
                                  key={t} 
                                  onClick={() => setSearchTab(t)} 
                                  className={`py-3 text-[9px] uppercase tracking-widest border transition-all ${searchTab === t ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Tipo de Imóvel */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Tipo de Imóvel</span>
                            <div className="grid grid-cols-2 gap-2 text-left">
                              {['Apartamento', 'Casa', 'Condomínio', 'Loft'].map(t => (
                                <button 
                                  key={t} 
                                  onClick={() => setFilterType(t)} 
                                  className={`py-3 text-[9px] uppercase tracking-widest border transition-all ${filterType === t ? 'bg-[#AF9042] text-white border-[#AF9042]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Quartos */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Quartos</span>
                            <div className="grid grid-cols-4 gap-2 text-left">
                              {['1+', '2+', '3+', '4+'].map(r => (
                                <button 
                                  key={r} 
                                  onClick={() => setFilterRooms(r)} 
                                  className={`py-3 text-[10px] font-light border transition-all ${filterRooms === r ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Banheiros */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Banheiros</span>
                            <div className="grid grid-cols-5 gap-2 text-left">
                              {['Todos', '1+', '2+', '3+', '4+'].map(b => (
                                <button 
                                  key={b} 
                                  onClick={() => setFilterBathrooms(b)} 
                                  className={`py-3 text-[9px] font-light border transition-all ${filterBathrooms === b ? 'bg-[#0A1929] text-white border-[#0A1929]' : 'border-gray-100 text-[#0A1929]/40 hover:border-[#AF9042]'}`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        {/* COLUNA 2: VALORES                                   */}
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        <div className="space-y-6 border-x border-gray-50 px-6 text-left">
                          {/* Metragem */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Metragem (m²)</span>
                            <Slider.Root 
                              className="relative flex h-2 w-full touch-none select-none items-center mb-3"
                              value={areaRange}
                              onValueChange={setAreaRange}
                              max={1000}
                              step={10}
                              minStepsBetweenThumbs={1}
                            >
                              <Slider.Track className="relative h-2 w-full rounded-full bg-gray-100">
                                <Slider.Range className="absolute h-full rounded-full bg-[#AF9042]" />
                              </Slider.Track>
                              <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                              <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                            </Slider.Root>
                            <div className="flex justify-between text-[10px] text-[#AF9042] font-medium">
                              <span>{areaRange[0]}m²</span>
                              <span>{areaRange[1] >= 1000 ? '1000m²+' : `${areaRange[1]}m²`}</span>
                            </div>
                          </div>
                          
                          {/* SE COMPRAR */}
                          {searchTab === 'Comprar' && (
                            <div className="pt-4 border-t border-gray-100">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Valor do Imóvel</span>
                              <Slider.Root 
                                className="relative flex h-2 w-full touch-none select-none items-center mb-3"
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={50000000}
                                step={100000}
                                minStepsBetweenThumbs={1}
                              >
                                <Slider.Track className="relative h-2 w-full rounded-full bg-gray-100">
                                  <Slider.Range className="absolute h-full rounded-full bg-[#AF9042]" />
                                </Slider.Track>
                                <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                              </Slider.Root>
                              <div className="flex justify-between text-[10px] text-[#AF9042] font-medium">
                                <span>{formatPrice(priceRange[0])}</span>
                                <span>{priceRange[1] >= 50000000 ? 'R$ 50M+' : formatPrice(priceRange[1])}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* SE ALUGAR */}
                          {searchTab === 'Alugar' && (
                            <div className="pt-4 border-t border-gray-100 space-y-4">
                              <div>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Valor do Aluguel</span>
                                <Slider.Root 
                                  className="relative flex h-2 w-full touch-none select-none items-center mb-3"
                                  value={rentRange}
                                  onValueChange={setRentRange}
                                  max={150000}
                                  step={1000}
                                  minStepsBetweenThumbs={1}
                                >
                                  <Slider.Track className="relative h-2 w-full rounded-full bg-gray-100">
                                    <Slider.Range className="absolute h-full rounded-full bg-[#AF9042]" />
                                  </Slider.Track>
                                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                </Slider.Root>
                                <div className="flex justify-between text-[10px] text-[#AF9042] font-medium">
                                  <span>{formatRent(rentRange[0])}/mês</span>
                                  <span>{rentRange[1] >= 150000 ? 'R$ 150k+/mês' : `${formatRent(rentRange[1])}/mês`}</span>
                                </div>
                              </div>
                              
                              {/* Checkbox Incluir Condomínio */}
                              <label className="flex items-center gap-3 cursor-pointer group text-left">
                                <div 
                                  onClick={() => setIncludeCondominium(!includeCondominium)} 
                                  className={`w-5 h-5 rounded-sm border transition-all flex items-center justify-center ${includeCondominium ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}
                                >
                                  {includeCondominium && <Check size={12} className="text-white" />}
                                </div>
                                <span className={`text-[10px] font-light uppercase tracking-wider transition-colors ${includeCondominium ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/60 group-hover:text-[#0A1929]'}`}>
                                  Incluir Condomínio
                                </span>
                              </label>
                            </div>
                          )}
                          
                          {/* SE INVESTIR */}
                          {searchTab === 'Investir' && (
                            <div className="pt-4 border-t border-gray-100 space-y-6">
                              <div>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Entrada</span>
                                <Slider.Root 
                                  className="relative flex h-2 w-full touch-none select-none items-center mb-3"
                                  value={downPaymentRange}
                                  onValueChange={setDownPaymentRange}
                                  max={10000000}
                                  step={50000}
                                  minStepsBetweenThumbs={1}
                                >
                                  <Slider.Track className="relative h-2 w-full rounded-full bg-gray-100">
                                    <Slider.Range className="absolute h-full rounded-full bg-[#AF9042]" />
                                  </Slider.Track>
                                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                </Slider.Root>
                                <div className="flex justify-between text-[10px] text-[#AF9042] font-medium">
                                  <span>{formatPrice(downPaymentRange[0])}</span>
                                  <span>{downPaymentRange[1] >= 10000000 ? 'R$ 10M' : formatPrice(downPaymentRange[1])}</span>
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left">Parcelas Mensais</span>
                                <Slider.Root 
                                  className="relative flex h-2 w-full touch-none select-none items-center mb-3"
                                  value={installmentRange}
                                  onValueChange={setInstallmentRange}
                                  max={100000}
                                  step={1000}
                                  minStepsBetweenThumbs={1}
                                >
                                  <Slider.Track className="relative h-2 w-full rounded-full bg-gray-100">
                                    <Slider.Range className="absolute h-full rounded-full bg-[#AF9042]" />
                                  </Slider.Track>
                                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#AF9042] bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AF9042]" />
                                </Slider.Root>
                                <div className="flex justify-between text-[10px] text-[#AF9042] font-medium">
                                  <span>{formatRent(installmentRange[0])}/mês</span>
                                  <span>{installmentRange[1] >= 100000 ? 'R$ 100k+/mês' : `${formatRent(installmentRange[1])}/mês`}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        {/* COLUNA 3: CARACTERÍSTICAS (Scrollable)              */}
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        <div className="space-y-6 text-left max-h-[500px] overflow-y-auto pr-2">
                          {/* INFRAESTRUTURA */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left sticky top-0 bg-white py-2">Infraestrutura</span>
                            <div className="grid grid-cols-1 gap-3">
                              {infraestruturaOptions.map(item => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer group text-left">
                                  <div 
                                    onClick={() => toggleInfraestrutura(item)} 
                                    className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center flex-shrink-0 ${filterInfraestrutura.includes(item) ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}
                                  >
                                    {filterInfraestrutura.includes(item) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[10px] font-light uppercase tracking-wider transition-colors ${filterInfraestrutura.includes(item) ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/40 group-hover:text-[#0A1929]'}`}>
                                    {item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* IMÓVEL */}
                          <div className="pt-4 border-t border-gray-100">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left sticky top-0 bg-white py-2">Imóvel</span>
                            <div className="grid grid-cols-1 gap-3">
                              {imovelOptions.map(item => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer group text-left">
                                  <div 
                                    onClick={() => toggleImovel(item)} 
                                    className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center flex-shrink-0 ${filterImovel.includes(item) ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}
                                  >
                                    {filterImovel.includes(item) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[10px] font-light uppercase tracking-wider transition-colors ${filterImovel.includes(item) ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/40 group-hover:text-[#0A1929]'}`}>
                                    {item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* DIFERENCIAIS */}
                          <div className="pt-4 border-t border-gray-100">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left sticky top-0 bg-white py-2">Diferenciais</span>
                            <div className="grid grid-cols-1 gap-3">
                              {diferenciaisOptions.map(item => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer group text-left">
                                  <div 
                                    onClick={() => toggleDiferenciais(item)} 
                                    className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center flex-shrink-0 ${filterDiferenciais.includes(item) ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}
                                  >
                                    {filterDiferenciais.includes(item) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[10px] font-light uppercase tracking-wider transition-colors ${filterDiferenciais.includes(item) ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/40 group-hover:text-[#0A1929]'}`}>
                                    {item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        {/* COLUNA 4: LOCALIZAÇÃO (Scrollable)                  */}
                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        <div className="space-y-6 text-left max-h-[500px] overflow-y-auto pr-2 border-l border-gray-50 pl-6">
                          {/* BAIRROS */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left sticky top-0 bg-white py-2">Bairros</span>
                            <div className="grid grid-cols-1 gap-3">
                              {availableNeighborhoods.map(item => (
                                <label key={item.id} className="flex items-center gap-3 cursor-pointer group text-left">
                                  <div 
                                    onClick={() => toggleNeighborhood(item.id)} 
                                    className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center flex-shrink-0 ${filterNeighborhoods.includes(item.id) ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}
                                  >
                                    {filterNeighborhoods.includes(item.id) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[10px] font-light uppercase tracking-wider transition-colors ${filterNeighborhoods.includes(item.id) ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/40 group-hover:text-[#0A1929]'}`}>
                                    {item.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* PRÓXIMO A */}
                          <div className="pt-4 border-t border-gray-100">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic text-left sticky top-0 bg-white py-2">Próximo a</span>
                            <div className="grid grid-cols-1 gap-3">
                              {proximidadeOptions.map(item => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer group text-left">
                                  <div 
                                    onClick={() => toggleProximidade(item)} 
                                    className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center flex-shrink-0 ${filterProximidade.includes(item) ? 'bg-[#AF9042] border-[#AF9042]' : 'border-gray-200 group-hover:border-[#AF9042]'}`}
                                  >
                                    {filterProximidade.includes(item) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[10px] font-light uppercase tracking-wider transition-colors ${filterProximidade.includes(item) ? 'text-[#0A1929] font-medium' : 'text-[#0A1929]/40 group-hover:text-[#0A1929]'}`}>
                                    {item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES SECTION */}
      <section className="py-32 bg-white text-center text-left">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 text-left">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <Minus className="text-[#AF9042] mb-6" />
            <h2 className="text-2xl md:text-3xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 text-center">Destaques</h2>
            <p className="text-[#0A1929]/60 font-light max-w-lg text-[12px] md:text-[13px] leading-relaxed uppercase tracking-wider italic text-center">
              Confira os imóveis selecionados
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#0A1929]/60">Carregando imóveis...</p>
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="featured-properties-carousel">
              <SlickSlider
                dots={true}
                infinite={properties.length > 3}
                speed={500}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={5000}
                arrows={true}
                centerMode={false}
                variableWidth={false}
                prevArrow={
                  <button className="slick-prev">
                    <ChevronLeft size={24} className="text-[#AF9042]" />
                  </button>
                }
                nextArrow={
                  <button className="slick-next">
                    <ChevronRight size={24} className="text-[#AF9042]" />
                  </button>
                }
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      infinite: properties.length > 2,
                      dots: true,
                      centerMode: false,
                      variableWidth: false
                    }
                  },
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: properties.length > 1,
                      dots: true,
                      arrows: false,
                      centerMode: false,
                      variableWidth: false,
                      adaptiveHeight: true
                    }
                  }
                ]}
              >
                {properties.map(prop => (
                  <div key={prop.id} className="px-0">
                    <PropertyCard prop={prop} onNavigate={() => navigate(`/imovel/${prop.id}`)} />
                  </div>
                ))}
              </SlickSlider>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#0A1929]/60">Nenhum imóvel encontrado.</p>
            </div>
          )}
        </div>
      </section>

      {/* EXPLORAR POR BAIRROS */}
      {sectionsConfig.neighborhoodsEnabled && (
        <section className="py-32 bg-white border-t border-gray-50 text-center">
          <div className="container mx-auto px-10">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] mb-4 text-center">{sectionsConfig.neighborhoodsTitle}</h2>
              <Minus className="text-[#AF9042]" />
            </div>
            <div className="relative text-left">
              <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] animate-in fade-in duration-700 text-left">
                {NEIGHBORHOOD_PAGES[neighborhoodPage].map((b) => (
                  <div 
                    key={b.id} 
                    onClick={() => navigate(`/explorar?bairro=${b.id}`)}
                    className={`relative group overflow-hidden rounded-sm cursor-pointer shadow-lg text-left ${
                      b.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                      b.size === 'medium' ? 'md:col-span-2 md:row-span-1' : 
                      'md:col-span-1 md:row-span-1'
                    }`}
                  >
                    <img 
                      src={b.img} 
                      className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                      alt={b.name} 
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 text-left">
                      <span className="text-[#AF9042] text-[10px] font-light uppercase tracking-[0.4em] text-left">Explorar</span>
                      <h3 className="text-white text-3xl font-extralight tracking-widest uppercase">{b.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 z-10 text-left">
                <button 
                  onClick={() => setNeighborhoodPage(prev => Math.max(0, prev - 1))} 
                  className={`p-4 bg-white shadow-xl rounded-full transition-all text-left ${neighborhoodPage === 0 ? 'opacity-20' : 'hover:scale-110'}`} 
                  disabled={neighborhoodPage === 0}
                >
                  <ChevronLeft size={20} className="text-[#AF9042]" />
                </button>
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-10 text-left">
                <button 
                  onClick={() => setNeighborhoodPage(prev => Math.min(2, prev + 1))} 
                  className={`p-4 bg-white shadow-xl rounded-full transition-all text-left ${neighborhoodPage === 2 ? 'opacity-20' : 'hover:scale-110'}`} 
                  disabled={neighborhoodPage === 2}
                >
                  <ChevronRight size={20} className="text-[#AF9042]" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BUSCAR POR CATEGORIA */}
      {sectionsConfig.categoriesEnabled && (
        <section className="py-32 bg-[#F8F8F8] text-center">
          <div className="container mx-auto px-10">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl font-extralight text-[#0A1929] uppercase tracking-[0.4em] mb-4">{sectionsConfig.categoriesTitle}</h2>
              <Minus className="text-[#AF9042]" />
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
                {categoryPages[categoryPage].map((cat) => (
                  <div 
                    key={cat.id} 
                    onClick={() => handleCategoryClick(cat.filter)}
                    className="relative h-80 overflow-hidden rounded-sm cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 group"
                  >
                    <img 
                      src={cat.img} 
                      className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                      alt={cat.name} 
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 text-left">
                      <div className="inline-flex items-center gap-2.5 bg-[#0A1929]/90 backdrop-blur-sm px-4 py-2.5 rounded-md w-fit">
                        {cat.icon}
                        <h3 className="text-white text-sm font-extralight tracking-widest uppercase group-hover:text-[#AF9042] transition-colors duration-500">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 z-10">
                <button 
                  onClick={() => setCategoryPage(0)} 
                  className={`p-4 bg-white shadow-xl rounded-full transition-all ${categoryPage === 0 ? 'opacity-20' : 'hover:scale-110 hover:bg-[#AF9042] hover:text-white'}`} 
                  disabled={categoryPage === 0}
                >
                  <ChevronLeft size={20} className={categoryPage === 0 ? 'text-gray-300' : 'text-[#AF9042]'} />
                </button>
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                <button 
                  onClick={() => setCategoryPage(1)} 
                  className={`p-4 bg-white shadow-xl rounded-full transition-all ${categoryPage === 1 ? 'opacity-20' : 'hover:scale-110 hover:bg-[#AF9042] hover:text-white'}`} 
                  disabled={categoryPage === 1}
                >
                  <ChevronRight size={20} className={categoryPage === 1 ? 'text-gray-300' : 'text-[#AF9042]'} />
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-12">
                {[0, 1].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCategoryPage(page)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      categoryPage === page ? 'w-12 bg-[#AF9042]' : 'w-6 bg-gray-300 hover:bg-[#AF9042]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VALORES RAVA */}
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
}