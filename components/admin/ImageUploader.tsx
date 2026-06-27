'use client';

import { useRef, useState } from 'react';
import { Upload, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'productos';

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(
        'No se pudo subir la imagen. Verifica que el bucket "productos" exista en Supabase Storage. También puedes pegar una URL.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function addUrl() {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlValue('');
  }

  return (
    <div className="space-y-4">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group aspect-square bg-kdb-elevated border border-kdb-border rounded-md overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-gold text-kdb-bg text-[10px] font-semibold px-1.5 py-0.5 rounded-sm">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-kdb-bg/80 text-text-secondary hover:text-danger rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload dropzone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-kdb-border rounded-md text-text-secondary hover:border-gold hover:text-gold transition-colors disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Subiendo...</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6" />
            <span className="text-sm">Subir imágenes desde tu dispositivo</span>
            <span className="text-xs text-text-muted">PNG, JPG o WEBP</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Manual URL input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
            <LinkIcon className="w-4 h-4" />
          </span>
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="...o pega una URL de imagen"
            className="w-full pl-9 pr-3 py-2.5 bg-kdb-elevated border border-kdb-border rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="px-4 py-2.5 text-sm border border-kdb-border rounded-md text-text-secondary hover:border-gold hover:text-gold transition-colors"
        >
          Añadir
        </button>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
