import { useState } from 'react';
import { Building2, MapPin, DollarSign, Home, Mail, Phone, User, CheckCircle } from 'lucide-react';

export function Anunciar() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-10 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extralight text-[#0A1929] mb-6 tracking-tight">Anuncie seu Imóvel</h1>
          <p className="text-[#0A1929]/60 font-light text-[15px] tracking-wider uppercase max-w-2xl mx-auto">
            Faça parte do portfólio mais exclusivo de imóveis de alto padrão em São Paulo
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-12 text-center animate-in fade-in duration-500">
            <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-[#0A1929] mb-4">Solicitação Enviada!</h3>
            <p className="text-[#0A1929]/60 font-light">
              Em breve um de nossos especialistas entrará em contato para avaliar seu imóvel.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Nome Completo</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <User size={18} className="text-[#AF9042]" />
                  <input 
                    type="text" 
                    required
                    placeholder="Seu nome"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">E-mail</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <Mail size={18} className="text-[#AF9042]" />
                  <input 
                    type="email" 
                    required
                    placeholder="seu@email.com"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Telefone</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <Phone size={18} className="text-[#AF9042]" />
                  <input 
                    type="tel" 
                    required
                    placeholder="(11) 99999-9999"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Tipo de Imóvel</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <Home size={18} className="text-[#AF9042]" />
                  <select required className="flex-1 outline-none text-sm bg-transparent">
                    <option value="">Selecione</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Bairro</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <MapPin size={18} className="text-[#AF9042]" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Jardins"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Pretensão</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <Building2 size={18} className="text-[#AF9042]" />
                  <select required className="flex-1 outline-none text-sm bg-transparent">
                    <option value="">Selecione</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Valor Estimado (Opcional)</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                  <DollarSign size={18} className="text-[#AF9042]" />
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#AF9042] mb-3">Informações Adicionais</label>
                <textarea 
                  rows={6}
                  placeholder="Descreva características, diferenciais e demais informações relevantes sobre o imóvel..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="bg-[#FCFCFC] border border-gray-100 rounded-lg p-8">
              <p className="text-[11px] font-light text-[#0A1929]/60 leading-relaxed italic text-center">
                Ao enviar este formulário, você concorda que a RAVA Imóveis entre em contato para realizar uma avaliação técnica e apresentar nossa proposta de curadoria exclusiva.
              </p>
            </div>

            <div className="flex justify-center">
              <button 
                type="submit"
                className="bg-[#AF9042] text-white px-16 py-4 rounded-full text-[10px] font-light uppercase tracking-[0.3em] hover:bg-[#0A1929] transition-all shadow-xl"
              >
                Enviar Solicitação
              </button>
            </div>
          </form>
        )}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8">
            <div className="text-[#AF9042] mb-4 flex justify-center">
              <CheckCircle size={32} strokeWidth={1} />
            </div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.3em] mb-3 text-[#0A1929]">Avaliação Gratuita</h4>
            <p className="text-[11px] font-light text-[#0A1929]/60 italic">
              Nossos especialistas avaliam seu imóvel sem compromisso
            </p>
          </div>
          
          <div className="p-8">
            <div className="text-[#AF9042] mb-4 flex justify-center">
              <CheckCircle size={32} strokeWidth={1} />
            </div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.3em] mb-3 text-[#0A1929]">Curadoria Seletiva</h4>
            <p className="text-[11px] font-light text-[#0A1929]/60 italic">
              Apenas 5% dos imóveis avaliados entram em nosso catálogo
            </p>
          </div>
          
          <div className="p-8">
            <div className="text-[#AF9042] mb-4 flex justify-center">
              <CheckCircle size={32} strokeWidth={1} />
            </div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.3em] mb-3 text-[#0A1929]">Exposição Global</h4>
            <p className="text-[11px] font-light text-[#0A1929]/60 italic">
              Alcance investidores internacionais de alto padrão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
