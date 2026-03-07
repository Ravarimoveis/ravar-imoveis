import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Trash2, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';

interface LifeAroundItem {
  id: number;
  icon: string;
  label: string;
}

interface LifeAroundEditorProps {
  value: LifeAroundItem[];
  onChange: (value: LifeAroundItem[]) => void;
}

const ICON_OPTIONS = [
  { value: 'Coffee', label: 'Coffee - Cafeteria' },
  { value: 'ShoppingBag', label: 'ShoppingBag - Shopping' },
  { value: 'UtensilsCrossed', label: 'UtensilsCrossed - Restaurante' },
  { value: 'GraduationCap', label: 'GraduationCap - Escola/Universidade' },
  { value: 'Building2', label: 'Building2 - Edifício Comercial' },
  { value: 'Trees', label: 'Trees - Parque' },
  { value: 'Hospital', label: 'Hospital - Hospital' },
  { value: 'Dumbbell', label: 'Dumbbell - Academia' },
  { value: 'Film', label: 'Film - Cinema' },
  { value: 'Music', label: 'Music - Teatro/Show' },
  { value: 'Plane', label: 'Plane - Aeroporto' },
  { value: 'Bus', label: 'Bus - Transporte Público' },
  { value: 'Church', label: 'Church - Igreja' },
  { value: 'Store', label: 'Store - Comércio' },
  { value: 'Landmark', label: 'Landmark - Ponto Turístico' },
];

export function LifeAroundEditor({ value, onChange }: LifeAroundEditorProps) {
  // Ensure value is always an array
  const items = Array.isArray(value) ? value : [];

  console.log('=== LifeAroundEditor RENDER ===');
  console.log('Received value:', JSON.stringify(items, null, 2));
  console.log('Number of items:', items.length);

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(c => c.id)) + 1 : 1;
    const newValue = [
      ...items,
      { id: newId, icon: 'ShoppingBag', label: '' }
    ];
    console.log('Adding new item. New array:', JSON.stringify(newValue, null, 2));
    onChange(newValue);
  };

  const handleRemove = (id: number) => {
    const newValue = items.filter(c => c.id !== id);
    console.log('Removing item', id, '. New array:', JSON.stringify(newValue, null, 2));
    onChange(newValue);
  };

  const updateItem = (id: number, field: keyof LifeAroundItem, val: string) => {
    console.log('=== UPDATING LIFE AROUND ===');
    console.log('Item ID to update:', id);
    console.log('Field to update:', field);
    console.log('New value:', val);
    console.log('Current items BEFORE update:', JSON.stringify(items, null, 2));
    
    const newValue = items.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: val };
        console.log(`✅ Updating item ${id}:`, updated);
        return updated;
      }
      console.log(`⏭️  Skipping item ${c.id} (looking for ${id})`);
      return c;
    });
    
    console.log('New items AFTER update:', JSON.stringify(newValue, null, 2));
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        // Render icon dynamically
        const IconComponent = (Icons as any)[item.icon] || Icons.ShoppingBag;
        
        return (
          <div key={item.id} className="border border-gray-700 rounded-lg p-4 bg-[#1a2332]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#AF9042] text-sm font-semibold">
                Item #{index + 1} (ID: {item.id})
              </span>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor={`life-icon-${item.id}-${index}`} className="text-xs">Ícone</Label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 border border-gray-700 rounded bg-[#1a2332] flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#AF9042]" />
                  </div>
                  {/* USANDO SELECT NATIVO PARA EVITAR BUG DO RADIX UI */}
                  <select
                    id={`life-icon-${item.id}-${index}`}
                    value={item.icon || 'ShoppingBag'}
                    onChange={(e) => {
                      console.log(`🔵 Select changed for item ID=${item.id} at index=${index}, new value: ${e.target.value}`);
                      updateItem(item.id, 'icon', e.target.value);
                    }}
                    className="flex-1 h-10 px-3 py-2 bg-[#1a2332] border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#AF9042]"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor={`life-label-${item.id}-${index}`} className="text-xs">Título</Label>
                <Input
                  id={`life-label-${item.id}-${index}`}
                  value={item.label}
                  onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                  placeholder="Ex: Shopping Cidade Jardim"
                  className="bg-[#1a2332] border-gray-700"
                />
              </div>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={addItem}
        variant="outline"
        className="w-full border-[#AF9042] text-[#AF9042] hover:bg-[#AF9042]/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Item
      </Button>
    </div>
  );
}