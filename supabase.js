/* ====================================================================
   Happy Paws & Pixels – Supabase Integration Client
   Powered by @supabase/supabase-js with graceful LocalStorage fallback
   ==================================================================== */

import { createClient } from '@supabase/supabase-js';

export function isPlaceholder(url, key) {
  if (!url || !key) return true;
  const u = String(url).trim().toLowerCase();
  const k = String(key).trim();
  if (u === '' || u.includes('your-project-id') || u.includes('qrcvdjwmmgjqbdpkkixh') || u.includes('xyzcompany')) {
    return true;
  }
  if (k === '' || k.includes('your_key_here') || k.includes('your_anon_key') || k.length < 20) {
    return true;
  }
  return false;
}

// 1. Resolve configuration from environment variables or saved local settings
function getSavedConfig() {
  try {
    const saved = localStorage.getItem('paws_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key && !isPlaceholder(parsed.url, parsed.key)) {
        return parsed;
      }
    }
  } catch (e) {}

  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});
  const envUrl = (env.VITE_SUPABASE_URL || '').trim();
  const envKey = (env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

  // If env contains placeholders, return empty so user is guided to connect
  if (isPlaceholder(envUrl, envKey)) {
    return { url: '', key: '' };
  }

  return { url: envUrl, key: envKey };
}

let currentConfig = getSavedConfig();
let supabase = null;

function initSupabaseClient(url, key) {
  if (url && key && url.startsWith('http') && !isPlaceholder(url, key)) {
    try {
      supabase = createClient(url, key);
      return true;
    } catch (err) {
      console.warn('[Supabase] Failed to initialize client:', err);
      supabase = null;
      return false;
    }
  }
  supabase = null;
  return false;
}

initSupabaseClient(currentConfig.url, currentConfig.key);
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export { supabase };

