
import React from 'react';
import { Product, User } from '../types';
import { WhatsAppIcon, UserIcon, TagIcon, VideoCameraIcon } from '../icons';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    onCreateOrder: (product: Product, buyerInfo: { name: string; whatsapp: string }) => void;
    currentUser: User | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onCreateOrder, currentUser }) => {
    
    const handleOrder = () => {
        let buyerName: string | null = null;
        let buyerWhatsapp: string | null = null;

        if (currentUser) {
            buyerName = currentUser.name;
            buyerWhatsapp = currentUser.whatsapp;
        } else {
            buyerName = window.prompt("Untuk melanjutkan pesanan, mohon masukkan nama Anda:");
            if (buyerName === null || buyerName.trim() === "") return;

            let waInput: string | null = null;
            let isValid = false;
            while (!isValid) {
                waInput = window.prompt("Masukkan nomor WhatsApp Anda (contoh: 08123456789):");
                if (waInput === null) return; 

                let sanitizedWa = waInput.replace(/\D/g, '');
                if (sanitizedWa.startsWith('0')) {
                    sanitizedWa = '62' + sanitizedWa.substring(1);
                } else if (!sanitizedWa.startsWith('62')) {
                    sanitizedWa = '62' + sanitizedWa;
                }

                if (sanitizedWa.length >= 11 && sanitizedWa.length <= 15) {
                    isValid = true;
                    buyerWhatsapp = sanitizedWa;
                } else {
                    alert("Nomor WhatsApp tidak valid. Mohon coba lagi.");
                }
            }
        }

        if (buyerName && buyerWhatsapp) {
            onCreateOrder(product, { name: buyerName, whatsapp: buyerWhatsapp });

            const message = encodeURIComponent(
`Halo ${product.seller.name}, saya mau pesan produk dari WANITA TANGGUH Marketplace:
--------------------------
Nama Produk: ${product.name}
Harga: Rp ${product.price.toLocaleString('id-ID')}
--------------------------
Pesanan atas nama:
Nama: ${buyerName}
WhatsApp: ${buyerWhatsapp}
--------------------------
Mohon informasinya, terimakasih.`
            );
            window.open(`https://wa.me/${product.seller.whatsapp}?text=${message}`, '_blank');
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-brand-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                        {product.videoUrl && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-gray-900">Video Produk</h3>
                                    {product.videoDuration && (
                                        <span className="text-xs font-medium text-gray-500 bg-brand-pink px-2 py-1 rounded-full flex items-center">
                                            <VideoCameraIcon className="w-4 h-4 mr-1"/>
                                            {formatDuration(product.videoDuration)}
                                        </span>
                                    )}
                                </div>
                                <video src={product.videoUrl} controls className="w-full rounded-lg shadow-lg bg-black" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center text-sm text-brand-light-green mb-2">
                           <TagIcon className="w-4 h-4 mr-2"/> {product.category}
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">{product.name}</h2>
                        <p className="text-gray-900 font-bold text-2xl my-3">Rp {product.price.toLocaleString('id-ID')}</p>
                        <div className="text-sm text-gray-500 mb-4 flex items-center">
                            <UserIcon className="w-4 h-4 mr-2 text-brand-light-green"/>
                            <p className="font-medium">{product.seller.name}</p>
                            <span className="mx-2">|</span>
                            <p>{product.seller.village}</p>
                        </div>
                        <div className="border-t border-brand-pink pt-4 mt-2">
                            <h3 className="font-semibold text-gray-900 mb-2">Deskripsi Produk</h3>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{product.description}</p>
                        </div>
                        <div className="mt-auto pt-6">
                            <p className="text-xs text-gray-500 mb-2">Stok Tersedia: {product.stock}</p>
                            <button
                                onClick={handleOrder}
                                className="w-full flex items-center justify-center bg-brand-green text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-brand-dark transition-colors duration-300 transform hover:scale-105"
                            >
                                <WhatsAppIcon className="w-5 h-5 mr-2" />
                                Pesan via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;