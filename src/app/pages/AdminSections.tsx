import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Loader2, Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e68c254a`;

interface SectionConfig {
  neighborhoodsEnabled: boolean;
  neighborhoodsTitle: string;
  categoriesEnabled: boolean;
  categoriesTitle: string;
}

export default function AdminSections() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SectionConfig>({
    neighborhoodsEnabled: true,
    neighborhoodsTitle: 'Explore por bairros',
    categoriesEnabled: true,
    categoriesTitle: 'Buscar por Categoria'
  });

  useEffect(() => {
    verifyAuth();
    loadConfig();
  }, []);

  const verifyAuth = () => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  };

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE}/sections/config`, {
        headers: {
          'X-Admin-Token': token || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.config) {
          setConfig(data.config);
        }
      }
    } catch (error) {
      console.log('Config not found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE}/sections/config`, {
        method: 'POST',
        headers: {
          'X-Admin-Token': token || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        throw new Error(result.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#AF9042]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929] text-white pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Imóveis
          </Button>
          <h1 className="text-4xl font-bold text-[#AF9042] mb-2">Gerenciar Seções da Homepage</h1>
          <p className="text-gray-400">Configure as seções "Explore por Bairros" e "Buscar por Categoria"</p>
        </div>

        <div className="space-y-6">
          {/* Seção: Explore por Bairros */}
          <Card className="bg-[#1a2332] border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#AF9042] mb-1">Explore por Bairros</h2>
                <p className="text-sm text-gray-400">Galeria de bairros com fotos e links para filtros</p>
              </div>
              <Button
                onClick={() => setConfig({ ...config, neighborhoodsEnabled: !config.neighborhoodsEnabled })}
                className={`${
                  config.neighborhoodsEnabled 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {config.neighborhoodsEnabled ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Visível
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Oculto
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="neighborhoodsTitle">Título da Seção</Label>
                <Input
                  id="neighborhoodsTitle"
                  value={config.neighborhoodsTitle}
                  onChange={(e) => setConfig({ ...config, neighborhoodsTitle: e.target.value })}
                  placeholder="Ex: Explore por bairros"
                  className="bg-[#0A1929] border-gray-700"
                />
              </div>

              <div className="bg-[#0A1929] p-4 rounded border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">💡 <strong>Nota:</strong></p>
                <p className="text-xs text-gray-500">
                  As fotos e bairros são configurados diretamente no código (Home.tsx).
                  Para editar os bairros disponíveis, fotos e links de filtro, você precisa
                  modificar o array NEIGHBORHOOD_PAGES no arquivo /src/app/pages/Home.tsx
                </p>
              </div>
            </div>
          </Card>

          {/* Seção: Buscar por Categoria */}
          <Card className="bg-[#1a2332] border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#AF9042] mb-1">Buscar por Categoria</h2>
                <p className="text-sm text-gray-400">Galeria de categorias com fotos e links para filtros</p>
              </div>
              <Button
                onClick={() => setConfig({ ...config, categoriesEnabled: !config.categoriesEnabled })}
                className={`${
                  config.categoriesEnabled 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {config.categoriesEnabled ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Visível
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Oculto
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="categoriesTitle">Título da Seção</Label>
                <Input
                  id="categoriesTitle"
                  value={config.categoriesTitle}
                  onChange={(e) => setConfig({ ...config, categoriesTitle: e.target.value })}
                  placeholder="Ex: Buscar por Categoria"
                  className="bg-[#0A1929] border-gray-700"
                />
              </div>

              <div className="bg-[#0A1929] p-4 rounded border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">💡 <strong>Nota:</strong></p>
                <p className="text-xs text-gray-500">
                  As fotos e categorias são configuradas diretamente no código (Home.tsx).
                  Para editar as categorias disponíveis, fotos, ícones e filtros, você precisa
                  modificar o array categoryPages no arquivo /src/app/pages/Home.tsx
                </p>
              </div>
            </div>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#AF9042] hover:bg-[#8f7635] text-white px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
