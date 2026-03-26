import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Dog, Home, Building, Car, Waves, Dumbbell, Users, Baby, Bike, Wifi, Wind, Droplets, 
  Trees, ShieldCheck, Camera, Sparkles, Sun, Mountain, MapPin, Zap,
  Coffee, ShoppingBag, PlusSquare, Fuel, UtensilsCrossed, GraduationCap, Hospital,
  Bus, Train, Plane, Building2, Church, Film, Music, Landmark,
  BedDouble, Bath, Square, ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight, X,
  Minus, CheckCircle2, Calendar, ImageIcon, Play
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { LazyImage } from '../components/LazyImage';
import { useProperties } from '../hooks/useProperties';
import { formatCurrency } from '../data/properties';
import { MarcaDaguaPlaceholder } from '../components/LogoPlaceholder';

// Marca d'água from public folder
const marcaDagua = '/ravar-marca-dagua.png';

// Map icon names to actual icon components
const iconMap: { [key: string]: any } = {
  Dog, Home, Building, Car, Waves, Dumbbell, Users, Baby, Bike, Wifi, Wind, Droplets, 
  Trees, ShieldCheck, Camera, Sparkles, Sun, Mountain, MapPin, Zap,
  Coffee, ShoppingBag, PlusSquare, Fuel, UtensilsCrossed, GraduationCap, Hospital,
  Bus, Train, Plane, Building2, Church, Film, Music, Landmark,
  BedDouble, Bath, Square
};

