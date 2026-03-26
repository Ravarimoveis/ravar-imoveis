import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-e68c254a-property-images';

async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${BUCKET_NAME}`);
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
      });
      
      if (error) {
        // Ignore error if bucket already exists (409 conflict)
        if (error.statusCode === '409' || error.message?.includes('already exists')) {
          console.log(`Bucket ${BUCKET_NAME} already exists (expected)`);
        } else {
          console.error('Error creating bucket:', error);
        }
      } else {
        console.log('Bucket created successfully:', data);
      }
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize on startup
initializeStorage();

// Health check endpoint
app.get("/make-server-e68c254a/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== PROPERTY ENDPOINTS ====================

// GET all properties
app.get("/make-server-e68c254a/properties", async (c) => {
  try {
    const properties = await kv.getByPrefix('property:');
    return c.json({ 
      success: true, 
      data: properties.sort((a, b) => {
        // Sort by ID descending (newest first)
        return b.id.localeCompare(a.id);
      })
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// GET single property by ID
app.get("/make-server-e68c254a/properties/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const property = await kv.get(`property:${id}`);
    
    if (!property) {
      return c.json({ success: false, error: 'Property not found' }, 404);
    }
    
    return c.json({ success: true, data: property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// POST create new property
app.post("/make-server-e68c254a/properties", async (c) => {
  try {
    const body = await c.req.json();
    const property = body.property;
    
    if (!property || !property.id) {
      return c.json({ success: false, error: 'Property data with ID is required' }, 400);
    }
    
    // Save property to KV store
    await kv.set(`property:${property.id}`, property);
    
    return c.json({ success: true, data: property });
  } catch (error) {
    console.error('Error creating property:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// PUT update property
app.put("/make-server-e68c254a/properties/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const updates = body.property;
    
    console.log('=== UPDATE PROPERTY ===');
    console.log('Property ID:', id);
    console.log('Updates received:', JSON.stringify(updates, null, 2));
    
    // Get existing property
    const existing = await kv.get(`property:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Property not found' }, 404);
    }
    
    console.log('Existing property:', JSON.stringify(existing, null, 2));
    
    // Merge updates
    const updated = { ...existing, ...updates, id };
    
    console.log('Merged property:', JSON.stringify(updated, null, 2));
    console.log('Images in updated:', updated.images);
    
    // Save updated property
    await kv.set(`property:${id}`, updated);
    
    console.log('Property saved successfully');
    
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating property:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DELETE property
app.delete("/make-server-e68c254a/properties/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if property exists
    const existing = await kv.get(`property:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Property not found' }, 404);
    }
    
    // Delete property images from storage if they exist
    if (existing.images && Array.isArray(existing.images)) {
      for (const imageUrl of existing.images) {
        // Extract filename from URL if it's a Supabase storage URL
        if (imageUrl.includes(BUCKET_NAME)) {
          const filename = imageUrl.split('/').pop();
          if (filename) {
            await supabase.storage.from(BUCKET_NAME).remove([`${id}/${filename}`]);
          }
        }
      }
    }
    
    // Delete property from KV store
    await kv.del(`property:${id}`);
    
    return c.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== IMAGE UPLOAD ENDPOINTS ====================

// POST upload image for property
app.post("/make-server-e68c254a/properties/:id/images", async (c) => {
  try {
    const propertyId = c.req.param('id');
    const body = await c.req.json();
    const { imageUrl, filename } = body;
    
    if (!imageUrl || !filename) {
      return c.json({ success: false, error: 'imageUrl and filename are required' }, 400);
    }
    
    // For now, we'll just return the URL as-is
    // In a real scenario, you'd download the image and upload to Supabase Storage
    return c.json({ 
      success: true, 
      data: { 
        url: imageUrl,
        publicUrl: imageUrl
      } 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// POST upload image directly (base64 or blob)
app.post("/make-server-e68c254a/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const propertyId = formData.get('propertyId') as string;
    
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'File is required' }, 400);
    }
    
    if (!propertyId) {
      return c.json({ success: false, error: 'propertyId is required' }, 400);
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `${propertyId}/${filename}`;
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ success: false, error: error.message }, 500);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return c.json({ 
      success: true, 
      data: { 
        path: data.path,
        publicUrl: publicUrl
      } 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DELETE image from property
app.delete("/make-server-e68c254a/properties/:id/images/:filename", async (c) => {
  try {
    const propertyId = c.req.param('id');
    const filename = c.req.param('filename');
    
    const filePath = `${propertyId}/${filename}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      console.error('Storage delete error:', error);
      return c.json({ success: false, error: error.message }, 500);
    }
    
    return c.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== MIGRATION ENDPOINT ====================
// MIGRATE property codes from RAVA-XXX to RAVAR-XXX
app.post("/make-server-e68c254a/migrate-property-codes", async (c) => {
  try {
    console.log('🔄 Starting property code migration from RAVA-XXX to RAVAR-XXX');
    
    // Get all properties
    const properties = await kv.getByPrefix('property:');
    console.log(`📦 Found ${properties.length} properties to migrate`);
    
    const migrations = [];
    
    // Sort properties by ID to ensure consistent numbering
    const sortedProperties = properties.sort((a, b) => a.id.localeCompare(b.id));
    
    for (let i = 0; i < sortedProperties.length; i++) {
      const property = sortedProperties[i];
      const oldId = property.id;
      
      // Generate new ID: RAVAR-001, RAVAR-002, etc.
      const newId = `RAVAR-${String(i + 1).padStart(3, '0')}`;
      
      console.log(`🔄 Migrating ${oldId} → ${newId}`);
      
      // Update property with new ID
      const updatedProperty = { ...property, id: newId };
      
      // Delete old key
      await kv.del(`property:${oldId}`);
      
      // Set with new key
      await kv.set(`property:${newId}`, updatedProperty);
      
      migrations.push({ oldId, newId });
    }
    
    console.log('✅ Migration completed successfully');
    
    return c.json({ 
      success: true, 
      message: `Successfully migrated ${migrations.length} properties`,
      migrations 
    });
  } catch (error) {
    console.error('❌ Error during migration:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== SECTIONS CONFIGURATION ENDPOINTS ====================

// GET sections configuration
app.get("/make-server-e68c254a/sections/config", async (c) => {
  try {
    const config = await kv.get('sections:config');
    
    // Return default config if none exists
    if (!config) {
      const defaultConfig = {
        neighborhoodsEnabled: true,
        neighborhoodsTitle: 'Explore por bairros',
        categoriesEnabled: true,
        categoriesTitle: 'Buscar por Categoria'
      };
      return c.json({ success: true, config: defaultConfig });
    }
    
    return c.json({ success: true, config: config });
  } catch (error) {
    console.error('Error fetching sections config:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// POST/UPDATE sections configuration
app.post("/make-server-e68c254a/sections/config", async (c) => {
  try {
    const body = await c.req.json();
    const { config } = body;
    
    if (!config) {
      return c.json({ success: false, error: 'Config is required' }, 400);
    }
    
    console.log('💾 Saving sections config:', config);
    
    await kv.set('sections:config', config);
    
    return c.json({ 
      success: true, 
      message: 'Configuration saved successfully'
    });
  } catch (error) {
    console.error('Error saving sections config:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);