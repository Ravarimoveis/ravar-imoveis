import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

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
  description: string;
  petPolicy: string;
  features: string[];
  amenities: string[];
  conveniences: Array<{
    id: number;
    icon: any;
    label: string;
    desc: string;
  }>;
  location_details: string;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      console.log('=== FETCHING PROPERTIES ===');
      setLoading(true);
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
      
      if (result.success) {
        // Force a completely new array to trigger React re-render
        const newProperties = JSON.parse(JSON.stringify(result.data));
        console.log('Setting properties in state:', newProperties);
        setProperties(newProperties);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch properties');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProperties([]);
    } finally {
      setLoading(false);
      console.log('=== FETCH COMPLETE ===');
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