export function PropertyDetail() {
  const { id } = useParams();
  const { properties, loading } = useProperties();
  const property = properties.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [marcaDaguaError, setMarcaDaguaError] = useState(false);

  // Scroll to top quando abrir a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset image loaded state when selectedImage changes
  useEffect(() => {
    setMainImageLoaded(false);
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <p className="text-[#0A1929]/60">Carregando imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <p className="text-[#0A1929]/60">Imóvel não encontrado</p>
      </div>
    );
  }

  const isAluguel = property.type === 'Aluguel';
  const totalValue = isAluguel ? (property.price + (property.condo || 0) + (property.iptu || 0)) : property.price;
  
  // Função para extrair o ID do vídeo do YouTube
  const getYouTubeID = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[8].length === 11) ? match[8] : null;
  };

  const videoId = property.videoUrl ? getYouTubeID(property.videoUrl) : null;
  
  // Criar array de mídia (vídeo + imagens)
  const hasGallery = property.images && property.images.length > 0;
  const mediaItems: Array<{ type: 'video' | 'image', content: string }> = [];
  
  // Se tem vídeo principal, adiciona como primeiro item
  if (videoId) {
    mediaItems.push({ type: 'video', content: videoId });
  }
  
  // Adiciona vídeos adicionais do array videoUrls
  if (property.videoUrls && Array.isArray(property.videoUrls)) {
    property.videoUrls.forEach(url => {
      if (url) {
        const additionalVideoId = getYouTubeID(url);
        if (additionalVideoId) {
          mediaItems.push({ type: 'video', content: additionalVideoId });
        }
      }
    });
  }
  
  // Adiciona as imagens
  if (hasGallery) {
    property.images.forEach(img => mediaItems.push({ type: 'image', content: img }));
  } else if (property.image) {
    mediaItems.push({ type: 'image', content: property.image });
  }
  
  const hasMedia = mediaItems.length > 0;
  const totalPhotos = mediaItems.filter(m => m.type === 'image').length;

  const openWhatsAppInfo = () => {
    const msg = encodeURIComponent(`Olá! Vi o imvel *${property.title}* (Ref: ${property.id}) no site da RAVAR Imóveis e gostaria de saber mais informações sobre este imóvel. Aguardo retorno!`);
    window.open(`https://api.whatsapp.com/send?phone=5511972013159&text=${msg}`, '_blank');
  };

  const openWhatsAppSchedule = () => {
    const msg = encodeURIComponent(`Olá! Vi o imóvel *${property.title}* (Ref: ${property.id}) no site da RAVAR Imóveis e gostei muito! Gostaria de agendar uma visita para conhecer pessoalmente. Quando podemos agendar?`);
    window.open(`https://api.whatsapp.com/send?phone=5511972013159&text=${msg}`, '_blank');
  };

  return (
    <div className="pt-40 pb-24 animate-in slide-in-from-bottom-4 duration-1000 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 gap-6 md:gap-8 text-left">
          <div className="flex flex-col max-w-2xl text-left">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-left flex-wrap">
              <span className="text-[#AF9042] text-[9px] font-light uppercase tracking-[0.4em] border-b border-[#AF9042] pb-1">Ref: {property.id}</span>
              <span className="text-[#0A1929]/30 text-[9px] font-light uppercase tracking-[0.4em] italic">Curadoria Rava Imóveis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-[#0A1929] mb-4 leading-tight tracking-tight italic">{property.title}</h1>
            <p className="flex items-center gap-2 text-[#0A1929]/50 font-light text-[13px] tracking-widest uppercase">
              <MapPin size={16} strokeWidth={1} className="text-[#AF9042]" /> {property.neighborhood}, São Paulo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start text-left">
          
          <div className="lg:col-span-8 text-left">
            {/* Badges de Fotos e Vídeo - ACIMA do carrossel - MOBILE OPTIMIZED */}
            {hasMedia && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                {totalPhotos > 0 && (
                  <div className="bg-white/90 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-[9px] md:text-[10px] font-light uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[#0A1929] shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 border border-gray-100 rounded-sm">
                    <ImageIcon size={12} className="sm:w-[13px] sm:h-[13px] md:w-[14px] md:h-[14px] text-[#AF9042]" /> {totalPhotos} {totalPhotos > 1 ? 'Fotos' : 'Foto'}
                  </div>
                )}
                {videoId && (
                  <div className="bg-white/90 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-[9px] md:text-[10px] font-light uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[#0A1929] shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 border border-gray-100 rounded-sm">
                    <Play size={12} className="sm:w-[13px] sm:h-[13px] md:w-[14px] md:h-[14px] text-[#AF9042]" /> Video
                  </div>
                )}
              </div>
            )}

            <div className="mb-8 md:mb-12 group relative overflow-hidden rounded-sm shadow-xl">
               {/* Renderiza vídeo OU imagem */}
               {mediaItems[selectedImage]?.type === 'video' ? (
                 <div className="relative w-full aspect-video bg-black">
                   <iframe
                     className="absolute top-0 left-0 w-full h-full"
                     src={`https://www.youtube.com/embed/${mediaItems[selectedImage].content}`}
                     title="Vídeo do Imóvel"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                   />
                 </div>
               ) : (
                 <>
                   <LazyImage 
                     src={mediaItems[selectedImage]?.content || ''} 
                     className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] object-cover transition-all duration-[3s] group-hover:scale-105" 
                     alt={property.title} 
                     onLoad={() => setMainImageLoaded(true)}
                   />
                   
                   {/* ✅ MARCA D'ÁGUA AUTOMÁTICA - IMAGEM OU FALLBACK */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     {marcaDaguaError ? (
                       <MarcaDaguaPlaceholder className="w-[75%] sm:w-[67%] md:w-[60%] lg:w-[52%] opacity-20" />
                     ) : (
                       <img 
                         src={marcaDagua} 
                         alt="" 
                         className="w-[75%] sm:w-[67%] md:w-[60%] lg:w-[52%] opacity-20 select-none"
                         onError={() => setMarcaDaguaError(true)}
                       />
                     )}
                   </div>
                 </>
               )}
            </div>

            {mediaItems.length > 1 && (
              <div className="mb-8 sm:mb-10 md:mb-12 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 sm:gap-3 md:gap-4 pb-2 sm:pb-3 md:pb-4 min-w-max">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 md:w-32 md:h-24 rounded-sm overflow-hidden border-2 transition-all relative ${
                        selectedImage === idx ? 'border-[#AF9042] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <>
                          <img 
                            src={`https://img.youtube.com/vi/${item.content}/mqdefault.jpg`}
                            className="w-full h-full object-cover" 
                            alt="Thumbnail do vídeo" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play size={24} className="sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px] text-white" fill="white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <LazyImage 
                            src={item.content} 
                            loading="lazy"
                            className="w-full h-full object-cover" 
                            alt={`${property.title} - ${idx + 1}`} 
                          />
                          
                          {/* ✅ MARCA D'ÁGUA AUTOMÁTICA NAS THUMBNAILS */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {marcaDaguaError ? (
                              <MarcaDaguaPlaceholder className="w-full opacity-30" />
                            ) : (
                              <img 
                                src={marcaDagua} 
                                alt="" 
                                className="w-full opacity-30 select-none"
                                onError={() => setMarcaDaguaError(true)}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-y border-gray-100 py-12 md:py-16 mb-16 md:mb-20">
               <div className="flex flex-col gap-3 items-center text-center">
                 <Square size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Área Útil</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.area} m²</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <BedDouble size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Suítes</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.suites}</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <Bath size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Banheiros</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.baths}</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <Car size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Vagas</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.parking}</span>
               </div>
            </div>

            <div className="mb-16 md:mb-24 text-left">
              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">O Imóvel</h3>
              </div>
              <p className="text-[#0A1929]/60 font-light text-[14px] md:text-[15px] leading-loose italic max-w-3xl mb-12 md:mb-16 border-l border-[#AF9042]/20 pl-4 md:pl-8">
                "{property.description}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12 md:gap-x-20 mb-16 md:mb-20">
                {property.features?.map(f => (
                  <div key={f} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-light text-[#0A1929] border-b border-gray-50 pb-3 md:pb-4 uppercase tracking-wide md:tracking-widest">
                    <CheckCircle2 size={14} strokeWidth={1} className="text-[#AF9042] flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">Infraestrutura do Prédio</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12 md:gap-x-20 mb-16 md:mb-20 p-6 md:p-10 bg-slate-50/50 rounded-sm">
                {property.amenities?.map(a => (
                  <div key={a} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-light text-[#0A1929] uppercase tracking-wide md:tracking-widest">
                    <ShieldCheck size={14} strokeWidth={1} className="text-[#AF9042] flex-shrink-0" /> {a}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">Diferenciais & Facilidades</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
                {/* Render conveniences dynamically */}
                {property.conveniences && property.conveniences.length > 0 && property.conveniences.map((conv) => {
                  const IconComponent = iconMap[conv.icon] || Dog;
                  return (
                    <div key={conv.id} className="flex items-center gap-6 p-8 border border-gray-100 rounded-sm group">
                       <IconComponent size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1929]">{conv.label}</p>
                         <p className="text-[11px] font-light text-[#0A1929]/60 italic">{conv.desc}</p>
                       </div>
                    </div>
                  );
                })}

                {/* Fallback message if no conveniences */}
                {(!property.conveniences || property.conveniences.length === 0) && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-[11px] font-light text-[#0A1929]/40 italic">
                      Nenhum diferencial cadastrado para este imóvel
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">Vida no Entorno</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 text-center">
                {/* Render lifeAround dynamically */}
                {property.lifeAround && property.lifeAround.length > 0 ? (
                  property.lifeAround.map((life) => {
                    const IconComponent = iconMap[life.icon] || Coffee;
                    return (
                      <div key={life.id} className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                         <IconComponent size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">{life.label}</span>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to default items
                  <>
                    <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                       <Coffee size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Padarias</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                       <PlusSquare size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Farmácias</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                       <Fuel size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Postos</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                       <ShoppingBag size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Mercados</span>
                    </div>
                  </>
                )}
              </div>

              <div className="h-[450px] bg-slate-100 rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-[3s]">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-30" alt="Mapa" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-6 shadow-2xl rounded-sm flex flex-col items-center">
                     <MapPin size={32} className="text-[#AF9042] mb-2 animate-bounce" />
                     <p className="text-[11px] font-light uppercase tracking-widest text-[#0A1929]">{property.neighborhood}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 self-start lg:sticky lg:top-32">
            <div className="space-y-6 md:space-y-8 pb-12 md:pb-20">
              <div className="p-6 md:p-10 border border-gray-100 rounded-sm bg-[#FCFCFC] shadow-sm">
                 <span className="text-[10px] font-light uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#AF9042] mb-2 block italic">
                   {isAluguel ? 'Pacote Total Mensal' : 'Valor de Investimento'}
                 </span>
                 <h2 className="text-2xl md:text-3xl font-light text-[#0A1929] mb-4 md:mb-6">{formatCurrency(totalValue)}</h2>
                 <div className="flex flex-col gap-2 text-[10px] md:text-[11px] font-light text-[#0A1929]/50 uppercase tracking-[0.1em] border-t border-gray-100 pt-4 md:pt-6">
                    <div className="flex justify-between"><span>{isAluguel ? 'Aluguel' : 'Valor'}</span> <span>{formatCurrency(property.price)}</span></div>
                    <div className="flex justify-between"><span>Condomínio</span> <span>{formatCurrency(property.condo)}</span></div>
                    <div className="flex justify-between"><span>IPTU Mensal</span> <span>{formatCurrency(property.iptu)}</span></div>
                 </div>
              </div>
              <div className="bg-[#0A1929] p-6 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="mb-6 md:mb-10">
                  <p className="text-white text-[13px] md:text-[14px] font-light leading-tight">Quer saber mais</p>
                  <p className="text-[#AF9042] text-[13px] md:text-[14px] font-light leading-tight">sobre este imóvel?</p>
                </div>
                <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                  <button onClick={openWhatsAppInfo} className="w-full bg-[#AF9042] text-white py-4 md:py-6 text-[9px] md:text-[10px] font-light uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white hover:text-[#0A1929] transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl border border-[#AF9042]">
                    <FaWhatsapp size={16} className="md:w-[18px] md:h-[18px]" /> Quero Saber Mais
                  </button>
                  <button onClick={openWhatsAppSchedule} className="w-full border border-white/20 text-white py-4 md:py-6 text-[9px] md:text-[10px] font-light uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 md:gap-3">
                    <Calendar size={14} strokeWidth={1} className="text-[#AF9042] md:w-4 md:h-4" /> Agendar Visita
                  </button>
                </div>
                <div className="pt-6 md:pt-10 border-t border-white/10 flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 grayscale opacity-40 flex-shrink-0">
                    <ShieldCheck size={20} className="md:w-6 md:h-6 text-[#AF9042]" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-light uppercase tracking-widest text-[#AF9042] mb-1">Especialista Rava</p>
                    <p className="text-[10px] md:text-[11px] font-light text-white/50 italic tracking-wide">Consultoria Bilíngue 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}