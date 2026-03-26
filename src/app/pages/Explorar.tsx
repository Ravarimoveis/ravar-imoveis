import { useState } from 'react';
import { Search, MapPin, Check, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from '../components/PropertyCard';
import * as Slider from '@radix-ui/react-slider';

export function Explorar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { properties, loading } = useProperties();
  
  console.log('🔥 EXPLORAR - Properties loaded:', properties?.length, 'properties');
  console.log('🔥 EXPLORAR - All properties:', properties);
  
  // Leitura de TODOS os parâmetros da URL
  const pretensaoParam = searchParams.get('pretensao');
  const searchParam = searchParams.get('search');
  const tipoParam = searchParams.get('tipo');
  const roomsParam = searchParams.get('rooms');
  const bathroomsParam = searchParams.get('bathrooms');
  const maxPriceParam = searchParams.get('maxprice');
  const minPriceParam = searchParams.get('minprice');
  const minRentParam = searchParams.get('minrent');
  const maxRentParam = searchParams.get('maxrent');
  const minAreaParam = searchParams.get('minarea');
  const maxAreaParam = searchParams.get('maxarea');
  const infraestruturaParam = searchParams.get('infraestrutura');
  const imovelParam = searchParams.get('imovel');
  const diferenciaisParam = searchParams.get('diferenciais');
  const proximidadeParam = searchParams.get('proximidade');
  const categoriaParam = searchParams.get('categoria');
  const bairroParam = searchParams.get('bairro'); // Single bairro
  const bairrosParam = searchParams.get('bairros'); // Multiple bairros
  const includeCondominiumParam = searchParams.get('includecondominium');
  
  // Inicializa states com valores da URL se existirem
  const [searchText, setSearchText] = useState(searchParam || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // ✅ FECHA POR PADRÃO
  const [searchTab, setSearchTab] = useState(
    pretensaoParam === 'comprar' ? 'Comprar' :
    pretensaoParam === 'alugar' ? 'Alugar' : 'Todos' // ✅ INICIA COMO "TODOS"
  );
  const [filterType, setFilterType] = useState(
    tipoParam ? tipoParam.charAt(0).toUpperCase() + tipoParam.slice(1) : 'Todos'
  );
  const [filterRooms, setFilterRooms] = useState(roomsParam || 'Todos');
  const [filterBathrooms, setFilterBathrooms] = useState(bathroomsParam || 'Todos');
  
  // Range Sliders com 2 thumbs
  const [areaRange, setAreaRange] = useState<number[]>([
    minAreaParam ? parseInt(minAreaParam) : 0,
    maxAreaParam ? parseInt(maxAreaParam) : 1000
  ]);
  const [priceRange, setPriceRange] = useState<number[]>([
    minPriceParam ? parseInt(minPriceParam) : 0,
    maxPriceParam ? parseInt(maxPriceParam) : 50000000
  ]);
  const [rentRange, setRentRange] = useState<number[]>([
    minRentParam ? parseInt(minRentParam) : 0,
    maxRentParam ? parseInt(maxRentParam) : 150000
  ]);
  
  // Checkbox Condomínio
  const [includeCondominium, setIncludeCondominium] = useState(includeCondominiumParam === 'true');
  
  // 4 Categorias de filtros padronizados
  const [filterInfraestrutura, setFilterInfraestrutura] = useState<string[]>(
    infraestruturaParam ? infraestruturaParam.split(',') : []
  );
  const [filterImovel, setFilterImovel] = useState<string[]>(
    imovelParam ? imovelParam.split(',') : []
  );
  const [filterDiferenciais, setFilterDiferenciais] = useState<string[]>(
    diferenciaisParam ? diferenciaisParam.split(',') : []
  );
  const [filterProximidade, setFilterProximidade] = useState<string[]>(
    proximidadeParam ? proximidadeParam.split(',') : []
  );
  const [filterNeighborhoods, setFilterNeighborhoods] = useState<string[]>(
    bairrosParam ? bairrosParam.split(',') : []
  );

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

  // ✅ FUNÇÃO PARA LIMPAR TODOS OS FILTROS
  const clearAllFilters = () => {
    setSearchText('');
    setSearchTab('Todos');
    setFilterType('Todos');
    setFilterRooms('Todos');
    setFilterBathrooms('Todos');
    setAreaRange([0, 1000]);
    setPriceRange([0, 50000000]);
    setRentRange([0, 150000]);
    setIncludeCondominium(false);
    setFilterInfraestrutura([]);
    setFilterImovel([]);
    setFilterDiferenciais([]);
    setFilterProximidade([]);
    setFilterNeighborhoods([]);
    console.log('🧹 Todos os filtros foram limpos!');
  };

  // ✅ FUNÇÃO DO BOTÃO LUPA - Foca nos resultados
  const handleSearch = () => {
    console.log('🔍 Buscando com filtros aplicados...');
    setIsFiltersOpen(false);
    // Scroll suave até os resultados
    window.scrollTo({ top: 600, behavior: 'smooth' });
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

  // Map bairro IDs to names
  const neighborhoodMap: Record<string, string> = {
    'itaim': 'Itaim Bibi',
    'jardins': 'Jardins',
    'pinheiros': 'Pinheiros',
    'moema': 'Moema',
    'vilanova': 'Vila Nova Conceição',
    'higienopolis': 'Higienópolis',
    'brooklin': 'Brooklin',
    'alto': 'Alto de Pinheiros',
    'vilaolimpia': 'Vila Olímpia',
    'cidadejardim': 'Cidade Jardim'
  };

  const filteredProperties = (properties || []).filter(prop => {
    // Log para debug
    console.log('🔍 Filtering property:', prop.title, {
      type: prop.type,
      category: prop.category,
      neighborhood: prop.neighborhood,
      rooms: prop.rooms,
      baths: prop.baths,
      price: prop.price,
      area: prop.area
    });

    // ✅ BUSCA POR TEXTO - Só aplica se houver texto
    const matchesSearch = !searchText || searchText.trim() === '' ||
      prop.title.toLowerCase().includes(searchText.toLowerCase()) ||
      prop.neighborhood.toLowerCase().includes(searchText.toLowerCase());
    
    // ✅ PRETENSÃO - Só aplica se não for "Todos"
    const matchesTab = searchTab === 'Todos' ? true :
                       searchTab === 'Comprar' ? prop.type === 'Venda' : 
                       searchTab === 'Alugar' ? prop.type === 'Aluguel' : true;

    // ✅ TIPO - Só aplica se não for "Todos"
    const matchesType = filterType === 'Todos' ? true : filterType === prop.category;

    // ✅ QUARTOS - Só aplica se não for "Todos"
    const matchesRooms = filterRooms === 'Todos' ? true :
                         filterRooms === '1+' ? prop.rooms >= 1 :
                         filterRooms === '2+' ? prop.rooms >= 2 :
                         filterRooms === '3+' ? prop.rooms >= 3 :
                         filterRooms === '4+' ? prop.rooms >= 4 : true;

    // ✅ BANHEIROS - Só aplica se não for "Todos"
    const matchesBathrooms = filterBathrooms === 'Todos' ? true :
                             filterBathrooms === '1+' ? prop.baths >= 1 :
                             filterBathrooms === '2+' ? prop.baths >= 2 :
                             filterBathrooms === '3+' ? prop.baths >= 3 :
                             filterBathrooms === '4+' ? prop.baths >= 4 : true;

    // ✅ PREÇO - Só aplica se for "Comprar" E o range não estiver no máximo
    const matchesPrice = searchTab === 'Comprar' && (priceRange[0] > 0 || priceRange[1] < 50000000) ?
                         (prop.price >= priceRange[0] && prop.price <= priceRange[1]) : true;
    
    // ✅ ALUGUEL - Só aplica se for "Alugar" E o range não estiver no máximo
    const matchesRent = searchTab === 'Alugar' && (rentRange[0] > 0 || rentRange[1] < 150000) ?
                        (prop.price >= rentRange[0] && prop.price <= rentRange[1]) : true;
    
    // ✅ ÁREA - Só aplica se o range não estiver no máximo
    const matchesArea = (areaRange[0] > 0 || areaRange[1] < 1000) ?
                        (prop.area >= areaRange[0] && prop.area <= areaRange[1]) : true;

    // ✅ BAIRRO ÚNICO - Via URL parameter
    const matchesSingleBairro = !bairroParam || prop.neighborhood === neighborhoodMap[bairroParam];

    // ✅ MÚLTIPLOS BAIRROS - Só aplica se houver seleção
    let matchesMultipleBairros = true;
    if (filterNeighborhoods.length > 0) {
      const selectedBairros = filterNeighborhoods.map(id => neighborhoodMap[id]);
      matchesMultipleBairros = selectedBairros.includes(prop.neighborhood);
    }

    // ✅ CATEGORIA - Via URL parameter
    const matchesCategoria = !categoriaParam || (prop.premiumTags && prop.premiumTags.includes(categoriaParam));

    const result = matchesSearch && matchesTab && matchesType && matchesRooms && matchesBathrooms && matchesPrice && matchesRent && matchesArea && matchesSingleBairro && matchesMultipleBairros && matchesCategoria;
    
    console.log('✅ Matches:', {
      matchesSearch,
      matchesTab,
      matchesType,
      matchesRooms,
      matchesBathrooms,
      matchesPrice,
      matchesRent,
      matchesArea,
      matchesSingleBairro,
      matchesMultipleBairros,
      matchesCategoria,
      RESULT: result
    });

    return result;
  });

  // Formatação de valores
  const formatPrice = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  const formatRent = (value: number) => {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <div className="mb-12">
          <h1 className="text-5xl font-extralight text-[#0A1929] mb-6 tracking-tight">Explorar Imóveis</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {pretensaoParam && (
              <div className="inline-flex items-center gap-2 bg-[#0A1929] text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest">
                <span>Pretensão: {pretensaoParam}</span>
                <button onClick={() => navigate('/explorar')} className="ml-2 hover:text-[#AF9042] transition-colors">✕</button>
              </div>
            )}
            {categoriaParam && (
              <div className="inline-flex items-center gap-2 bg-[#AF9042] text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest">
                <span>Categoria: {categoriaParam}</span>
                <button onClick={() => navigate('/explorar')} className="ml-2 hover:text-[#0A1929] transition-colors">✕</button>
              </div>
            )}
            {bairroParam && (
              <div className="inline-flex items-center gap-2 bg-[#0A1929] text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest">
                <span>Bairro: {neighborhoodMap[bairroParam]}</span>
                <button onClick={() => navigate('/explorar')} className="ml-2 hover:text-[#AF9042] transition-colors">✕</button>
              </div>
            )}
          </div>
          <p className="text-[#0A1929]/60 font-light text-[15px] tracking-wider uppercase">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
          
          {/* ✅ BOTÃO LIMPAR FILTROS */}
          {(searchText || searchTab !== 'Todos' || filterType !== 'Todos' || filterRooms !== 'Todos' || filterBathrooms !== 'Todos' || filterNeighborhoods.length > 0) && (
            <button 
              onClick={clearAllFilters}
              className="mt-4 px-6 py-2 border-2 border-[#AF9042] text-[#AF9042] rounded-full text-[10px] uppercase tracking-widest hover:bg-[#AF9042] hover:text-white transition-all"
            >
              🧹 Limpar Todos os Filtros
            </button>
          )}
        </div>

        {/* Barra de Busca + Filtros */}
        <div className="relative flex flex-col items-center w-full mb-12">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100 p-2 md:p-3 rounded-[2rem] flex flex-col md:flex-row items-center gap-2 shadow-xl max-w-4xl w-full">
            <div className="hidden lg:flex items-center px-4 gap-6 text-[9px] font-light text-[#0A1929]/50 uppercase tracking-widest border-r border-gray-100 pr-8">
              {['Comprar', 'Alugar'/* , 'Investir' */].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setSearchTab(tab)} 
                  className={`transition-all hover:text-[#0A1929] ${searchTab === tab ? 'text-[#AF9042] font-medium' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center px-6 gap-3 flex-1">
              <MapPin size={18} strokeWidth={1} className="text-[#AF9042]" />
              <input 
                type="text" 
                placeholder="Bairro, Rua ou Condomínio..." 
                className="bg-transparent border-none outline-none w-full text-[#0A1929] font-light text-sm py-3 placeholder:text-[#0A1929]/30" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-light uppercase tracking-widest transition-all ${isFiltersOpen ? 'bg-[#0A1929] text-white' : 'text-[#0A1929]/70 hover:text-[#0A1929]'}`}
            >
              <SlidersHorizontal size={14} strokeWidth={1} className="text-[#AF9042]" /> 
              <span>Filtros</span> 
              <ChevronDown size={12} className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} />
            </button>
            <button className="bg-[#AF9042] text-white p-4 rounded-full hover:bg-white hover:text-[#0A1929] hover:border hover:border-[#AF9042] transition-all transform hover:scale-105 shadow-xl" onClick={handleSearch}>
              <Search size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* PAINEL DE FILTROS AVANÇADOS - 4 COLUNAS */}
          {isFiltersOpen && (
            <div className="w-full mt-4 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-white rounded-[2rem] p-10 shadow-2xl border border-gray-100 overflow-hidden text-[#0A1929]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  
                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  {/* COLUNA 1: SELEÇÕES                                  */}
                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  <div className="space-y-6">
                    {/* Pretensão */}
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Pretensão</span>
                      <div className="grid grid-cols-2 gap-2">
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
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Tipo de Imóvel</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Todos', 'Apartamento', 'Casa', 'Condomínio', 'Loft'].map(t => (
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
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Quartos</span>
                      <div className="grid grid-cols-5 gap-2">
                        {['Todos', '1+', '2+', '3+', '4+'].map(r => (
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
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Banheiros</span>
                      <div className="grid grid-cols-5 gap-2">
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
                  <div className="space-y-6 border-x border-gray-50 px-6">
                    {/* Metragem */}
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Metragem (m²)</span>
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
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Valor do Imóvel</span>
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
                          <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic">Valor do Aluguel</span>
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
                        <label className="flex items-center gap-3 cursor-pointer group">
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
                  </div>
                  
                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  {/* COLUNA 3: CARACTERÍSTICAS (Scrollable)              */}
                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {/* INFRAESTRUTURA */}
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic sticky top-0 bg-white py-2">Infraestrutura</span>
                      <div className="grid grid-cols-1 gap-3">
                        {infraestruturaOptions.map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
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
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic sticky top-0 bg-white py-2">Imóvel</span>
                      <div className="grid grid-cols-1 gap-3">
                        {imovelOptions.map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
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
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic sticky top-0 bg-white py-2">Diferenciais</span>
                      <div className="grid grid-cols-1 gap-3">
                        {diferenciaisOptions.map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
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
                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 border-l border-gray-50 pl-6">
                    {/* BAIRROS */}
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic sticky top-0 bg-white py-2">Bairros</span>
                      <div className="grid grid-cols-1 gap-3">
                        {availableNeighborhoods.map(item => (
                          <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
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
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#AF9042] font-bold block mb-4 italic sticky top-0 bg-white py-2">Próximo a</span>
                      <div className="grid grid-cols-1 gap-3">
                        {proximidadeOptions.map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
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
          )}
        </div>

        {/* Listagem de Imóveis */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#0A1929]/40 text-lg font-light italic">Nenhum imóvel encontrado com os filtros selecionados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredProperties.map(prop => (
              <PropertyCard key={prop.id} prop={prop} onNavigate={() => navigate(`/imovel/${prop.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}