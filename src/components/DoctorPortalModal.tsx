'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { HealthResource } from '@/types/health';
import {
  X, Stethoscope, Upload, Plus, DollarSign, Sparkles,
  CheckCircle2, BookOpen, Trash2, TrendingUp, LogOut,
  FileText, Eye, Gift, Loader2, Image as ImageIcon, AlertCircle,
  RefreshCw, Users, Calendar, Edit3
} from 'lucide-react';

// ─── File Upload Helper ───────────────────────────────────────────────────────
async function uploadToSupabase(
  file: File,
  bucket: 'pdfs' | 'thumbnails',
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  if (bucket === 'thumbnails') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } else {
    // For PDFs, generate a signed URL (valid 1 hour - for preview)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, 3600);
    if (error) return { url: null, error: error.message };
    return { url: data.signedUrl, error: null };
  }
}

// ─── Analytics Stats ──────────────────────────────────────────────────────────
const ANALYTICS_STATS = [
  { value: '54,820', label: 'Free Downloads', color: 'emerald' },
  { value: '$48,290', label: 'Total eBook Sales', color: 'teal' },
  { value: '12,480', label: 'Verified Patients', color: 'cyan' },
  { value: '4.96 ★', label: 'Average Rating', color: 'indigo' },
];

// ─── DoctorPortalModal ────────────────────────────────────────────────────────
export const DoctorPortalModal: React.FC = () => {
  const { user, isDoctorPortalOpen, setIsDoctorPortalOpen, logout, session } = useAuth();
  const { resources, addCustomResource, updateResource, deleteResource, addToast } = useCart();

  const [activeTab, setActiveTab] = useState<'publish' | 'manage' | 'analytics'>('publish');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // PDF upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Thumbnail upload state
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbUrl, setThumbUrl] = useState('');
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<HealthResource['category']>('nutrition');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(24.99);
  const [originalPrice, setOriginalPrice] = useState(49.99);
  const [pages, setPages] = useState(95);
  const [readingTime, setReadingTime] = useState('2.5 hours');
  const [badge, setBadge] = useState('New Medical Guide');
  const [description, setDescription] = useState('');
  const [highlight1, setHighlight1] = useState('');
  const [highlight2, setHighlight2] = useState('');
  const [highlight3, setHighlight3] = useState('');
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  if (!isDoctorPortalOpen || !user || user.role !== 'doctor') return null;

  // ── Handle PDF File Selection ─────────────────────────────────────────────
  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      addToast('Invalid File', 'Please select a valid PDF file.', 'error');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      addToast('File Too Large', 'PDF must be under 100MB.', 'error');
      return;
    }
    setPdfFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    }
  };

  // ── Handle Thumbnail Selection ────────────────────────────────────────────
  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Invalid File', 'Please select an image file (JPG, PNG, WebP).', 'error');
      return;
    }
    setThumbFile(file);
    const reader = new FileReader();
    reader.onload = ev => setThumbPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Upload PDF and Thumbnail together to API ──────────────────────────────
  const handleUploadFiles = async () => {
    if (!pdfFile) {
      addToast('No PDF', 'Please select a PDF file first.', 'error');
      return;
    }
    setPdfUploading(true);
    setThumbUploading(true);
    setSubmitError('');

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    if (thumbFile) {
      formData.append('thumbnail', thumbFile);
    }
    formData.append('title', title);
    formData.append('category', category);
    formData.append('isFree', String(isFree));
    formData.append('price', String(price));
    formData.append('description', description);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setPdfUploading(false);
      setThumbUploading(false);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setPdfUrl(data.pdfUrl);
      if (data.thumbnailUrl) {
        setThumbUrl(data.thumbnailUrl);
        setThumbPreview(data.thumbnailUrl);
      }
      addToast('Upload Successful', 'PDF and thumbnail saved to Supabase.', 'success');
    } catch (error) {
      setPdfUploading(false);
      setThumbUploading(false);
      addToast('Upload Failed', error instanceof Error ? error.message : 'Could not upload files.', 'error');
    }
  };

  // ── Handle Publish ─────────────────────────────────────────────────────────
  const handlePublishGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!title.trim() || !description.trim()) {
      setSubmitError('Please fill in the title and description.');
      return;
    }
    if (!pdfUrl) {
      setSubmitError('Please upload a PDF file first.');
      return;
    }

    setIsSubmitting(true);

    const coverImageToUse = thumbUrl || '/images/book_nutrition.jpg';

    // Save resource to Supabase database
    const resourceData = {
      title: title.trim(),
      subtitle: subtitle.trim() || 'A Clinical Protocol by Dr. Arif Chowdhury',
      category,
      is_free: isFree,
      price: isFree ? 0 : Number(price),
      original_price: isFree ? 29.99 : Number(originalPrice),
      rating: 5.0,
      review_count: 0,
      pages: Number(pages),
      reading_time: readingTime,
      cover_image_url: coverImageToUse,
      pdf_url: pdfUrl,
      badge: badge || (isFree ? '100% Free Guide 🎁' : "Doctor's Special Edition"),
      badge_color: isFree ? 'emerald' : 'indigo',
      description: description.trim(),
      highlights: [highlight1, highlight2, highlight3].filter(Boolean),
      table_of_contents: [
        'Chapter 1: Clinical Foundations & Cellular Mechanisms',
        'Chapter 2: Step-by-Step Clinical Roadmap',
        'Chapter 3: Micronutrients & Supplement Timing',
        'Chapter 4: Long-Term Sustainability Protocol',
      ],
      full_content: {
        introduction: `Authored by Dr. Arif Chowdhury. ${description.trim()}`,
        chapters: [{
          title: 'Chapter 1: Clinical Foundations',
          content: description.trim(),
          keyTakeaways: [highlight1, highlight2, highlight3].filter(Boolean),
          doctorTip: "Dr. Arif's Rule: Consistency in daily micro-habits outperforms sporadic extreme interventions.",
        }],
        conclusion: 'Sustained vitality is the natural outcome of aligning your daily biology with evolutionary principles.',
        protocolSummary: [highlight1, highlight2, highlight3].filter(Boolean),
      },
      uploaded_by: session?.user?.id || null,
      is_active: true,
    };

    if (editingResourceId) {
      // UPDATE EXISTING RESOURCE
      updateResource(editingResourceId, {
        title: resourceData.title,
        subtitle: resourceData.subtitle,
        category: resourceData.category as HealthResource['category'],
        isFree: resourceData.is_free,
        price: resourceData.price,
        originalPrice: resourceData.original_price,
        pages: resourceData.pages,
        readingTime: resourceData.reading_time,
        coverImage: coverImageToUse,
        pdfFileName: pdfUrl,
        badge: resourceData.badge,
        description: resourceData.description,
        highlights: resourceData.highlights,
      });

      // Update in Supabase if exists
      try {
        await supabase
          .from('health_resources')
          .update(resourceData)
          .eq('id', editingResourceId);
      } catch (err) {
        console.error('DB update error:', err);
      }

      addToast('Changes Saved! 💾', `"${title}" has been updated.`, 'success');
      resetForm();
      setIsSubmitting(false);
      setActiveTab('manage');
      return;
    }

    // CREATE NEW RESOURCE
    const { data: dbResource, error: dbError } = await supabase
      .from('health_resources')
      .insert(resourceData)
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
    }

    // Add to local cart context for immediate display
    const newResource: HealthResource = {
      id: dbResource?.id || 'doc_guide_' + Date.now().toString(36),
      title: resourceData.title,
      subtitle: resourceData.subtitle,
      category: resourceData.category as HealthResource['category'],
      isFree: resourceData.is_free,
      price: resourceData.price,
      originalPrice: resourceData.original_price,
      rating: 5.0,
      reviewCount: 0,
      pages: resourceData.pages,
      readingTime: resourceData.reading_time,
      coverImage: coverImageToUse,
      pdfFileName: pdfUrl,
      badge: resourceData.badge,
      badgeColor: resourceData.badge_color,
      description: resourceData.description,
      highlights: resourceData.highlights,
      tableOfContents: resourceData.table_of_contents,
      fullContent: resourceData.full_content as HealthResource['fullContent'],
      uploadedBy: 'Dr. Arif Chowdhury',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    addCustomResource(newResource);
    addToast('Guide Published! 🎉', `"${title}" is now live in the Zelovita Academy store.`, 'success');

    resetForm();
    setIsSubmitting(false);
    setActiveTab('manage');
  };

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setDescription('');
    setHighlight1(''); setHighlight2(''); setHighlight3('');
    setPdfFile(null); setPdfUrl('');
    setThumbFile(null); setThumbPreview(''); setThumbUrl('');
    setSubmitError('');
    setEditingResourceId(null);
  };

  const handleStartEdit = (res: HealthResource) => {
    setEditingResourceId(res.id);
    setTitle(res.title);
    setSubtitle(res.subtitle || '');
    setCategory(res.category);
    setIsFree(res.isFree);
    setPrice(res.price);
    setOriginalPrice(res.originalPrice || 49.99);
    setPages(res.pages);
    setReadingTime(res.readingTime);
    setBadge(res.badge || 'Official Clinical Guide');
    setDescription(res.description || '');
    setHighlight1(res.highlights?.[0] || '');
    setHighlight2(res.highlights?.[1] || '');
    setHighlight3(res.highlights?.[2] || '');
    setPdfUrl(res.pdfFileName || '');
    setThumbUrl(res.coverImage || '');
    setThumbPreview(res.coverImage || '');
    setSubmitError('');
    setActiveTab('publish');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">

        {/* Top Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Dr. Arif Chowdhury MD</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zelovita Health Academy • Publishing & Clinic Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>
            <button
              onClick={() => setIsDoctorPortalOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
          {([
            { key: 'publish', label: editingResourceId ? 'Edit Guide & PDF' : 'Upload & Publish PDF', icon: editingResourceId ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" /> },
            { key: 'manage', label: `Manage All Guides (${resources.length})`, icon: <BookOpen className="w-3.5 h-3.5" /> },
            { key: 'analytics', label: 'Academy Analytics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === 'publish' && !editingResourceId) {
                  resetForm();
                }
                setActiveTab(tab.key);
              }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">

          {/* ── PUBLISH / EDIT TAB ───────────────────────────────────────────── */}
          {activeTab === 'publish' && (
            <form onSubmit={handlePublishGuide} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingResourceId ? 'Edit Health Guide & Replace PDF' : 'Publish a New Health Guide'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {editingResourceId 
                      ? 'Update pricing, text, or select a new PDF file to replace the existing one.' 
                      : 'Upload a real PDF and thumbnail, set pricing, then publish to the Academy store instantly.'}
                  </p>
                </div>
                {editingResourceId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 transition-colors"
                  >
                    + Switch to New Upload
                  </button>
                )}
              </div>

              {/* Error display */}
              {submitError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* ─ PDF & Thumbnail Upload Section ────────────────────────────────── */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">PDF Document & Cover Upload</h5>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{pdfFile ? 'Change PDF' : 'Select PDF File'}</span>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfSelect}
                      className="hidden"
                    />
                  </label>

                  {pdfFile && !pdfUrl && !pdfUploading && (
                    <button
                      type="button"
                      onClick={handleUploadFiles}
                      disabled={pdfUploading || thumbUploading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow"
                    >
                      {(pdfUploading || thumbUploading) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload PDF to Supabase</span>
                    </button>
                  )}

                  {pdfUrl && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PDF Saved in Supabase ✓
                    </span>
                  )}
                </div>

                {pdfFile && (
                  <p className="text-[11px] text-slate-500">
                    📄 Selected: <strong>{pdfFile.name}</strong> ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    {!pdfUrl && ' — Click "Upload PDF to Supabase" to save.'}
                  </p>
                )}
                {!pdfFile && <p className="text-[11px] text-slate-400">Supports .PDF format up to 100MB</p>}

                {/* Thumbnail Upload */}
                <div className="pt-4 border-t border-emerald-300/50">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <h6 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Book Cover / Thumbnail</h6>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Preview */}
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 shadow-md border border-slate-300 dark:border-slate-600">
                      {thumbPreview || thumbUrl ? (
                        <Image src={thumbPreview || thumbUrl} alt="Thumbnail preview" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[9px]">No cover</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{thumbFile ? 'Change Image' : 'Select Thumbnail'}</span>
                        <input
                          ref={thumbInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbSelect}
                          className="hidden"
                        />
                      </label>

                      {thumbFile && !thumbUrl && (
                        <p className="text-[11px] text-slate-500">Will be uploaded with PDF</p>
                      )}

                      {thumbUrl && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Thumbnail Saved ✓
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400">JPG, PNG, or WebP (auto-generated from PDF if not provided)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─ Pricing Toggle ──────────────────────────────────────────── */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-500" /> Pricing & Access
                    </h5>
                    <p className="text-[11px] text-slate-500">Free for all, or paid eBook?</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-xl border border-slate-200 dark:border-slate-600">
                    {[true, false].map(isF => (
                      <button
                        key={String(isF)}
                        type="button"
                        onClick={() => setIsFree(isF)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isFree === isF
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isF ? '🎁 Free' : '🛒 Paid'}
                      </button>
                    ))}
                  </div>
                </div>

                {!isFree && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sale Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.99"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs border border-slate-200 dark:border-slate-700 outline-none font-bold text-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Original Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={originalPrice}
                        onChange={e => setOriginalPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ─ Guide Details ───────────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guide Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thyroid & Hormone Optimization Blueprint"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as HealthResource['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="nutrition">Nutrition & Gut Health</option>
                    <option value="longevity">Longevity & Mitochondria</option>
                    <option value="heart">Cardiovascular Health</option>
                    <option value="fasting">Intermittent Fasting</option>
                    <option value="detox">Metabolic Reset & Detox</option>
                    <option value="mental">Cognitive & Mental Vitality</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. A Science-Backed Protocol to Balance Hormones"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Medical Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the clinical methodology, who this guide is for, and key health problems it solves..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Key Highlight 1', val: highlight1, set: setHighlight1, ph: '30-Day Anti-Inflammatory Meal Plan' },
                  { label: 'Key Highlight 2', val: highlight2, set: setHighlight2, ph: 'Exact Micronutrient Dosages' },
                  { label: 'Key Highlight 3', val: highlight3, set: setHighlight3, ph: 'Lab Testing Checklist' },
                ].map(h => (
                  <div key={h.label}>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">{h.label}</label>
                    <input
                      type="text"
                      placeholder={`e.g. ${h.ph}`}
                      value={h.val}
                      onChange={e => h.set(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Number of Pages</label>
                  <input
                    type="number"
                    value={pages}
                    onChange={e => setPages(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reading Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.5 hours"
                    value={readingTime}
                    onChange={e => setReadingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !pdfUrl}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Saving...</span></>
                  ) : editingResourceId ? (
                    <><Sparkles className="w-5 h-5" /><span>Save Changes to Guide ({isFree ? 'FREE' : `$${price}`})</span></>
                  ) : (
                    <><Sparkles className="w-5 h-5" /><span>Publish to Academy Store ({isFree ? 'FREE' : `$${price}`})</span></>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── MANAGE TAB ───────────────────────────────────────────────────── */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Active Health Resources ({resources.length})</h4>
                <p className="text-xs text-slate-500">Edit guide details, replace PDF files, update pricing, or delete guides.</p>
              </div>

              <div className="space-y-3">
                {resources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 shadow">
                        <Image src={res.coverImage} alt={res.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            res.isFree ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                          }`}>
                            {res.isFree ? '100% Free' : `$${res.price.toFixed(2)}`}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">• {res.category}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{res.title}</h5>
                        <p className="text-[11px] text-slate-500 truncate">{res.pages} Pages • {res.readingTime} • {res.pdfFileName || 'No PDF'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(res)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit / Replace PDF</span>
                      </button>

                      {/* Toggle Price Button */}
                      <button
                        onClick={() => updateResource(res.id, { isFree: !res.isFree, price: res.isFree ? 29.99 : 0 })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          res.isFree
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300'
                        }`}
                      >
                        {res.isFree ? '✓ Free' : '💵 Paid'}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteResource(res.id)}
                        aria-label="Remove guide"
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ────────────────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Zelovita Health Academy Analytics</h4>
                <p className="text-xs text-slate-500">Global readership, downloads, and patient engagement metrics.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ANALYTICS_STATS.map((stat, i) => (
                  <div key={i} className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-950/40 border border-${stat.color}-200 dark:border-${stat.color}-800 text-center`}>
                    <span className={`text-2xl font-extrabold text-${stat.color}-700 dark:text-${stat.color}-300`}>{stat.value}</span>
                    <span className="text-xs font-bold block text-slate-700 dark:text-slate-300 mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Published Resources Summary
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-emerald-600">{resources.filter(r => r.isFree).length}</span>
                    <p className="text-[11px] text-slate-500 font-medium">Free Guides</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-indigo-600">{resources.filter(r => !r.isFree).length}</span>
                    <p className="text-[11px] text-slate-500 font-medium">Paid eBooks</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-teal-600">{resources.length}</span>
                    <p className="text-[11px] text-slate-500 font-medium">Total Published</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