// 2. Database Service Object
export const pawsDB = {
  isConfigured() {
    return Boolean(supabase && currentConfig.url && currentConfig.key && !isPlaceholder(currentConfig.url, currentConfig.key));
  },

  getConfig() {
    return { ...currentConfig };
  },

  saveConfig(url, key) {
    const cleanUrl = (url || '').trim();
    const cleanKey = (key || '').trim();
    currentConfig = { url: cleanUrl, key: cleanKey };
    localStorage.setItem('paws_supabase_config', JSON.stringify(currentConfig));
    const ok = initSupabaseClient(currentConfig.url, currentConfig.key);
    updateConnectionBadge();
    return ok;
  },

  async testConnection() {
    if (!currentConfig.url || !currentConfig.key) {
      return {
        ok: false,
        message: 'Supabase credentials are missing. Please enter your Project URL and Anon API Key from your Supabase Dashboard.'
      };
    }
    if (isPlaceholder(currentConfig.url, currentConfig.key)) {
      return {
        ok: false,
        message: 'The current Project URL or Anon Key is a placeholder. Please enter your real credentials from Supabase Dashboard → Settings → API.'
      };
    }
    if (!supabase) {
      initSupabaseClient(currentConfig.url, currentConfig.key);
      if (!supabase) {
        return { ok: false, message: 'Could not initialize Supabase client with the provided credentials.' };
      }
    }

    try {
      const { data, error } = await supabase.from('pets').select('id').limit(1);
      if (error) {
        if (error.code === '42P01' || error.code === 'PGRST205') {
          return {
            ok: false,
            message: 'Connected to Supabase successfully, but the "pets" table was not found! Please run the SQL script in "supabase_schema.sql" in your Supabase SQL Editor.'
          };
        }
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
          return {
            ok: false,
            message: 'Invalid API Key. Please copy your "anon public" API key from Supabase Dashboard → Project Settings → API.'
          };
        }
        return { ok: false, message: `Database query returned error: ${error.message}` };
      }
      return { ok: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('fetch') || msg.includes('ENOTFOUND') || msg.includes('NetworkError')) {
        return {
          ok: false,
          message: `Network error: Could not reach host "${currentConfig.url}". Please check your project URL spelling and internet connection.`
        };
      }
      return { ok: false, message: err.message || 'Connection test failed.' };
    }
  },

  /* ── Pets CRUD ────────────────────────────────────────── */
  async savePet(pet) {
    const localId = Date.now();
    const localItem = { ...pet, id: localId, created_at: new Date().toISOString() };
    storeLocal('pets', localItem);

    if (this.isConfigured()) {
      try {
        const payload = {
          pet_name: pet.pName || pet.petName || pet.pet_name || 'Pet Guest',
          species: pet.pType || pet.species || 'Dog',
          breed: pet.pBreed || pet.breed || '',
          age: pet.age || (pet.pAgeYears !== undefined ? `${pet.pAgeYears}y ${pet.pAgeMonths || 0}m` : '') || '',
          gender: pet.pGender || pet.gender || '',
          owner_name: pet.oName || pet.ownerName || pet.owner_name || 'Owner',
          owner_phone: pet.oPhone || pet.ownerPhone || pet.owner_phone || 'N/A',
          owner_email: pet.oEmail || pet.ownerEmail || pet.owner_email || '',
          emergency_contact: pet.emergencyContact || pet.emergency_contact || (pet.eContactName ? `${pet.eContactName} (${pet.eContactPhone || pet.eContactRel || ''})` : '') || '',
          diet_notes: pet.dietNotes || pet.diet_notes || pet.pSpecialCare || '',
          medical_notes: pet.medicalNotes || pet.medical_notes || (pet.pVaccination ? `Vaccination: ${pet.pVaccination}. Vet: ${pet.pVetName || 'N/A'}` : '') || '',
          stay_start: pet.sCheckIn || pet.stayStart || pet.stay_start || '',
          stay_end: pet.sCheckOut || pet.stayEnd || pet.stay_end || '',
          status: pet.stayStatus || pet.status || 'Active',
          room_number: pet.roomNumber || pet.room_number || ''
        };
        const { data, error } = await supabase.from('pets').insert([payload]).select();
        if (error) throw error;
        return { success: true, isCloud: true, data: data[0] };
      } catch (err) {
        console.warn('[Supabase] Pet insert failed, saved to local cache:', err);
        return { success: true, isCloud: false, data: localItem, error: err.message };
      }
    }
    return { success: true, isCloud: false, data: localItem };
  },

  async getPets() {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(p => ({
            id: p.id,
            petName: p.pet_name,
            pName: p.pet_name,
            species: p.species,
            pType: p.species,
            breed: p.breed,
            pBreed: p.breed,
            age: p.age,
            pAgeYears: p.age ? (parseInt(p.age) || 0) : 0,
            pAgeMonths: 0,
            gender: p.gender,
            pGender: p.gender,
            ownerName: p.owner_name,
            oName: p.owner_name,
            ownerPhone: p.owner_phone,
            oPhone: p.owner_phone,
            ownerEmail: p.owner_email,
            oEmail: p.owner_email,
            emergencyContact: p.emergency_contact,
            eContactName: p.emergency_contact,
            dietNotes: p.diet_notes,
            medicalNotes: p.medical_notes,
            pSpecialCare: p.diet_notes,
            pVaccination: p.medical_notes?.includes('Vaccination:') ? p.medical_notes.replace('Vaccination:', '').split('.')[0].trim() : 'Up to date',
            stayStart: p.stay_start,
            sCheckIn: p.stay_start,
            stayEnd: p.stay_end,
            sCheckOut: p.stay_end,
            status: p.status,
            stayStatus: (p.status || 'upcoming').toLowerCase(),
            roomNumber: p.room_number,
            consentSigned: true,
            createdAt: p.created_at,
            _source: 'Supabase'
          }));
        }
      } catch (err) {
        console.warn('[Supabase] Could not fetch pets from cloud, using local cache:', err);
      }
    }
    return getLocal('pets').map(p => ({ ...p, _source: 'LocalStorage' }));
  },

  async deletePet(id) {
    deleteLocal('pets', id);
    if (this.isConfigured()) {
      try {
        await supabase.from('pets').delete().eq('id', id);
      } catch (e) {}
    }
  },

  /* ── Volunteers CRUD ──────────────────────────────────── */
  async saveVolunteer(vol) {
    const localId = Date.now();
    const localItem = { ...vol, id: localId, created_at: new Date().toISOString() };
    storeLocal('volunteers', localItem);

    if (this.isConfigured()) {
      try {
        const payload = {
          full_name: vol.name || vol.fullName || vol.full_name || 'Volunteer',
          email: vol.email || '',
          phone: vol.phone || '',
          availability: Array.isArray(vol.availability) ? vol.availability.join(', ') : (vol.availability || ''),
          activities: Array.isArray(vol.activities) ? vol.activities.join(', ') : (vol.activities || ''),
          experience: vol.experience || '',
          motivation: vol.motivation || (vol.timeSlot ? `Time Slot: ${vol.timeSlot}` : '') || '',
          status: vol.status || 'Pending'
        };
        const { data, error } = await supabase.from('volunteers').insert([payload]).select();
        if (error) throw error;
        return { success: true, isCloud: true, data: data[0] };
      } catch (err) {
        console.warn('[Supabase] Volunteer insert failed:', err);
        return { success: true, isCloud: false, data: localItem, error: err.message };
      }
    }
    return { success: true, isCloud: false, data: localItem };
  },

  async getVolunteers() {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(v => ({
            id: v.id,
            name: v.full_name,
            fullName: v.full_name,
            email: v.email,
            phone: v.phone,
            availability: v.availability,
            activities: v.activities,
            experience: v.experience,
            motivation: v.motivation,
            timeSlot: v.motivation?.includes('Time Slot:') ? v.motivation.replace('Time Slot:', '').trim() : 'Flexible',
            status: v.status,
            createdAt: v.created_at,
            _source: 'Supabase'
          }));
        }
      } catch (err) {}
    }
    return getLocal('volunteers').map(v => ({ ...v, _source: 'LocalStorage' }));
  },

  /* ── Digital Consents CRUD ────────────────────────────── */
  async saveConsent(consent) {
    const localId = Date.now();
    const localItem = { ...consent, id: localId, created_at: new Date().toISOString() };
    storeLocal('consents', localItem);

    if (this.isConfigured()) {
      try {
        const payload = {
          owner_name: consent.ownerName || consent.owner_name || consent.name || 'Owner',
          pet_name: consent.petName || consent.pet_name || 'Pet Guest',
          owner_phone: consent.ownerPhone || consent.owner_phone || consent.phone || consent.icNum || 'N/A',
          owner_email: consent.ownerEmail || consent.owner_email || consent.email || '',
          emergency_vet_consent: consent.emergencyVetConsent ?? true,
          terms_accepted: consent.termsAccepted ?? true,
          signature_name: consent.signatureName || consent.signature_name || consent.name || 'Owner',
          signature_date: consent.signatureDate || consent.signature_date || consent.dateSigned || new Date().toISOString().split('T')[0],
          status: consent.status || 'Signed'
        };
        const { data, error } = await supabase.from('consents').insert([payload]).select();
        if (error) throw error;
        return { success: true, isCloud: true, data: data[0] };
      } catch (err) {
        console.warn('[Supabase] Consent insert failed:', err);
        return { success: true, isCloud: false, data: localItem, error: err.message };
      }
    }
    return { success: true, isCloud: false, data: localItem };
  },

  async getConsents() {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.from('consents').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(c => ({
            id: c.id,
            name: c.owner_name,
            ownerName: c.owner_name,
            petName: c.pet_name,
            ownerPhone: c.owner_phone,
            phone: c.owner_phone,
            ownerEmail: c.owner_email,
            signatureName: c.signature_name,
            signatureDate: c.signature_date,
            dateSigned: c.signature_date,
            status: c.status,
            createdAt: c.created_at,
            _source: 'Supabase'
          }));
        }
      } catch (err) {}
    }
    return getLocal('consents').map(c => ({ ...c, _source: 'LocalStorage' }));
  },

  /* ── Feedback CRUD ────────────────────────────────────── */
  async saveFeedback(fb) {
    const localId = Date.now();
    const localItem = { ...fb, id: localId, created_at: new Date().toISOString() };
    storeLocal('feedback', localItem);

    if (this.isConfigured()) {
      try {
        const payload = {
          author_name: fb.ownerName || fb.authorName || fb.author_name || 'Anonymous',
          pet_name: fb.petName || fb.pet_name || 'Pet Guest',
          overall_rating: parseInt(fb.rating || fb.overallRating || 5, 10),
          cleanliness_rating: parseInt(fb.catClean || fb.cleanlinessRating || 5, 10),
          staff_rating: parseInt(fb.catStaff || fb.staffRating || 5, 10),
          care_rating: parseInt(fb.catCare || fb.careRating || 5, 10),
          comments: fb.comments || fb.experience || '',
          recommend: fb.recommend || 'Yes'
        };
        const { data, error } = await supabase.from('feedback').insert([payload]).select();
        if (error) throw error;
        return { success: true, isCloud: true, data: data[0] };
      } catch (err) {
        console.warn('[Supabase] Feedback insert failed:', err);
        return { success: true, isCloud: false, data: localItem, error: err.message };
      }
    }
    return { success: true, isCloud: false, data: localItem };
  },

  async getFeedback() {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(f => ({
            id: f.id,
            authorName: f.author_name,
            ownerName: f.author_name,
            petName: f.pet_name,
            overallRating: f.overall_rating,
            rating: f.overall_rating,
            cleanlinessRating: f.cleanliness_rating,
            catClean: f.cleanliness_rating,
            staffRating: f.staff_rating,
            catStaff: f.staff_rating,
            careRating: f.care_rating,
            catCare: f.care_rating,
            comments: f.comments,
            experience: f.comments,
            recommend: f.recommend,
            createdAt: f.created_at,
            _source: 'Supabase'
          }));
        }
      } catch (err) {}
    }
    return getLocal('feedback').map(f => ({ ...f, _source: 'LocalStorage' }));
  },

  /* ── Enquiries CRUD ───────────────────────────────────── */
  async saveEnquiry(enquiry) {
    const localId = Date.now();
    const localItem = { ...enquiry, id: localId, created_at: new Date().toISOString() };
    storeLocal('enquiries', localItem);

    if (this.isConfigured()) {
      try {
        const payload = {
          name: enquiry.name || 'Anonymous',
          email: enquiry.email || '',
          phone: enquiry.phone || '',
          pet_type: enquiry.petType || enquiry.pet_type || enquiry.subject || 'General Enquiry',
          message: enquiry.message || '',
          status: 'New'
        };
        const { data, error } = await supabase.from('enquiries').insert([payload]).select();
        if (error) throw error;
        return { success: true, isCloud: true, data: data[0] };
      } catch (err) {
        console.warn('[Supabase] Enquiry insert failed:', err);
        return { success: true, isCloud: false, data: localItem, error: err.message };
      }
    }
    return { success: true, isCloud: false, data: localItem };
  },

  async getEnquiries() {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(e => ({
            id: e.id,
            name: e.name,
            email: e.email,
            phone: e.phone,
            petType: e.pet_type,
            subject: e.pet_type,
            message: e.message,
            status: e.status,
            createdAt: e.created_at,
            _source: 'Supabase'
          }));
        }
      } catch (err) {}
    }
    return getLocal('enquiries').map(e => ({ ...e, _source: 'LocalStorage' }));
  }
};

