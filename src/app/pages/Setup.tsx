import { useState } from 'react';
import { MOCK_PROPERTIES } from '../data/properties';
import { useProperties } from '../hooks/useProperties';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, XCircle, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Setup() {
  const { createProperty } = useProperties();
  const [migrating, setMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<Array<{ id: string; success: boolean; error?: string }>>([]);

  const migrateProperties = async () => {
    setMigrating(true);
    setMigrationResults([]);
    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    for (const property of MOCK_PROPERTIES) {
      try {
        await createProperty(property);
        results.push({ id: property.id, success: true });
        toast.success(`${property.id} migrado com sucesso!`);
      } catch (error) {
        console.error(`Error migrating ${property.id}:`, error);
        results.push({ 
          id: property.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        toast.error(`Erro ao migrar ${property.id}`);
      }
    }

    setMigrationResults(results);
    setMigrating(false);

    const successCount = results.filter(r => r.success).length;
    toast.success(`Migração concluída! ${successCount}/${MOCK_PROPERTIES.length} imóveis migrados.`);
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#AF9042] mb-2">Setup Inicial RAVAR</h1>
          <p className="text-gray-400">
            Migre os {MOCK_PROPERTIES.length} imóveis mockados para o banco de dados Supabase
          </p>
        </div>

        <Card className="bg-[#1a2332] border-gray-700 p-8 mb-6">
          <div className="text-center">
            <Upload className="w-16 h-16 text-[#AF9042] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Migrar Dados Mockados</h2>
            <p className="text-gray-400 mb-6">
              Isso irá criar {MOCK_PROPERTIES.length} imóveis no seu banco de dados Supabase.<br />
              Esta operação pode ser executada apenas uma vez ou múltiplas vezes (irá criar duplicatas).
            </p>

            <Button
              onClick={migrateProperties}
              disabled={migrating}
              className="bg-[#AF9042] hover:bg-[#8f7635] text-white px-8 py-3 text-lg"
            >
              {migrating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Iniciar Migração
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {migrationResults.length > 0 && (
          <Card className="bg-[#1a2332] border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-4 text-[#AF9042]">Resultados da Migração</h3>
            <div className="space-y-2">
              {migrationResults.map((result) => (
                <div 
                  key={result.id} 
                  className={`flex items-center gap-3 p-3 rounded ${
                    result.success ? 'bg-green-900/20' : 'bg-red-900/20'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={result.success ? 'text-green-400' : 'text-red-400'}>
                      {result.id}: {result.success ? 'Sucesso' : 'Falhou'}
                    </p>
                    {result.error && (
                      <p className="text-sm text-gray-500 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400">
                Migração concluída! Acesse{' '}
                <a href="/admin" className="text-[#AF9042] hover:underline font-bold">
                  /admin
                </a>{' '}
                para gerenciar seus imóveis.
              </p>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-[#1a2332] border-gray-700 p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 text-[#AF9042]">Próximos Passos</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-[#AF9042] font-bold">1.</span>
              <span>Execute a migração acima para popular o banco de dados</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#AF9042] font-bold">2.</span>
              <span>
                Acesse <code className="bg-gray-800 px-2 py-1 rounded">/admin</code> para gerenciar imóveis
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#AF9042] font-bold">3.</span>
              <span>Faça upload das fotos reais substituindo as do Unsplash</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#AF9042] font-bold">4.</span>
              <span>Atualize preços, características e descrições conforme necessário</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#AF9042] font-bold">5.</span>
              <span>
                O sistema principal já está configurado para buscar dados do Supabase automaticamente
              </span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
