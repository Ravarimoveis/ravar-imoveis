import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useProperties, Property } from '../hooks/useProperties';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Trash2, Upload, Plus, Edit, Loader2, LogOut, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e68c254a`;

export default function Admin() {
  const navigate = useNavigate();
  const { properties, loading, createProperty, updateProperty, deleteProperty, uploadImage, refresh } = useProperties();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [cleaningData, setCleaningData] = useState(false);

  // Check authentication on mount (frontend-only)
  useEffect(() => {
    verifyAuth();
  }, []);

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
    location_details: ''
  });

  const handleOpenDialog = (property?: Property) => {
    console.log('=== OPENING DIALOG ===');
    console.log('Property to edit:', JSON.stringify(property, null, 2));
    
    if (property) {
      setEditingProperty(property);
      setFormData(property);
      console.log('FormData set to:', JSON.stringify(property, null, 2));
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

  if (verifyingAuth || loading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#AF9042]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#AF9042] mb-2">Painel Administrativo RAVAR</h1>
            <p className="text-gray-400">Gerencie os imóveis do seu portfólio</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleCleanupMockData}
              disabled={cleaningData}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cleaningData ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Limpando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Dados Mockados
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="bg-[#AF9042] hover:bg-[#8f7635] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Imóvel
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A1929] text-white border-[#AF9042]">
                <DialogHeader>
                  <DialogTitle className="text-[#AF9042] text-2xl">
                    {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingProperty ? 'Atualize os detalhes do imóvel' : 'Adicione um novo imóvel ao seu portfólio'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  {/* Upload de Imagens */}
                  <div>
                    <Label htmlFor="images">Fotos do Imóvel</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-[#1a2332]">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="bg-[#1a2332] border-gray-700 overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-[#AF9042] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.id}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{property.neighborhood}</p>
                <p className="text-[#AF9042] font-bold mb-4">
                  {property.price > 0 
                    ? property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'Sob Consulta'
                  }
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleOpenDialog(property)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(property.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
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