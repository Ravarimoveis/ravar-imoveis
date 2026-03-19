import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useProperties, Property } from '../hooks/useProperties';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Trash2, Upload, Plus, Edit, Loader2, LogOut, RefreshCw, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ConveniencesEditor } from '../components/ConveniencesEditor';
import { LifeAroundEditor } from '../components/LifeAroundEditor';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { MOCK_PROPERTIES } from '../data/properties';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e68c254a`;

export default function Admin() {
  const navigate = useNavigate();
  const { properties, loading, createProperty, updateProperty, deleteProperty, uploadImage, refresh } = useProperties();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [cleaningData, setCleaningData] = useState(false);

  // FORMDATA DECLARATION - MUST BE BEFORE ANY USEEFFECT THAT USES IT
  const [formData, setFormData] = useState<Partial<Property>>({
    id: '',
    title: '',
    type: 'Venda',
    category: 'Residencial',
    propertyType: 'Apartamento',
    premiumTags: [],
    price: 0,
    condo: 0,
    iptu: 0,
    area: 0,
    landArea: 0,
    rooms: 0,
    suites: 0,
    baths: 0,
    parking: 0,
    neighborhood: '',
    image: '',
    images: [],
    description: '',
    petPolicy: '',
    features: [],
    amenities: [],
    conveniences: [],
    lifeAround: [],
    location_details: ''
    videoUrl: ''
  });

  // Check authentication on mount (frontend-only)
  useEffect(() => {
    verifyAuth();
  }, []);

  // Debug: Log formData changes for conveniences and lifeAround
  useEffect(() => {
    console.log('🔄 formData.conveniences changed:', formData.conveniences);
  }, [formData.conveniences]);

  useEffect(() => {
    console.log('🔄 formData.lifeAround changed:', formData.lifeAround);
  }, [formData.lifeAround]);

  const verifyAuth = () => {
    console.log('=== Frontend: Verifying Auth (LocalStorage) ===');
    
    const token = localStorage.getItem('admin_access_token');
    const userStr = localStorage.getItem('admin_user');
    
    console.log('Token from localStorage:', token);
    console.log('User from localStorage:', userStr);
    
    if (!token || !userStr) {
      console.log('❌ No token or user found, redirecting to login');
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log('✅ User authenticated:', user.email);
      setVerifyingAuth(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_user');
      navigate('/admin/login', { replace: true });
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user');
    toast.success('Logout realizado com sucesso!');
    navigate('/admin/login');
  };

  const handleCleanupMockData = async () => {
    if (!confirm('Tem certeza que deseja deletar TODOS os imóveis mockados? Esta ação não pode ser desfeita!')) {
      return;
    }

    const keepIds = prompt('Digite os IDs dos imóveis que deseja MANTER (separados por vírgula, ou deixe vazio para deletar tudo):');
    const keepIdsArray = keepIds ? keepIds.split(',').map(id => id.trim()) : [];

    setCleaningData(true);

    try {
      const token = localStorage.getItem('admin_access_token');
      
      const response = await fetch(`${API_BASE}/properties/cleanup/mock-data`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Token': token || '', // Use custom header instead of Authorization
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keepIds: keepIdsArray })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao limpar dados');
      }

      toast.success(result.message);
      refresh();
    } catch (error) {
      console.error('Error cleaning up data:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao limpar dados');
    } finally {
      setCleaningData(false);
    }
  };

  const handleOpenDialog = (property?: Property) => {
    console.log('=== OPENING DIALOG ===');
    console.log('Property to edit:', property);
    
    if (property) {
      setEditingProperty(property);
      
      // Log raw data with detailed type checking
      console.log('RAW property.conveniences:', property.conveniences);
      console.log('Type of conveniences:', typeof property.conveniences);
      console.log('Is array?', Array.isArray(property.conveniences));
      console.log('Conveniences length:', property.conveniences?.length);
      console.log('Conveniences JSON:', JSON.stringify(property.conveniences, null, 2));
      
      console.log('RAW property.lifeAround:', property.lifeAround);
      console.log('Type of lifeAround:', typeof property.lifeAround);
      console.log('Is array?', Array.isArray(property.lifeAround));
      console.log('LifeAround length:', property.lifeAround?.length);
      console.log('LifeAround JSON:', JSON.stringify(property.lifeAround, null, 2));
      
      // CRITICAL FIX: Deep clone and ensure proper structure
      const formDataToSet = {
        ...property,
        conveniences: Array.isArray(property.conveniences) 
          ? property.conveniences.map((item: any, idx: number) => ({
              id: item?.id || idx + 1,
              icon: item?.icon || 'Dog',
              label: item?.label || '',
              desc: item?.desc || ''
            }))
          : [],
        lifeAround: Array.isArray(property.lifeAround)
          ? property.lifeAround.map((item: any, idx: number) => ({
              id: item?.id || idx + 1,
              icon: item?.icon || 'ShoppingBag',
              label: item?.label || ''
            }))
          : []
      };
      
      console.log('FormData to set (conveniences):', JSON.stringify(formDataToSet.conveniences, null, 2));
      console.log('FormData to set (lifeAround):', JSON.stringify(formDataToSet.lifeAround, null, 2));
      
      setFormData(formDataToSet);
      console.log('✅ FormData set successfully');
    } else {
      setEditingProperty(null);
      const newFormData = {
        id: `RAVA-${String(properties.length + 11).padStart(3, '0')}`,
        title: '',
        type: 'Venda' as const,
        category: 'Residencial',
        propertyType: 'Apartamento',
        premiumTags: [],
        price: 0,
        condo: 0,
        iptu: 0,
        area: 0,
        landArea: 0,
        rooms: 0,
        suites: 0,
        baths: 0,
        parking: 0,
        neighborhood: '',
        image: '',
        images: [],
        description: '',
        petPolicy: '',
        features: [],
        amenities: [],
        conveniences: [],
        lifeAround: [],
        location_details: ''
      };
      setFormData(newFormData);
      console.log('FormData initialized for new property');
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImage(file, formData.id || 'temp');
        uploadedUrls.push(url);
        toast.success(`Foto ${i + 1}/${files.length} enviada!`);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls],
        image: prev.image || uploadedUrls[0]
      }));

      toast.success(`${uploadedUrls.length} fotos enviadas com sucesso!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao enviar fotos');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== SUBMITTING FORM ===');
    console.log('Is editing?', !!editingProperty);
    console.log('Property ID:', editingProperty?.id);
    console.log('Form data (RAW):', formData);
    console.log('Form data (JSON):', JSON.stringify(formData, null, 2));
    console.log('Images in formData:', formData.images);
    console.log('Number of images:', formData.images?.length);

    try {
      if (editingProperty) {
        console.log('Calling updateProperty with ID:', editingProperty.id);
        console.log('Updates (JSON):', JSON.stringify(formData, null, 2));
        await updateProperty(editingProperty.id, formData);
        toast.success('Imóvel atualizado com sucesso!');
      } else {
        console.log('Calling createProperty');
        await createProperty(formData as Property);
        toast.success('Imóvel criado com sucesso!');
      }
      setIsDialogOpen(false);
      console.log('Refreshing properties list...');
      await refresh();
      console.log('Properties refreshed successfully');
      // Force a hard refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Erro ao salvar imóvel');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este imóvel?')) return;

    try {
      await deleteProperty(id);
      toast.success('Imóvel deletado com sucesso!');
      refresh();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Erro ao deletar imóvel');
    }
  };

  const handleResetToMock = async (id: string) => {
    const mockProperty = MOCK_PROPERTIES.find(p => p.id === id);
    
    if (!mockProperty) {
      toast.error('Imóvel não encontrado nos dados mockados');
      return;
    }

    if (!confirm(`Tem certeza que deseja RESETAR o imóvel ${id} para os dados originais? Isso vai apagar todas as alterações!`)) {
      return;
    }

    try {
      console.log('🔄 Resetting property to MOCK data:', id);
      console.log('MOCK data:', JSON.stringify(mockProperty, null, 2));
      
      await updateProperty(id, mockProperty as Property);
      toast.success('Imóvel resetado com sucesso para dados originais!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error resetting property:', error);
      toast.error('Erro ao resetar imóvel');
    }
  };

  if (verifyingAuth || loading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#AF9042]" />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#0A1929] text-white pt-24 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0 mb-6 md:mb-8 sticky top-20 bg-[#0A1929] z-40 py-4 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#AF9042] mb-2">Painel Administrativo RAVAR</h1>
            <p className="text-sm md:text-base text-gray-400">Gerencie os imóveis do seu portfólio</p>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button 
              onClick={() => navigate('/admin/sections')}
              variant="outline"
              className="border-[#AF9042] text-[#AF9042] hover:bg-[#AF9042]/10 text-xs md:text-sm"
            >
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Gerenciar Seções</span>
              <span className="sm:hidden">Seções</span>
            </Button>

            <Button 
              onClick={handleCleanupMockData}
              disabled={cleaningData}
              className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm"
            >
              {cleaningData ? (
                <>
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Limpando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Limpar Dados Mockados</span>
                  <span className="sm:hidden">Limpar</span>
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-gray-600 !text-white hover:bg-gray-700 hover:!text-white hover:border-gray-500 text-xs md:text-sm"
              style={{ color: 'white !important' }}
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" style={{ color: 'white' }} />
              <span style={{ color: 'white' }}>Sair</span>
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="bg-[#AF9042] hover:bg-[#8f7635] text-white text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Novo Imóvel
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto bg-[#0A1929] text-white border-[#AF9042]">
                <DialogHeader>
                  <DialogTitle className="text-[#AF9042] text-2xl">
                    {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingProperty ? 'Atualize os detalhes do imóvel' : 'Adicione um novo imóvel ao seu portfólio'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* ID e Título */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="id">ID do Imóvel</Label>
                      <Input
                        id="id"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        placeholder="RAVA-XXX"
                        disabled={!!editingProperty}
                        className="bg-[#1a2332] border-gray-700"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Mansão Exclusiva Cidade Jardim"
                        className="bg-[#1a2332] border-gray-700"
                        required
                      />
                    </div>
                  </div>

                  {/* Tipo e Categoria */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData({ ...formData, type: value as 'Venda' | 'Aluguel' })}
                      >
                        <SelectTrigger className="bg-[#1a2332] border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Venda">Venda</SelectItem>
                          <SelectItem value="Aluguel">Aluguel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: Luxo Extremo"
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyType">Tipo de Imóvel</Label>
                      <Select 
                        value={formData.propertyType} 
                        onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                      >
                        <SelectTrigger className="bg-[#1a2332] border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Cobertura">Cobertura</SelectItem>
                          <SelectItem value="Loft">Loft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="0 = Sob Consulta"
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="condo">Condomínio (R$)</Label>
                      <Input
                        id="condo"
                        type="number"
                        value={formData.condo}
                        onChange={(e) => setFormData({ ...formData, condo: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="iptu">IPTU (R$)</Label>
                      <Input
                        id="iptu"
                        type="number"
                        value={formData.iptu}
                        onChange={(e) => setFormData({ ...formData, iptu: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Características */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="area">Área (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="landArea">Terreno (m²)</Label>
                      <Input
                        id="landArea"
                        type="number"
                        value={formData.landArea}
                        onChange={(e) => setFormData({ ...formData, landArea: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        placeholder="Ex: Cidade Jardim"
                        className="bg-[#1a2332] border-gray-700"
                        required
                      />
                    </div>
                  </div>

                  {/* Quartos, Suítes, Banheiros, Vagas */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="rooms">Quartos</Label>
                      <Input
                        id="rooms"
                        type="number"
                        value={formData.rooms}
                        onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="suites">Suítes</Label>
                      <Input
                        id="suites"
                        type="number"
                        value={formData.suites}
                        onChange={(e) => setFormData({ ...formData, suites: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="baths">Banheiros</Label>
                      <Input
                        id="baths"
                        type="number"
                        value={formData.baths}
                        onChange={(e) => setFormData({ ...formData, baths: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parking">Vagas</Label>
                      <Input
                        id="parking"
                        type="number"
                        value={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                        className="bg-[#1a2332] border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição detalhada do imóvel..."
                      className="bg-[#1a2332] border-gray-700 min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Características do Imóvel (Features) */}
                  <div>
                    <Label htmlFor="features">Características do Imóvel</Label>
                    <Textarea
                      id="features"
                      value={formData.features?.join('\n')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        features: e.target.value.split('\n').filter(f => f.trim()) 
                      })}
                      placeholder="Uma característica por linha&#10;Ex:&#10;Pé direito alto&#10;Janelas amplas&#10;Closet&#10;Lavabo"
                      className="bg-[#1a2332] border-gray-700 min-h-[120px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Digite uma característica por linha</p>
                  </div>

                  {/* Infraestrutura do Prédio (Amenities) */}
                  <div>
                    <Label htmlFor="amenities">Infraestrutura do Prédio</Label>
                    <Textarea
                      id="amenities"
                      value={formData.amenities?.join('\n')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        amenities: e.target.value.split('\n').filter(a => a.trim()) 
                      })}
                      placeholder="Uma amenidade por linha&#10;Ex:&#10;Piscina aquecida&#10;Academia completa&#10;Salão de festas&#10;Quadra poliesportiva"
                      className="bg-[#1a2332] border-gray-700 min-h-[120px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Digite uma infraestrutura por linha</p>
                  </div>

                  {/* Diferenciais e Facilidades (Conveniences) */}
                  <div>
                    <Label htmlFor="conveniences">Diferenciais e Facilidades</Label>
                    <ConveniencesEditor
                      value={Array.isArray(formData.conveniences) ? formData.conveniences : []}
                      onChange={(conveniences) => {
                        console.log('=== ConveniencesEditor onChange ===');
                        console.log('New conveniences:', JSON.stringify(conveniences, null, 2));
                        console.log('Type:', typeof conveniences);
                        console.log('Is Array?:', Array.isArray(conveniences));
                        
                        setFormData(prev => {
                          const updated = { 
                            ...prev, 
                            conveniences: Array.isArray(conveniences) ? [...conveniences] : []
                          };
                          console.log('Updated formData.conveniences:', JSON.stringify(updated.conveniences, null, 2));
                          return updated;
                        });
                      }}
                    />
                  </div>

                  {/* Vida ao Redor (Life Around) */}
                  <div>
                    <Label htmlFor="lifeAround">Vida ao Redor</Label>
                    <LifeAroundEditor
                      value={Array.isArray(formData.lifeAround) ? formData.lifeAround : []}
                      onChange={(lifeAround) => {
                        console.log('=== LifeAroundEditor onChange ===');
                        console.log('New lifeAround:', JSON.stringify(lifeAround, null, 2));
                        console.log('Type:', typeof lifeAround);
                        console.log('Is Array?:', Array.isArray(lifeAround));
                        
                        setFormData(prev => {
                          const updated = { 
                            ...prev, 
                            lifeAround: Array.isArray(lifeAround) ? [...lifeAround] : []
                          };
                          console.log('Updated formData.lifeAround:', JSON.stringify(updated.lifeAround, null, 2));
                          return updated;
                        });
                      }}
                    />
                  </div>

                  {/* Detalhes da Localização */}
                  <div>
                    <Label htmlFor="location_details">Detalhes da Localização e Bairro</Label>
                    <Textarea
                      id="location_details"
                      value={formData.location_details}
                      onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                      placeholder="Descrição detalhada do bairro, pontos de interesse, transporte, comércio local..."
                      className="bg-[#1a2332] border-gray-700 min-h-[100px]"
                    />
                  </div>

                  {/* Upload de Imagens */}
                  <div>
                    <Label htmlFor="images">Fotos do Imóvel</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-[#1a2332]">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-[#AF9042] mx-auto" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-[#AF9042] mx-auto mb-2" />
                            <p className="text-sm text-gray-400">
                              Clique para fazer upload de fotos (múltiplas)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    {formData.images && formData.images.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm text-gray-400 mb-2 block">
                          Galeria de Fotos - Clique em uma foto para definir como CAPA
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                          {formData.images.map((url, index) => (
                            <div 
                              key={index} 
                              className={`relative cursor-pointer group ${
                                formData.image === url ? 'ring-4 ring-[#AF9042]' : ''
                              }`}
                              onClick={() => setFormData({ ...formData, image: url })}
                            >
                              <img 
                                src={url} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-20 object-cover rounded" 
                              />
                              
                              {/* ✅ MARCA D'ÁGUA AUTOMÁTICA NO PREVIEW */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-white/40 text-[8px] sm:text-[10px] font-extralight tracking-wider rotate-[-45deg] select-none">
                                  RAVAR
                                </div>
                              </div>
                              
                              {formData.image === url && (
                                <div className="absolute inset-0 bg-[#AF9042]/20 flex items-center justify-center rounded">
                                  <span className="bg-[#AF9042] text-white text-xs px-2 py-1 rounded font-bold">
                                    CAPA
                                  </span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newImages = formData.images?.filter((_, i) => i !== index);
                                  setFormData({ 
                                    ...formData, 
                                    images: newImages,
                                    // Se deletou a capa, define a primeira como nova capa
                                    image: formData.image === url ? (newImages?.[0] || '') : formData.image
                                  });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botões */}
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-[#AF9042] hover:bg-[#8f7635] text-white"
                    >
                      {editingProperty ? 'Atualizar' : 'Criar'} Imóvel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="bg-[#1a2332] border-gray-700 overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-[#AF9042] text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                  {property.id}
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-1">{property.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">{property.neighborhood}</p>
                <p className="text-[#AF9042] font-bold mb-3 md:mb-4 text-sm md:text-base">
                  {property.price > 0 
                    ? property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'Sob Consulta'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => handleOpenDialog(property)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm py-2"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(property.id)}
                    variant="destructive"
                    className="flex-1 text-xs md:text-sm py-2"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Deletar
                  </Button>
                  <Button
                    onClick={() => handleResetToMock(property.id)}
                    variant="outline"
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs md:text-sm py-2"
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Resetar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

{/* video youtube */}
<div>
  <Label htmlFor="videoUrl">Link do Vídeo (YouTube)</Label>
  <Input
    id="videoUrl"
    value={formData.videoUrl || ''}
    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
    placeholder="Ex: https://www.youtube.com/watch?v=..."
    className="bg-[#1a2332] border-gray-700"
  />
  <p className="text-xs text-gray-500 mt-1">Cole aqui o link do vídeo que você subiu.</p>
</div>
