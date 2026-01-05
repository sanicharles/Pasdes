
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { CameraIcon, UploadIcon, VideoCameraIcon } from '../icons';

export type ProductFormData = Omit<Product, 'id' | 'seller' | 'createdAt' | 'imageUrl'> & { imageUrl: string | null, videoUrl?: string | null, videoDuration?: number | null };

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: ProductFormData, id?: string) => void;
    productToEdit: Product | null;
    village: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, productToEdit, village }) => {
    const isEditMode = !!productToEdit;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const videoFileInputRef = useRef<HTMLInputElement>(null);
    const videoCameraInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setName(''); setPrice(''); setStock(''); setDescription('');
        setCategory(''); setImagePreview(null); setVideoPreview(null);
        setVideoDuration(null);
    };

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setName(productToEdit.name);
                setPrice(productToEdit.price.toString());
                setStock(productToEdit.stock.toString());
                setDescription(productToEdit.description);
                setCategory(productToEdit.category);
                setImagePreview(productToEdit.imageUrl);
                setVideoPreview(productToEdit.videoUrl || null);
                setVideoDuration(productToEdit.videoDuration || null);
            } else {
                resetForm();
            }
        }
    }, [productToEdit, isOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        }
    };
    
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src);
                if (videoElement.duration > 10) {
                    alert('Durasi video tidak boleh melebihi 10 detik.');
                    setVideoPreview(null);
                    setVideoDuration(null);
                    return;
                }
                setVideoDuration(videoElement.duration);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setVideoPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            };
            videoElement.src = URL.createObjectURL(file);
            e.target.value = '';
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && price && stock && description && category && imagePreview) {
            onSave({
                name,
                price: parseInt(price),
                stock: parseInt(stock),
                description,
                category,
                village,
                imageUrl: imagePreview,
                videoUrl: videoPreview,
                videoDuration: videoDuration,
            }, isEditMode ? productToEdit.id : undefined);
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div 
                className="bg-brand-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold mb-6 text-gray-900 font-serif">{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nama Produk" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-brand-pink rounded-md focus:ring-brand-gold focus:border-brand-gold"/>
                        <input type="text" placeholder="Kategori (e.g., Makanan, Kerajinan)" value={category} onChange={e => setCategory(e.target.value)} required className="w-full p-2 border border-brand-pink rounded-md focus:ring-brand-gold focus:border-brand-gold"/>
                        <input type="number" placeholder="Harga (Rp)" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border border-brand-pink rounded-md focus:ring-brand-gold focus:border-brand-gold"/>
                        <input type="number" placeholder="Stok" value={stock} onChange={e => setStock(e.target.value)} required className="w-full p-2 border border-brand-pink rounded-md focus:ring-brand-gold focus:border-brand-gold"/>
                    </div>
                    <textarea placeholder="Deskripsi Produk" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border border-brand-pink rounded-md h-24 focus:ring-brand-gold focus:border-brand-gold"/>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Foto Produk (Wajib)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-pink border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto rounded-md object-cover"/>
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                                <div className="flex text-sm text-gray-600 justify-center gap-4 mt-4">
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-brand-light-green text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-brand-green transition-colors duration-300">
                                        <UploadIcon className="w-5 h-5"/> Pilih Gambar
                                    </button>
                                    <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-2 bg-brand-gold text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors duration-300">
                                        <CameraIcon className="w-5 h-5"/> Ambil Foto
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Video Produk (Opsional, max 10 detik)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-pink border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {videoPreview ? (
                                    <video src={videoPreview} controls className="mx-auto h-40 w-auto rounded-md bg-black" />
                                ) : (
                                    <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600 justify-center gap-4 mt-4">
                                    <input ref={videoFileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                                    <input ref={videoCameraInputRef} type="file" accept="video/*" capture="user" className="hidden" onChange={handleVideoChange} />
                                    <button type="button" onClick={() => videoFileInputRef.current?.click()} className="flex items-center gap-2 bg-brand-light-green text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-brand-green transition-colors duration-300">
                                        <UploadIcon className="w-5 h-5"/> Pilih Video
                                    </button>
                                    <button type="button" onClick={() => videoCameraInputRef.current?.click()} className="flex items-center gap-2 bg-brand-gold text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors duration-300">
                                        <VideoCameraIcon className="w-5 h-5"/> Rekam Video
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">MP4, MOV, WEBM</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button type="button" onClick={handleClose} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-green transition-colors">
                            Batal
                        </button>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors">
                            {isEditMode ? 'Simpan Perubahan' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;