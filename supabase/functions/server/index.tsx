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

// ==================== ADMIN AUTH ENDPOINTS ====================

// Hardcoded admin credentials (simple and secure)
const ADMIN_USERS = {
  'fernando@g2g.org.br': {
    password: 'ravar2024fernando',
    name: 'Fernando'
  },
  'rafaelvrodriguesp@gmail.com': {
    password: 'ravar2024rafael',
    name: 'Rafael'
  }
};

// POST admin login (simple password check)
app.post("/make-server-e68c254a/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log('=== Admin Login Request ===');
    console.log('Email:', email);

    if (!email || !password) {
      return c.json({ success: false, error: 'Email e senha são obrigatórios' }, 400);
    }

    // Check if email exists and password matches
    const user = ADMIN_USERS[email.toLowerCase() as keyof typeof ADMIN_USERS];
    
    if (!user) {
      console.log('Email not found in ADMIN_USERS');
      return c.json({ success: false, error: 'Email não autorizado' }, 403);
    }

    if (user.password !== password) {
      console.log('Password mismatch');
      return c.json({ 
        success: false, 
        error: 'Senha incorreta' 
      }, 401);
    }

    // Generate a SIMPLE token - just email:timestamp (no encoding!)
    const token = `${email}:${Date.now()}`;
    
    console.log('Generated token:', token);
    console.log('Login successful for:', email);

    return c.json({ 
      success: true, 
      data: {
        access_token: token,
        user: {
          email: email,
          name: user.name
        }
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// POST verify admin session
app.post("/make-server-e68c254a/admin/verify", async (c) => {
  console.log('========================================');
  console.log('=== ADMIN VERIFY REQUEST STARTED ===');
  console.log('========================================');
  
  try {
    // Get token from request BODY instead of headers to avoid CORS issues
    const body = await c.req.json();
    const accessToken = body.token;
    
    console.log('Token from request body:', accessToken);
    
    if (!accessToken) {
      console.log('❌ ERROR: No token provided in request body');
      return c.json({ success: false, error: 'Token não fornecido' }, 401);
    }

    console.log('✅ Access token received:', accessToken);

    // Extract email from token (format: email:timestamp - NO ENCODING!)
    let email: string;
    try {
      const parts = accessToken.split(':');
      console.log('Token split into parts:', parts);
      email = parts[0];
      console.log('✅ Extracted email:', email);
    } catch (err) {
      console.log('❌ Error parsing token:', err);
      return c.json({ success: false, error: 'Token inválido' }, 401);
    }

    // Check if user exists
    const emailLower = email.toLowerCase();
    console.log('Looking up user with email:', emailLower);
    console.log('Available admin emails:', Object.keys(ADMIN_USERS));
    
    const user = ADMIN_USERS[emailLower as keyof typeof ADMIN_USERS];
    console.log('User lookup result:', user ? '✅ FOUND' : '❌ NOT FOUND');
    
    if (!user) {
      console.log('❌ User not found in ADMIN_USERS');
      return c.json({ success: false, error: 'Acesso não autorizado' }, 403);
    }

    console.log('========================================');
    console.log('✅✅✅ VERIFICATION SUCCESSFUL ✅✅✅');
    console.log('Email:', email);
    console.log('Name:', user.name);
    console.log('========================================');
    
    return c.json({ 
      success: true, 
      data: {
        user: {
          email: email,
          name: user.name
        }
      }
    });
  } catch (error) {
    console.log('========================================');
    console.error('❌❌❌ FATAL ERROR IN VERIFY ❌❌❌');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.log('========================================');
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== DATA CLEANUP ENDPOINTS ====================

// DELETE all mock properties (properties that don't match recent pattern)
app.delete("/make-server-e68c254a/properties/cleanup/mock-data", async (c) => {
  try {
    // Get auth token from custom header
    const accessToken = c.req.header('X-Admin-Token');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Não autorizado' }, 401);
    }

    // Verify admin user with our simple auth (NO atob - just split!)
    let email: string;
    try {
      const parts = accessToken.split(':');
      email = parts[0];
    } catch {
      return c.json({ success: false, error: 'Token inválido' }, 401);
    }

    const user = ADMIN_USERS[email.toLowerCase() as keyof typeof ADMIN_USERS];
    if (!user) {
      return c.json({ success: false, error: 'Acesso não autorizado' }, 403);
    }

    // Get all properties
    const allProperties = await kv.getByPrefix('property:');
    
    // Get IDs to keep from request body (optional)
    const body = await c.req.json().catch(() => ({}));
    const keepIds: string[] = body.keepIds || [];
    
    const deletedIds: string[] = [];
    const keptIds: string[] = [];
    
    for (const property of allProperties) {
      // Keep properties in keepIds list
      if (keepIds.includes(property.id)) {
        keptIds.push(property.id);
        continue;
      }
      
      // Delete the property
      await kv.del(`property:${property.id}`);
      deletedIds.push(property.id);
    }

    return c.json({ 
      success: true, 
      data: {
        deleted: deletedIds.length,
        kept: keptIds.length,
        deletedIds,
        keptIds
      },
      message: `${deletedIds.length} imóveis mockados deletados. ${keptIds.length} imóveis mantidos.`
    });
  } catch (error) {
    console.error('Error cleaning up mock data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== SECTIONS CONFIG ENDPOINTS ====================

// GET sections config (PUBLIC - no auth required)
app.get("/make-server-e68c254a/sections/config", async (c) => {
  try {
    // Get config from KV store (no auth required for reading)
    const config = await kv.get('sections:config');
    
    // Return config or default values
    return c.json({ 
      success: true, 
      config: config || {
        neighborhoodsEnabled: true,
        neighborhoodsTitle: 'Explore por bairros',
        categoriesEnabled: true,
        categoriesTitle: 'Buscar por Categoria'
      }
    });
  } catch (error) {
    console.error('Error fetching sections config:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// POST/PUT sections config (REQUIRES AUTH via body - same pattern as /admin/verify)
app.post("/make-server-e68c254a/sections/config", async (c) => {
  console.log('========================================');
  console.log('=== SECTIONS CONFIG POST REQUEST ===');
  console.log('========================================');
  
  try {
    // Get token from BODY (not headers) to avoid CORS issues
    const body = await c.req.json();
    const accessToken = body.token;
    const config = body.config;
    
    console.log('Token from body:', accessToken ? 'Present' : 'Missing');
    console.log('Config from body:', config ? 'Present' : 'Missing');
    
    if (!accessToken) {
      console.log('❌ No token provided in body');
      return c.json({ success: false, error: 'Não autorizado - Token ausente' }, 401);
    }

    if (!config) {
      console.log('❌ No config in body');
      return c.json({ success: false, error: 'Config is required' }, 400);
    }

    // Verify admin user (same pattern as /admin/verify)
    let email: string;
    try {
      const parts = accessToken.split(':');
      email = parts[0];
      console.log('✅ Token split successful - Email:', email);
    } catch (err) {
      console.log('❌ Error splitting token:', err);
      return c.json({ success: false, error: 'Token inválido' }, 401);
    }

    const emailLower = email.toLowerCase();
    console.log('Looking up user:', emailLower);
    
    const user = ADMIN_USERS[emailLower as keyof typeof ADMIN_USERS];
    
    if (!user) {
      console.log('❌ User not found in ADMIN_USERS');
      return c.json({ success: false, error: 'Acesso não autorizado' }, 403);
    }

    console.log('✅ User authenticated:', user.name);

    // Save config to KV store
    await kv.set('sections:config', config);
    
    console.log('✅ Config saved successfully!');
    console.log('Saved config:', JSON.stringify(config, null, 2));
    console.log('========================================');
    
    return c.json({ 
      success: true, 
      message: 'Configurações salvas com sucesso',
      config
    });
  } catch (error) {
    console.error('❌ Error saving sections config:', error);
    console.log('========================================');
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);