import { useState } from 'react';
import { Phone, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar mensagem via WhatsApp com os dados do formulário
    const msg = encodeURIComponent(
      `*Nova mensagem do site RAVAR Imóveis*\\n\\n` +
      `*Nome:* ${formData.name}\\n` +
      `*E-mail:* ${formData.email}\\n` +
      `*Telefone:* ${formData.phone}\\n` +
      `*Mensagem:* ${formData.message}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511972013159&text=${msg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent('Olá! Estou visitando o site da RAVAR Imóveis e gostaria de falar com um consultor especializado.');
    window.open(`https://api.whatsapp.com/send?phone=5511972013159&text=${msg}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-10 lg:px-20">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="text-[#AF9042] text-[9px] font-light uppercase tracking-[0.5em] block mb-6">
            Atendimento Personalizado
          </span>
          <h1 className="text-5xl md:text-6xl font-extralight text-[#0A1929] mb-6 leading-tight tracking-tight italic">
            Entre em Contato
          </h1>
          <p className="text-[#0A1929]/60 font-light text-[15px] max-w-2xl mx-auto leading-relaxed">
            Nossa equipe de especialistas está pronta para atendê-lo com excelência. 
            Consultoria bilíngue disponível 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Card - Apenas botão, sem número visível */}
            <div 
              onClick={openWhatsApp}
              className="bg-[#0A1929] p-10 rounded-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF9042]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#AF9042]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#AF9042]/20 transition-colors">
                  <FaWhatsapp size={28} className="text-[#AF9042]" />
                </div>
                <h3 className="text-xl font-light text-white mb-3 uppercase tracking-[0.2em]">
                  WhatsApp
                </h3>
                <p className="text-white/60 font-light text-sm mb-6 leading-relaxed">
                  Atendimento imediato via WhatsApp. Fale agora com um especialista.
                </p>
                <div className="flex items-center gap-2 text-[#AF9042] text-xs uppercase tracking-widest">
                  <span>Clique para conversar</span>
                  <Send size={12} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white border border-gray-100 p-10 rounded-sm shadow-sm hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-[#AF9042]/5 rounded-full flex items-center justify-center mb-6">
                <Phone size={28} strokeWidth={1} className="text-[#AF9042]" />
              </div>
              <h3 className="text-xl font-light text-[#0A1929] mb-3 uppercase tracking-[0.2em]">
                Telefone
              </h3>
              <p className="text-[#0A1929]/60 font-light text-sm mb-4 leading-relaxed">
                Ligue diretamente para falar com nossa equipe.
              </p>
              <a 
                href="tel:+5511972013159"
                className="text-[#AF9042] font-light text-lg tracking-wider hover:underline"
              >
                +55 11 97201-3159
              </a>
            </div>

            {/* Hours Card */}
            <div className="bg-slate-50 border border-gray-100 p-10 rounded-sm">
              <div className="w-16 h-16 bg-[#AF9042]/5 rounded-full flex items-center justify-center mb-6">
                <Clock size={28} strokeWidth={1} className="text-[#AF9042]" />
              </div>
              <h3 className="text-xl font-light text-[#0A1929] mb-6 uppercase tracking-[0.2em]">
                Horário de Atendimento
              </h3>
              <div className="space-y-3 text-sm font-light text-[#0A1929]/70">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="uppercase tracking-wider">Segunda - Sexta</span>
                  <span className="text-[#AF9042]">9h - 19h</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="uppercase tracking-wider">Sábado</span>
                  <span className="text-[#AF9042]">9h - 14h</span>
                </div>
                <div className="flex justify-between items-center pb-3">
                  <span className="uppercase tracking-wider">WhatsApp</span>
                  <span className="text-[#AF9042]">24/7</span>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 p-12 rounded-sm shadow-lg sticky top-32">
              <h3 className="text-2xl font-extralight text-[#0A1929] mb-2 uppercase tracking-[0.3em]">
                Envie sua Mensagem
              </h3>
              <p className="text-[#0A1929]/60 font-light text-sm mb-10 leading-relaxed">
                Preencha o formulário e suas informações serão enviadas automaticamente via WhatsApp.
              </p>

              {submitted ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h4 className="text-xl font-light text-[#0A1929] mb-3">Mensagem Enviada!</h4>
                  <p className="text-[#0A1929]/60 font-light text-sm">
                    Redirecionando para o WhatsApp...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#0A1929]/70 mb-3 font-light">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 border border-gray-200 rounded-sm text-[#0A1929] font-light focus:outline-none focus:border-[#AF9042] transition-colors bg-white"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#0A1929]/70 mb-3 font-light">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-sm text-[#0A1929] font-light focus:outline-none focus:border-[#AF9042] transition-colors bg-white"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#0A1929]/70 mb-3 font-light">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-sm text-[#0A1929] font-light focus:outline-none focus:border-[#AF9042] transition-colors bg-white"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#0A1929]/70 mb-3 font-light">
                      Mensagem *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-4 border border-gray-200 rounded-sm text-[#0A1929] font-light focus:outline-none focus:border-[#AF9042] transition-colors resize-none bg-white"
                      placeholder="Conte-nos como podemos ajudá-lo..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#AF9042] text-white py-6 text-xs font-light uppercase tracking-[0.3em] hover:bg-[#0A1929] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Send size={18} strokeWidth={1} />
                    Enviar Mensagem
                  </button>

                  <p className="text-xs text-[#0A1929]/40 text-center font-light italic">
                    Ao enviar, você será redirecionado para o WhatsApp com sua mensagem pronta.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Map Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extralight text-[#0A1929] mb-4 uppercase tracking-[0.3em]">
              Nossa Localização
            </h3>
            <p className="text-[#0A1929]/60 font-light text-sm flex items-center justify-center gap-2">
              <MapPin size={16} className="text-[#AF9042]" />
              São Paulo - SP
            </p>
          </div>
          
          <div className="h-[500px] bg-slate-100 rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" 
              className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700" 
              alt="Mapa de São Paulo" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-10 shadow-2xl rounded-sm text-center max-w-md">
                <MapPin size={48} className="text-[#AF9042] mb-4 animate-bounce mx-auto" />
                <h4 className="text-xl font-light text-[#0A1929] mb-2 uppercase tracking-widest">
                  RAVAR Imóveis
                </h4>
                <p className="text-sm font-light text-[#0A1929]/60 leading-relaxed mb-6">
                  Atendemos toda a região de São Paulo com especialização em imóveis de alto padrão.
                </p>
                <button 
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#AF9042] hover:text-[#0A1929] transition-colors font-light"
                >
                  <FaWhatsapp size={16} />
                  Falar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#0A1929] p-16 rounded-sm text-center">
          <h3 className="text-3xl font-extralight text-white mb-6 uppercase tracking-[0.3em]">
            Pronto para Encontrar seu Imóvel Ideal?
          </h3>
          <p className="text-white/60 font-light text-sm mb-10 max-w-2xl mx-auto leading-relaxed">
            Nossa equipe especializada está pronta para ajudá-lo a encontrar o imóvel perfeito 
            que atenda todas as suas necessidades e expectativas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openWhatsApp}
              className="bg-[#AF9042] text-white px-12 py-5 text-xs font-light uppercase tracking-[0.3em] hover:bg-white hover:text-[#0A1929] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <FaWhatsapp size={18} />
              Falar com Especialista
            </button>
            <a
              href="/explorar"
              className="border border-white/20 text-white px-12 py-5 text-xs font-light uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              Explorar Imóveis
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}