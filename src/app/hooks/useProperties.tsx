import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { MOCK_PROPERTIES } from '../data/properties';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e68c254a`;

export interface Property {
  id: string;
  title: string;
  type: 'Venda' | 'Aluguel';
  category: string;
  propertyType: string;
  premiumTags: string[];
  price: number;
  condo: number;
  iptu: number;
  area: number;
  landArea?: number;
  rooms: number;
  suites: number;
  baths: number;
  parking: number;
  neighborhood: string;
  image: string;
  images: string[];
  videoUrl?: string;
  videoUrls?: string[];
  description: string;
  petPolicy: string;
  features: string[];
  amenities: string[];
  conveniences: Array<{
    id: number;
    icon: string;
    label: string;
    desc: string;
  }>;
  lifeAround: Array<{
    id: number;
    icon: string;
    label: string;
  }>;
  location_details: string;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to parse JSON fields that might be stored as strings
  const parseProperty = (prop: any): Property => {
    try {
      // Parse conveniences if it's a string
      if (typeof prop.conveniences === 'string') {
        console.log('⚠️ conveniences is a STRING, parsing:', prop.conveniences);
        prop.conveniences = JSON.parse(prop.conveniences);
      }
      
      // Parse lifeAround if it's a string
      if (typeof prop.lifeAround === 'string') {
        console.log('⚠️ lifeAround is a STRING, parsing:', prop.lifeAround);
        prop.lifeAround = JSON.parse(prop.lifeAround);
      }
      
      // Parse other array fields
      if (typeof prop.images === 'string') {
        prop.images = JSON.parse(prop.images);
      }
      if (typeof prop.features === 'string') {
        prop.features = JSON.parse(prop.features);
      }
      if (typeof prop.amenities === 'string') {
        prop.amenities = JSON.parse(prop.amenities);
      }
      if (typeof prop.premiumTags === 'string') {
        prop.premiumTags = JSON.parse(prop.premiumTags);
      }
      
      // Ensure conveniences and lifeAround are arrays
      if (!Array.isArray(prop.conveniences)) {
        console.log('⚠️ conveniences is not an array, defaulting to []');
        prop.conveniences = [];
      }
      if (!Array.isArray(prop.lifeAround)) {
        console.log('⚠️ lifeAround is not an array, defaulting to []');
        prop.lifeAround = [];
      }
      
      // CRITICAL FIX: Ensure all conveniences have unique IDs
      prop.conveniences = prop.conveniences.map((item: any, index: number) => {
        if (!item || typeof item !== 'object') {
          console.log('⚠️ Invalid convenience item at index', index, ':', item);
          return { id: index + 1, icon: 'Dog', label: '', desc: '' };
        }
        // If item doesn't have an id, assign one
        if (typeof item.id !== 'number' || item.id === undefined) {
          console.log('⚠️ Convenience item missing ID, assigning:', index + 1);
          return { ...item, id: index + 1 };
        }
        return item;
      });
      
      // CRITICAL FIX: Ensure all lifeAround items have unique IDs
      prop.lifeAround = prop.lifeAround.map((item: any, index: number) => {
        if (!item || typeof item !== 'object') {
          console.log('⚠️ Invalid lifeAround item at index', index, ':', item);
          return { id: index + 1, icon: 'ShoppingBag', label: '' };
        }
        // If item doesn't have an id, assign one
        if (typeof item.id !== 'number' || item.id === undefined) {
          console.log('⚠️ LifeAround item missing ID, assigning:', index + 1);
          return { ...item, id: index + 1 };
        }
        return item;
      });
      
      console.log('✅ Parsed property:', prop.id, 'conveniences:', prop.conveniences.length, 'lifeAround:', prop.lifeAround.length);
      console.log('   conveniences with IDs:', prop.conveniences.map((c: any) => ({ id: c.id, label: c.label })));
      console.log('   lifeAround with IDs:', prop.lifeAround.map((l: any) => ({ id: l.id, label: l.label })));
      
      return prop as Property;
    } catch (e) {
      console.error('Error parsing property:', e);
      return prop as Property;
    }
  };

  const fetchProperties = async () => {
    try {
      console.log('=== FETCHING PROPERTIES ===');
      setLoading(true);
      
      try {
        const response = await fetch(`${API_BASE}/properties`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Fetch response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Fetch result:', result);
        console.log('Number of properties:', result.data?.length);
        
        if (result.success && result.data && result.data.length > 0) {
          // Parse each property to handle JSON strings
          const parsedProperties = result.data.map(parseProperty);
          console.log('Setting properties in state:', parsedProperties);
          setProperties(parsedProperties);
          setError(null);
        } else {
          throw new Error('No properties found in response');
        }
      } catch (fetchError) {
        // Fallback to mock data if API fails
        console.warn('API fetch failed, using MOCK_PROPERTIES fallback:', fetchError);
        console.log('Loading mock data with', MOCK_PROPERTIES.length, 'properties');
        console.log('First mock property conveniences:', MOCK_PROPERTIES[0]?.conveniences);
        console.log('First mock property lifeAround:', MOCK_PROPERTIES[0]?.lifeAround);
        setProperties(MOCK_PROPERTIES as Property[]);
        setError('Using mock data (API unavailable)');
      }
    } catch (err) {
      console.error('Error in fetchProperties:', err);
      // Last resort: use mock data
      console.log('Using MOCK_PROPERTIES as last resort');
      setProperties(MOCK_PROPERTIES as Property[]);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      console.log('=== FETCH COMPLETE ===');
      console.log('Final properties count:', properties.length);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const createProperty = async (property: Property) => {
    try {
      const response = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ property })
      });

      if (!response.ok) {
        throw new Error(`Failed to create property: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchProperties(); // Refresh list
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create property');
      }
    } catch (err) {
      console.error('Error creating property:', err);
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      console.log('=== UPDATE PROPERTY HOOK ===');
      console.log('ID:', id);
      console.log('Updates:', updates);
      console.log('API URL:', `${API_BASE}/properties/${id}`);
      
      const response = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ property: updates })
      });

      console.log('Response status:', response.status);
      console.log('Response ok?', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update property: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Update result:', result);
      
      if (result.success) {
        console.log('Update successful, refreshing...');
        await fetchProperties(); // Refresh list
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update property');
      }
    } catch (err) {
      console.error('Error updating property:', err);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete property: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchProperties(); // Refresh list
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete property');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      throw err;
    }
  };

  const uploadImage = async (file: File, propertyId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('propertyId', propertyId);

      const response = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data.publicUrl;
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    refresh: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImage
  };
}