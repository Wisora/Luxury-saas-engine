'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createProduct } from '@/app/actions/product';

// Initialize Supabase client for browser uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface AddItemModalProps {
  subdomain: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddItemModal({ subdomain, isOpen, onClose, onSuccess }: AddItemModalProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Direct Cloud Upload to Supabase Storage (Laptop File / Mobile Camera or Photos)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be under 5MB.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      // 1. Local preview while uploading
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);

      // 2. Unique filename generation
      const fileExt = file.name.split('.').pop();
      const fileName = `${subdomain}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // 3. Upload directly to Supabase Storage bucket 'lookbook-images'
      const { error: uploadError } = await supabase.storage
        .from('lookbook-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // Fallback to FileReader base64 if bucket upload is not configured yet
        console.warn('Storage bucket upload failed, using fallback reader:', uploadError.message);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setImagePreview(base64);
          setImageUrlInput(base64);
        };
        reader.readAsDataURL(file);
        return;
      }

      // 4. Get permanent public CDN URL
      const { data: publicUrlData } = supabase.storage
        .from('lookbook-images')
        .getPublicUrl(filePath);

      const finalUrl = publicUrlData.publicUrl;
      setImagePreview(finalUrl);
      setImageUrlInput(finalUrl);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setErrorMsg('Failed to process image upload. Try pasting a direct image URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploading) return;

    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.set('subdomain', subdomain);
    formData.set('imageUrl', imageUrlInput);

    const res = await createProduct({ error: '' }, formData);

    setLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setImagePreview('');
      setImageUrlInput('');
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="font-serif text-xl text-white">Add Luxury Piece</h2>
          <button 
            onClick={onClose} 
            type="button"
            className="text-slate-400 hover:text-white text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="subdomain" value={subdomain} />

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Oyster Perpetual 41"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Brand / Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="ROLEX"
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Price ($ / R)
              </label>
              <input
                type="text"
                name="price"
                required
                placeholder="185000"
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Device Image Upload OR Web URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase">
              Upload Image (Laptop / Phone Camera & Photos)
            </label>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-slate-950 hover:file:bg-amber-300 cursor-pointer disabled:opacity-50"
            />

            <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider my-1">
              — OR PASTE IMAGE URL —
            </p>

            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrlInput}
              onChange={(e) => {
                const val = e.target.value;
                setImageUrlInput(val);
                setImagePreview(val);
              }}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
            />

            {/* Live Image Preview */}
            {uploading ? (
              <div className="flex items-center justify-center p-6 border border-amber-400/30 rounded-lg bg-slate-950 text-amber-400 text-xs gap-2">
                <span className="animate-spin">⏳</span> Uploading image to cloud storage...
              </div>
            ) : imagePreview ? (
              <div className="relative aspect-[4/3] w-full mt-2 rounded-lg overflow-hidden border border-amber-400/30 bg-slate-950">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : null}
          </div>

          {/* Outbound Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Affiliate / Outbound Link
            </label>
            <input
              type="url"
              name="affiliateUrl"
              placeholder="https://www.rolex.com"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Saving Piece...' : uploading ? 'Uploading Photo...' : 'Save to Lookbook'}
          </button>
        </form>
      </div>
    </div>
  );
}