// 3. LocalStorage fallback helper utilities
function storeLocal(key, item) {
  try {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift(item);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

function getLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function deleteLocal(key, id) {
  try {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = list.filter(item => item.id !== id && item.id !== Number(id));
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (e) {}
}

// 4. Floating Supabase Connection Status Badge & Settings Modal
function createStatusBadge() {
  if (document.getElementById('supabaseStatusBadge')) return;

  const badge = document.createElement('div');
  badge.id = 'supabaseStatusBadge';
  badge.style.cssText = `
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 9999;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    font-family: var(--font-body, system-ui);
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    transition: all 0.25s ease;
    backdrop-filter: blur(8px);
  `;
  badge.onclick = openSupabaseConfigModal;
  document.body.appendChild(badge);
  updateConnectionBadge();
}

function updateConnectionBadge() {
  const badge = document.getElementById('supabaseStatusBadge');
  if (!badge) return;

  if (pawsDB.isConfigured()) {
    badge.style.background = 'rgba(230, 248, 242, 0.95)';
    badge.style.color = '#1b6951';
    badge.style.border = '1px solid #7be0be';
    badge.innerHTML = `🟢 <strong>Supabase Connected</strong> <span style="font-size:0.7rem;opacity:0.75;margin-left:4px;">(Cloud DB)</span>`;
  } else {
    badge.style.background = 'rgba(255, 248, 235, 0.95)';
    badge.style.color = '#a05e03';
    badge.style.border = '1px solid #ffd48f';
    badge.innerHTML = `💾 <strong>LocalStorage Mode</strong> <span style="font-size:0.7rem;text-decoration:underline;margin-left:4px;">Connect Supabase</span>`;
  }
}

function openSupabaseConfigModal() {
  let modal = document.getElementById('supabaseConfigModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'supabaseConfigModal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px); z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      padding: 16px; animation: fadeIn .2s ease;
    `;
    modal.innerHTML = `
      <div style="background: white; border-radius: 18px; max-width: 520px; width: 100%; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <h3 style="margin:0; font-family:var(--font-head); font-size:1.25rem; display:flex; align-items:center; gap:8px;">
            ⚡ Supabase Database Settings
          </h3>
          <button id="closeSupabaseModalBtn" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:#777;">✕</button>
        </div>
        <p style="font-size:0.88rem; color:#555; margin-bottom:16px; line-height:1.5;">
          Connect your <strong>Supabase</strong> project to store pets, volunteers, consents, feedback, and enquiries directly in PostgreSQL cloud database.
        </p>

        <div style="margin-bottom: 14px;">
          <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Project URL</label>
          <input type="text" id="modalSupabaseUrl" placeholder="https://xxxxxxxx.supabase.co" class="form-control" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid #ddd;" />
          <small style="color:#888; font-size:0.75rem;">Found in Supabase Dashboard → Project Settings → API</small>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Anon Public API Key</label>
          <input type="password" id="modalSupabaseKey" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="form-control" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid #ddd;" />
          <small style="color:#888; font-size:0.75rem;">Found in Supabase Dashboard → Project Settings → API (Project API keys)</small>
        </div>

        <div id="modalTestResult" style="margin-bottom:14px; font-size:0.82rem; display:none; padding:10px 14px; border-radius:8px; line-height:1.4;"></div>

        <div style="display:flex; gap:10px; margin-bottom:16px;">
          <button id="modalTestBtn" class="btn btn-secondary btn-sm" style="flex:1;">🔌 Test Connection</button>
          <button id="modalSaveBtn" class="btn btn-primary btn-sm" style="flex:1;">💾 Save & Apply</button>
        </div>

        <div style="border-top:1px solid #eee; padding-top:14px; font-size:0.8rem; color:#666;">
          <p style="margin:0 0 6px 0;"><strong>Need table setup?</strong></p>
          <p style="margin:0 0 8px 0;">Run the script in <code style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">supabase_schema.sql</code> in your Supabase SQL Editor.</p>
          <p style="margin:0; font-size:0.75rem; color:#888;">Note: If no active Supabase key is provided, the website runs smoothly using browser LocalStorage fallback.</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#closeSupabaseModalBtn').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('#modalTestBtn').onclick = async () => {
      const url = modal.querySelector('#modalSupabaseUrl').value.trim();
      const key = modal.querySelector('#modalSupabaseKey').value.trim();
      const resEl = modal.querySelector('#modalTestResult');
      resEl.style.display = 'block';
      resEl.style.background = '#f3f4f6';
      resEl.style.color = '#333';
      resEl.innerHTML = 'Testing connection to Supabase...';

      pawsDB.saveConfig(url, key);
      const test = await pawsDB.testConnection();
      if (test.ok) {
        resEl.style.background = '#e6f8f2';
        resEl.style.color = '#1b6951';
        resEl.innerHTML = `✅ ${test.message}`;
      } else {
        resEl.style.background = '#fee2e2';
        resEl.style.color = '#991b1b';
        resEl.innerHTML = `❌ ${test.message}`;
      }
    };

    modal.querySelector('#modalSaveBtn').onclick = () => {
      const url = modal.querySelector('#modalSupabaseUrl').value.trim();
      const key = modal.querySelector('#modalSupabaseKey').value.trim();
      pawsDB.saveConfig(url, key);
      if (window.showToast) window.showToast('Supabase settings updated!', 'success');
      modal.remove();
      // Reload current page records
      setTimeout(() => window.location.reload(), 400);
    };
  }

  const cfg = pawsDB.getConfig();
  const urlInput = modal.querySelector('#modalSupabaseUrl');
  const keyInput = modal.querySelector('#modalSupabaseKey');
  if (urlInput) urlInput.value = isPlaceholder(cfg.url, cfg.key) ? '' : (cfg.url || '');
  if (keyInput) keyInput.value = isPlaceholder(cfg.url, cfg.key) ? '' : (cfg.key || '');
}

// 5. Expose on window for all pages to use
if (typeof window !== 'undefined') {
  window.pawsDB = pawsDB;
  window.openSupabaseConfigModal = openSupabaseConfigModal;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createStatusBadge);
  } else {
    createStatusBadge();
  }
}
