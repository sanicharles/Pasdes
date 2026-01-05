
import React from 'react';
import { Product, User } from '../types';
import { WhatsAppIcon, UserIcon, TagIcon, TrashIcon, EditIcon, VideoCameraIcon, ShareIcon } from '../icons';

interface ProductCardProps {
    product: Product;
    isOwner?: boolean;
    showAdminControls?: boolean;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    onCreateOrder?: (product: Product, buyerInfo: { name: string; whatsapp: string }) => void;
    currentUser: User | null;
    onCardClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isOwner, showAdminControls = false, onEditClick, onDeleteClick, onCreateOrder, currentUser, onCardClick }) => {
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
            onCreateOrder?.(product, { name: buyerName, whatsapp: buyerWhatsapp });

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

    const handleDelete = () => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
            onDeleteClick?.();
        }
    };

    const handleCardClick = () => {
        if (!isOwner) {
            onCardClick?.(product);
        }
    };
    
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const handleShare = async () => {
        const cleanBaseUrl = window.location.origin + window.location.pathname;
        const productUrl = new URL(cleanBaseUrl);
        productUrl.searchParams.set('product', product.id);

        const shareData = {
            title: `Lihat produk ini di WANITA TANGGUH: ${product.name}`,
            text: `Saya menemukan produk "${product.name}" seharga Rp ${product.price.toLocaleString('id-ID')} di marketplace WANITA TANGGUH. Cek sekarang!`,
            url: productUrl.toString(),
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    console.log('Share canceled by user.');
                } else {
                    console.error('Error sharing product:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareData.text}\n\nLihat di: ${shareData.url}`);
                alert('Tautan dan info produk telah disalin ke clipboard!');
            } catch (err) {
                console.error('Failed to copy to clipboard:', err);
                alert('Gagal menyalin info produk.');
            }
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group border border-brand-pink flex flex-col md:flex-row">
            {/* --- Image Section --- */}
            <div onClick={handleCardClick} className={`relative flex-shrink-0 md:w-56 ${!isOwner ? 'cursor-pointer' : ''}`}>
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-56 md:h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute top-0 right-0 bg-brand-gold text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                    Stok: {product.stock}
                </div>
                {product.videoUrl && product.videoDuration && (
                     <div className="absolute bottom-0 left-0 bg-black/60 text-white text-xs font-bold px-2 py-1 m-2 rounded-full flex items-center space-x-1">
                        <VideoCameraIcon className="w-4 h-4" />
                        <span>{formatDuration(product.videoDuration)}</span>
                    </div>
                )}
            </div>

            {/* --- Details Section --- */}
            <div className="p-4 flex flex-col flex-grow">
                <div onClick={handleCardClick} className={`flex-grow ${!isOwner ? 'cursor-pointer' : ''}`}>
                    <p className="text-sm text-brand-light-green mb-1 flex items-center"><TagIcon className="w-4 h-4 mr-1"/>{product.category}</p>
                    <h3 className="text-lg font-semibold text-gray-900 font-serif mb-1">{product.name}</h3>
                    <p className="text-gray-900 font-bold text-xl mb-3">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="text-xs text-gray-500 mb-4 flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-brand-light-green"/>
                    <p className="font-medium">{product.seller.name}</p>
                    {!isOwner && (
                        <button 
                            onClick={handleOrder} 
                            title="Chat Penjual via WhatsApp"
                            className="ml-2 text-brand-green hover:text-brand-dark transition-colors duration-200"
                        >
                            <WhatsAppIcon className="w-4 h-4"/>
                        </button>
                    )}
                    <span className="mx-2">|</span>
                    <p>{product.seller.village}</p>
                </div>
                
                <div className="mt-auto border-t border-brand-pink pt-4">
                    {isOwner && showAdminControls ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={onEditClick}
                                className="w-full flex items-center justify-center bg-brand-gold text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors duration-300"
                            >
                                <EditIcon className="w-5 h-5 mr-2" />
                                Edit
                            </button>
                             <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
                            >
                                <TrashIcon className="w-5 h-5 mr-2" />
                                Hapus
                            </button>
                        </div>
                    ) : isOwner ? (
                         <button
                            disabled
                            className="w-full flex items-center justify-center bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                            <UserIcon className="w-5 h-5 mr-2" />
                            Ini Produk Anda
                        </button>
                    ) : (
                         <div className="flex items-center space-x-2">
                            <button
                                onClick={handleOrder}
                                className="w-full flex items-center justify-center bg-brand-green text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-brand-dark transition-colors duration-300 transform hover:scale-105"
                            >
                                <WhatsAppIcon className="w-5 h-5 mr-2" />
                                Pesan via WhatsApp
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex-shrink-0 p-3 bg-brand-pink text-brand-dark font-semibold rounded-lg shadow-md hover:bg-brand-gold hover:text-white transition-colors duration-300"
                                aria-label="Bagikan produk"
                                title="Bagikan produk"
                            >
                                <ShareIcon className="w-5 h-5" />
                            </button>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;