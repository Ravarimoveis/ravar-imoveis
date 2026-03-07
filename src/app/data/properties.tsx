// Função auxiliar para formatar moeda
export const formatCurrency = (value: number) => {
  if (!value || value === 0) return 'Sob Consulta';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// MOCK DATA - usado como fallback ou para migração inicial
export const MOCK_PROPERTIES = [
  {
    id: "RAVA-010",
    title: "Mansão Exclusiva Cidade Jardim",
    type: "Venda",
    category: "Luxo Extremo",
    propertyType: "Casa",
    premiumTags: ["piscina", "jardim", "academia", "spa", "quadra", "pet", "cinema"],
    price: 0, // Sob Consulta
    condo: 0,
    iptu: 0,
    area: 1750,
    landArea: 2000,
    rooms: 7,
    suites: 5,
    baths: 7,
    parking: 12,
    neighborhood: "Cidade Jardim",
    image: "https://images.unsplash.com/photo-1635111300332-47145b118f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYW5zaW9uJTIwZXh0ZXJpb3IlMjBwb29sfGVufDF8fHx8MTc3MjgxMjMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1635111300332-47145b118f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYW5zaW9uJTIwZXh0ZXJpb3IlMjBwb29sfGVufDF8fHx8MTc3MjgxMjMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1639059851892-95c80412298c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGxpdmluZyUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzI4MTIzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1759223198981-661cadbbff36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtYW5zaW9uJTIwYmVkcm9vbSUyMHN1aXRlfGVufDF8fHx8MTc3MjgxMjMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1769326541248-5e09a8ace25b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwa2l0Y2hlbiUyMGdvdXJtZXR8ZW58MXx8fHwxNzcyODEyMzA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Exclusividade absoluta no único condomínio fechado de São Paulo com terrenos de 2.000m². Esta mansão extraordinária combina privacidade, segurança e sofisticação a apenas 800 metros do Shopping Cidade Jardim.",
    petPolicy: "Aceita Animais de todos os portes",
    features: [
      "Terreno 2.000m²",
      "Área Construída 1.750m²",
      "5 Suítes Master",
      "2 Escritórios Privativos",
      "Quadra de Tênis Oficial",
      "Cinema Privativo",
      "Academia Completa",
      "Salão Gourmet",
      "Paisagismo Exclusivo",
      "Garagem 12 Carros",
      "Piscina Aquecida",
      "Segurança 24h"
    ],
    amenities: [
      "Condomínio Único SP - Terrenos 2.000m²",
      "Segurança Armada 24h",
      "Portaria Blindada",
      "Circuito Fechado CFTV",
      "Área Verde Preservada",
      "Rua Privativa",
      "Infraestrutura Resort",
      "A 800m Shopping Cidade Jardim"
    ],
    conveniences: [
      { id: 1, icon: 'ShieldCheck', label: "Exclusividade", desc: "Único condomínio fechado com terrenos de 2.000m² em SP" },
      { id: 2, icon: 'MapPin', label: "Localização Premium", desc: "800 metros do Shopping Cidade Jardim" },
      { id: 3, icon: 'Dumbbell', label: "Infraestrutura Completa", desc: "Quadra tênis, cinema, academia e salão gourmet" }
    ],
    lifeAround: [
      { id: 1, icon: 'ShoppingBag', label: "Shopping Cidade Jardim" },
      { id: 2, icon: 'UtensilsCrossed', label: "Restaurantes Premium" },
      { id: 3, icon: 'GraduationCap', label: "Escolas de Elite" },
      { id: 4, icon: 'Trees', label: "Parque Ibirapuera" }
    ],
    location_details: "Único condomínio fechado de São Paulo com terrenos de 2.000m², a 800m do Shopping Cidade Jardim."
  },
  {
    id: "RAVA-001",
    title: "Residência Garden Itaim",
    type: "Venda",
    category: "Residencial",
    propertyType: "Apartamento",
    premiumTags: ["pet", "piscina", "spa", "varanda", "pronto", "jardim", "smarthome"],
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
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"],
    description: "Uma obra-prima de minimalismo e luz natural no coração do Itaim. Este garden privativo oferece o silêncio de uma casa com a segurança de um dos edifícios mais exclusivos de São Paulo.",
    petPolicy: "Aceita Animais de grande porte",
    features: ["Ar Condicionado Central", "Automação Lutron", "Varanda Gourmet", "Pé Direito Duplo", "Mármore Travertino", "Cozinha Gourmet"],
    amenities: ["Concierge 24h", "Piscina Aquecida", "Academia Technogym", "Spa e Sauna", "Segurança Armada", "Vagas de Visitante"],
    conveniences: [
      { id: 1, icon: 'Zap', label: "Carga Elétrica", desc: "Infraestrutura para carro elétrico" },
      { id: 2, icon: 'Users', label: "Visitantes", desc: "10 vagas internas dedicadas" },
      { id: 3, icon: 'Accessibility', label: "Acessível", desc: "Totalmente adaptado para PNE" },
      { id: 4, icon: 'Archive', label: "Depósito", desc: "Depósito privativo de 6m²" }
    ],
    lifeAround: [
      { id: 1, icon: 'Trees', label: "Parque do Povo" },
      { id: 2, icon: 'Coffee', label: "Cafeterias" },
      { id: 3, icon: 'ShoppingBag', label: "Comércio Local" }
    ],
    location_details: "A 300m do Parque do Povo."
  }
];

// NEIGHBORHOOD PAGES - para o carrossel de bairros na homepage
export const NEIGHBORHOOD_PAGES = [
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