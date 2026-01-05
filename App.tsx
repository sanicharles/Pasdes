
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, UserRole, Order } from './types';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import ProductModal, { ProductFormData } from './components/AddProductModal';
import NotificationToast from './components/NotificationToast';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import Chatbot from './components/Chatbot';
import EditMemberModal from './components/EditMemberModal';
import { UserIcon, ReceiptIcon, WhatsAppIcon, SearchIcon, TagIcon, EditIcon, TrashIcon } from './icons';
import { Logo } from './Logo';

const INITIAL_ADMIN_WHATSAPP = '6281234567890';
const ADMIN_PASSWORD = 'wanitahebat2024';

// MOCK DATA
let mockUsers: User[] = [
    { id: 'user-1', name: 'Ibu Siti', whatsapp: '6281111111111', village: 'Desa Sukamaju', role: UserRole.MEMBER, isVerified: true },
    { id: 'user-2', name: 'Mbak Yuni', whatsapp: '6282222222222', village: 'Desa Makmur', role: UserRole.MEMBER, isVerified: true },
    { id: 'user-3', name: 'Bapak Agus', whatsapp: '6283333333333', village: 'Desa Asri', role: UserRole.MEMBER, isVerified: false },
    { id: 'user-4', name: 'Wati', whatsapp: '6284444444444', village: 'Sukamaju', role: UserRole.MEMBER, isVerified: true },
    { id: 'user-admin', name: 'Admin Desa', whatsapp: INITIAL_ADMIN_WHATSAPP, village: 'Kantor Desa', role: UserRole.ADMIN, isVerified: true },
];

let mockProducts: Product[] = [
    { id: 'prod-1', name: 'Kue Lapis Legit', price: 75000, stock: 10, description: 'Kue lapis legit buatan tangan dengan resep warisan.\n\nDibuat dengan bahan-bahan premium dan tanpa pengawet, menjamin rasa dan kualitas terbaik.', category: 'Makanan & Minuman', village: 'Desa Sukamaju', imageUrl: 'https://picsum.photos/seed/kue1/400/300', seller: mockUsers[0], createdAt: Date.now() - 100000 },
    { id: 'prod-2', name: 'Tas Rajut Cantik', price: 120000, stock: 5, description: 'Tas rajut tangan dari benang katun berkualitas.\n\nSetiap tas adalah unik dan dibuat dengan penuh cinta oleh pengrajin lokal.', category: 'Kerajinan Tangan', village: 'Desa Makmur', imageUrl: 'https://picsum.photos/seed/tas1/400/300', seller: mockUsers[1], createdAt: Date.now() - 200000, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', videoDuration: 8.0 },
    { id: 'prod-3', name: 'Rengginang Gurih', price: 25000, stock: 30, description: 'Rengginang renyah dan gurih, cocok untuk camilan.\n\nTersedia dalam rasa original dan terasi.', category: 'Makanan & Minuman', village: 'Sukamaju', imageUrl: 'https://picsum.photos/seed/rengginang/400/300', seller: mockUsers[3], createdAt: Date.now() - 50000 },
    { id: 'prod-4', name: 'Sapu Ijuk Berkualitas', price: 35000, stock: 20, description: 'Sapu ijuk kuat dan tahan lama, membersihkan debu dengan efektif. Asli buatan pengrajin lokal.', category: 'Rumah Tangga', village: 'Desa Sukamaju', imageUrl: 'https://picsum.photos/seed/sapu/400/300', seller: mockUsers[0], createdAt: Date.now() - 300000 },
    { id: 'prod-5', name: 'Kursi Bambu Unik', price: 150000, stock: 8, description: 'Satu set kursi bambu (2 kursi, 1 meja) unik dan estetik. Cocok untuk teras rumah.', category: 'Perabotan & Dekorasi', village: 'Desa Makmur', imageUrl: 'https://picsum.photos/seed/kursi/400/300', seller: mockUsers[1], createdAt: Date.now() - 400000 },
    { id: 'prod-6', name: 'Jasa Jahit Pakaian', price: 50000, stock: 99, description: 'Menerima jasa jahit pakaian wanita dan pria. Harga mulai dari 50.000 (tergantung model).', category: 'Jasa', village: 'Sukamaju', imageUrl: 'https://picsum.photos/seed/jahit/400/300', seller: mockUsers[3], createdAt: Date.now() - 500000 },
    { id: 'prod-7', name: 'Servis Motor Ringan', price: 45000, stock: 99, description: 'Jasa servis ringan untuk segala jenis motor bebek dan matic. Ganti oli, cek rem, dll.', category: 'Jasa Otomotif', village: 'Desa Sukamaju', imageUrl: 'https://picsum.photos/seed/motor/400/300', seller: mockUsers[0], createdAt: Date.now() - 600000 },
    { id: 'prod-8', name: 'Bibit Pohon Mangga', price: 20000, stock: 50, description: 'Bibit pohon mangga Harum Manis siap tanam. Tinggi bibit sekitar 50-70 cm.', category: 'Pertanian & Lainnya', village: 'Desa Makmur', imageUrl: 'https://picsum.photos/seed/bibit/400/300', seller: mockUsers[1], createdAt: Date.now() - 700000 },
];


// PAGE COMPONENTS (defined outside App to prevent re-creation on every render)

const HomePage = ({ products, onCreateOrder, currentUser, categories, selectedCategory, onSelectCategory, onProductCardClick, sortOrder, onSortOrderChange, searchQuery, onSearchChange, villages, selectedVillage, onSelectVillage }: {
    products: Product[];
    onCreateOrder: (product: Product, buyerInfo: { name: string; whatsapp: string; }) => void;
    currentUser: User | null;
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    onProductCardClick: (product: Product) => void;
    sortOrder: 'newest' | 'oldest';
    onSortOrderChange: (order: 'newest' | 'oldest') => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    villages: string[];
    selectedVillage: string;
    onSelectVillage: (village: string) => void;
}) => (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-gray-900">Etalase Desa</h2>
            <p className="text-gray-600 mt-2">Temukan produk unggulan dari para wanita tangguh di desa kita.</p>
        </div>

        <div className="mb-8 max-w-lg mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari produk impianmu..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-brand-pink rounded-full focus:ring-brand-gold focus:border-brand-gold shadow-sm text-gray-900 placeholder-gray-500"
                    aria-label="Cari Produk"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>

        <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4 sm:gap-0">
                <h3 className="text-xl font-serif text-gray-900 text-center md:text-left">Filter Produk</h3>
                <div className="flex items-center space-x-4 self-center sm:self-auto">
                     <div className="flex items-center space-x-2">
                        <label htmlFor="village-filter" className="text-sm font-medium text-gray-700">Desa:</label>
                        <select 
                            id="village-filter" 
                            value={selectedVillage}
                            onChange={(e) => onSelectVillage(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm rounded-md shadow-sm"
                        >
                            {villages.map(village => (
                                <option key={village} value={village}>{village}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="sort-order" className="text-sm font-medium text-gray-700">Urutkan:</label>
                        <select 
                            id="sort-order" 
                            value={sortOrder}
                            onChange={(e) => onSortOrderChange(e.target.value as 'newest' | 'oldest')}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm rounded-md shadow-sm"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                 {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap shadow-sm ${
                            selectedCategory === category
                                ? 'bg-brand-dark text-white'
                                : 'bg-brand-pink text-gray-900 hover:bg-brand-gold hover:text-white'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
            {products.length > 0 ? (
                products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onCreateOrder={onCreateOrder} 
                        currentUser={currentUser} 
                        onCardClick={onProductCardClick}
                        isOwner={currentUser?.id === product.seller.id}
                    />
                ))
            ) : (
                <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">
                    <p className="font-semibold">Tidak ada produk yang cocok dengan filter Anda.</p>
                    <p className="text-sm mt-1">Coba ubah pilihan filter atau kembali ke semua produk.</p>
                </div>
            )}
        </div>
    </div>
);

const AboutPage = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
            <Logo size={60} textColor="text-brand-dark" />
        </div>
        <div className="text-center mb-8 -mt-4">
            <h2 className="text-4xl font-serif font-bold text-gray-900">Tentang Aplikasi Ini</h2>
            <p className="text-gray-600 mt-2">Memberdayakan Ekonomi Desa, Satu Transaksi pada Satu Waktu.</p>
        </div>
        <div className="space-y-6 text-gray-800 text-justify">
            <p>
                <b>WANITA TANGGUH</b> adalah sebuah inisiatif digital yang lahir dari semangat untuk memajukan potensi ekonomi di lingkungan pedesaan. Kami percaya bahwa setiap ibu, setiap wanita, dan setiap anggota masyarakat desa memiliki produk dan keahlian unik yang layak untuk dikenal lebih luas. Aplikasi ini kami dedikasikan sebagai jembatan yang menghubungkan para produsen lokal dengan pasar yang lebih besar, dimulai dari tetangga sendiri.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center pt-4">
                <div className="bg-brand-pink/50 p-6 rounded-lg">
                    <TagIcon className="w-10 h-10 mx-auto text-brand-gold mb-3" />
                    <h3 className="font-serif font-bold text-xl mb-2">Jual Beli Mudah</h3>
                    <p className="text-sm">Tampilkan produk unggulan Anda—mulai dari kuliner, kerajinan tangan, hingga jasa—dengan mudah melalui etalase digital yang elegan.</p>
                </div>
                <div className="bg-brand-pink/50 p-6 rounded-lg">
                    <WhatsAppIcon className="w-10 h-10 mx-auto text-brand-green mb-3" />
                    <h3 className="font-serif font-bold text-xl mb-2">Transaksi via WhatsApp</h3>
                    <p className="text-sm">Negosiasi dan transaksi dilakukan langsung melalui WhatsApp, platform komunikasi yang sudah akrab digunakan sehari-hari.</p>
                </div>
                <div className="bg-brand-pink/50 p-6 rounded-lg">
                    <UserIcon className="w-10 h-10 mx-auto text-brand-dark mb-3" />
                    <h3 className="font-serif font-bold text-xl mb-2">Dukungan Komunitas</h3>
                    <p className="text-sm">Setiap transaksi adalah bentuk dukungan nyata bagi tetangga dan perekonomian desa, memperkuat ikatan sosial dan ekonomi lokal.</p>
                </div>
            </div>
            <p className="pt-4">
                Misi kami adalah menciptakan ekosistem ekonomi digital yang inklusif, aman, dan berakar pada kekuatan komunitas. Mari bergabung bersama kami, baik sebagai penjual maupun pembeli, dan jadilah bagian dari gerakan <b>WANITA TANGGUH</b> untuk desa yang lebih mandiri dan sejahtera.
            </p>
        </div>
    </div>
);

const NotificationBroadcast = ({ allProducts, newProductIds, adminWhatsapp, onBroadcastSent }: { allProducts: Product[], newProductIds: string[], adminWhatsapp: string, onBroadcastSent: () => void }) => {
    if (newProductIds.length === 0) return null;

    const newProducts = allProducts.filter(p => newProductIds.includes(p.id));

    const handleBroadcast = () => {
        const header = `✨ *Produk Baru di Marketplace Wanita Tangguh!* ✨\n\nHalo semua! Ada produk baru yang menarik nih dari tetangga kita:\n\n`;
        const productList = newProducts.map((p, index) => 
            `${index + 1}. *${p.name}* - Rp ${p.price.toLocaleString('id-ID')}\n   Oleh: ${p.seller.name} (${p.seller.village})`
        ).join('\n\n');
        const footer = `\n\nYuk, langsung cek dan dukung usaha lokal kita!`;
        
        const message = encodeURIComponent(header + productList + footer);
        window.open(`https://wa.me/${adminWhatsapp}?text=${message}`, '_blank');
        onBroadcastSent();
    };

    return (
        <div className="bg-brand-gold/20 border-2 border-dashed border-brand-gold p-6 rounded-lg mb-8 animate-fade-in-down">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Notifikasi Produk Baru</h3>
            <p className="text-gray-900 mb-4">Ada {newProducts.length} produk baru yang ditambahkan. Sebarkan informasinya ke anggota lain!</p>
            <ul className="list-disc list-inside text-sm text-gray-900 space-y-1 mb-6">
                {newProducts.map(p => <li key={p.id}><strong>{p.name}</strong> oleh {p.seller.name}</li>)}
            </ul>
            <button
                onClick={handleBroadcast}
                className="w-full flex items-center justify-center bg-brand-green text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-brand-dark transition-colors duration-300 transform hover:scale-105"
            >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Kirim Notifikasi via WhatsApp
            </button>
        </div>
    );
};

const AdminPage = ({ users, products, orders, onVerifyUser, onEditUser, onDeleteUser, adminWhatsapp, onUpdateAdminWhatsapp, newProductIds, onBroadcastSent }: { users: User[], products: Product[], orders: Order[], onVerifyUser: (userId: string) => void, onEditUser: (user: User) => void, onDeleteUser: (userId: string) => void, adminWhatsapp: string, onUpdateAdminWhatsapp: (newNumber: string) => void, newProductIds: string[], onBroadcastSent: () => void }) => {
    type SortKey = 'name' | 'village' | 'isVerified';
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isEditingAdmin, setIsEditingAdmin] = useState(false);
    const [newAdminNumber, setNewAdminNumber] = useState(adminWhatsapp.substring(2));

    const members = users.filter(u => u.role === UserRole.MEMBER);
    const verifiedCount = users.filter(u => u.role === UserRole.MEMBER && u.isVerified).length;
    const unverifiedCount = members.length - verifiedCount;

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };
    
    const handleSaveAdminNumber = () => {
        if (newAdminNumber.length >= 10 && !isNaN(Number(newAdminNumber))) {
            onUpdateAdminWhatsapp(newAdminNumber);
            setIsEditingAdmin(false);
        } else {
            alert('Nomor WhatsApp tidak valid. Harap masukkan nomor yang benar.');
        }
    };

    const sortedMembers = useMemo(() => {
        let sortableItems = [...members];
        if (sortKey !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];
                let comparison = 0;
                if (typeof valA === 'string' && typeof valB === 'string') {
                    comparison = valA.localeCompare(valB);
                } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                    comparison = valA === valB ? 0 : valA ? 1 : -1;
                }
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        } else {
            sortableItems.sort((a, b) => (a.isVerified === b.isVerified) ? 0 : a.isVerified ? 1 : -1);
        }
        return sortableItems;
    }, [members, sortKey, sortDirection]);

    const SortableHeader = ({ label, columnKey }: { label: string; columnKey: SortKey }) => (
        <button onClick={() => handleSort(columnKey)} className="flex items-center space-x-1 font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            <span>{label}</span>
            {sortKey === columnKey && (
                <span className="text-brand-gold">{sortDirection === 'asc' ? '▲' : '▼'}</span>
            )}
        </button>
    );

    const maskWhatsappNumber = (whatsapp: string) => {
        if (whatsapp.length > 8) {
            return `${whatsapp.substring(0, 4)}...${whatsapp.substring(whatsapp.length - 4)}`;
        }
        return whatsapp;
    };

    return (
        <div className="bg-brand-pink/50 p-6 rounded-lg space-y-8">
            <NotificationBroadcast allProducts={products} newProductIds={newProductIds} adminWhatsapp={adminWhatsapp} onBroadcastSent={onBroadcastSent} />
            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Dashboard Admin</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Anggota Terverifikasi</p><p className="text-2xl font-bold">{verifiedCount}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Perlu Verifikasi</p><p className="text-2xl font-bold">{unverifiedCount}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Total Produk</p><p className="text-2xl font-bold">{products.length}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Total Pesanan</p><p className="text-2xl font-bold">{orders.length}</p></div>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Manajemen Anggota</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm">
                        <div className="col-span-5"><SortableHeader label="Nama Anggota" columnKey="name" /></div>
                        <div className="col-span-3"><SortableHeader label="Desa" columnKey="village" /></div>
                        <div className="col-span-2"><SortableHeader label="Status" columnKey="isVerified" /></div>
                        <div className="col-span-2 text-right font-semibold text-gray-600">Aksi</div>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {sortedMembers.map(member => (
                            <li key={member.id} className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center hover:bg-gray-50">
                                <div className="col-span-12 sm:col-span-5 flex items-center">
                                    <div className={`p-2 rounded-full mr-4 ${member.isVerified ? 'bg-brand-light-green' : 'bg-yellow-400'} text-white`}><UserIcon className="w-6 h-6"/></div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{member.name}</p>
                                        <p className="text-sm text-gray-500 sm:hidden">{member.village}</p>
                                        <p className="text-sm text-gray-500">{member.whatsapp}</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block sm:col-span-3 text-sm text-gray-700">{member.village}</div>
                                <div className="col-span-6 sm:col-span-2">
                                    {member.isVerified ? ( <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Terverifikasi</span> ) : ( <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Perlu Verifikasi</span> )}
                                </div>
                                <div className="col-span-6 sm:col-span-2 flex justify-end items-center space-x-2">
                                    {!member.isVerified && ( <button onClick={() => onVerifyUser(member.id)} className="bg-brand-green text-white font-semibold px-4 py-1 rounded-full text-sm hover:bg-brand-dark transition-colors">Verifikasi</button> )}
                                    <button onClick={() => onEditUser(member)} className="p-2 text-gray-500 hover:text-brand-gold rounded-full hover:bg-brand-pink transition-colors" title="Edit Anggota">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDeleteUser(member.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors" title="Hapus Anggota">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="mt-4">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center"><ReceiptIcon className="w-6 h-6 mr-2" /> Riwayat Pesanan Masuk</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {orders.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {orders.sort((a,b) => b.createdAt - a.createdAt).map(order => (
                                <li key={order.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50 space-y-2 sm:space-y-0">
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.product.name}</p>
                                        <p className="text-sm text-gray-500">Oleh: {order.seller.name} - Rp {order.product.price.toLocaleString('id-ID')}</p>
                                        <p className="text-xs text-gray-900 mt-1">Dipesan oleh: {order.buyerName} ({order.buyerWhatsapp})</p>
                                    </div>
                                    <p className="text-sm text-gray-500 self-end sm:self-center">{new Date(order.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 p-8">Belum ada pesanan yang masuk.</p>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Pengaturan Admin</h3>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-semibold text-gray-900">Nomor WhatsApp Admin</h4>
                    {!isEditingAdmin ? (
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-gray-700 font-mono tracking-wider">{maskWhatsappNumber(adminWhatsapp)}</p>
                            <button onClick={() => { setIsEditingAdmin(true); setNewAdminNumber(adminWhatsapp.substring(2)); }} className="bg-brand-gold text-white font-semibold px-4 py-1 rounded-full text-sm hover:bg-opacity-90 transition-colors">
                                Ubah
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2 space-y-3">
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-brand-pink bg-gray-50 text-gray-500 text-sm">+62</span>
                                <input type="tel" value={newAdminNumber} onChange={e => setNewAdminNumber(e.target.value.replace(/\D/g, ''))} className="block w-full px-3 py-2 bg-white border border-brand-pink rounded-r-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" />
                            </div>
                            <div className="flex space-x-2 justify-end">
                                <button onClick={() => setIsEditingAdmin(false)} className="bg-gray-200 text-gray-800 font-semibold px-4 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors">
                                    Batal
                                </button>
                                <button onClick={handleSaveAdminNumber} className="bg-brand-green text-white font-semibold px-4 py-1 rounded-full text-sm hover:bg-brand-dark transition-colors">
                                    Simpan
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

const ProfilePage = ({ user, products, orders, onEditProduct, onDeleteProduct }: { user: User, products: Product[], orders: Order[], onEditProduct: (product: Product) => void, onDeleteProduct: (productId: string) => void }) => {
    const myOrders = orders.filter(order => order.seller.id === user.id);
    
    return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
            <div className="bg-brand-gold text-white rounded-full p-6">
                <UserIcon className="w-20 h-20"/>
            </div>
            <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">@{user.whatsapp}</p>
                <p className="text-brand-green font-semibold mt-2">{user.village}</p>
                 {!user.isVerified && user.role === UserRole.MEMBER && (
                    <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded">
                        <p className="font-bold">Akun Anda sedang ditinjau oleh Admin.</p>
                        <p className="text-sm">Anda akan dapat menjual produk setelah akun diverifikasi.</p>
                    </div>
                )}
            </div>
        </div>
        <div className="mt-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Produk Saya</h3>
            {products.length > 0 ? (
                 <div className="space-y-6">
                    {products.map(product => <ProductCard key={product.id} product={product} isOwner={true} showAdminControls={true} onEditClick={() => onEditProduct(product)} onDeleteClick={() => onDeleteProduct(product.id)} currentUser={user} />)}
                </div>
            ) : (
                <p className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">Anda belum memiliki produk.</p>
            )}
        </div>

        <div className="mt-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center"><ReceiptIcon className="w-6 h-6 mr-2" /> Pesanan Masuk</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6">
                 {myOrders.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {myOrders.sort((a,b) => b.createdAt - a.createdAt).map(order => (
                             <li key={order.id} className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                <div>
                                    <p className="font-semibold text-gray-900">Pesanan untuk: {order.product.name}</p>
                                    <p className="text-sm text-gray-500">Harga: Rp {order.product.price.toLocaleString('id-ID')}</p>
                                    <p className="text-xs text-gray-900 mt-1">Dipesan oleh: {order.buyerName} ({order.buyerWhatsapp})</p>
                                </div>
                                <p className="text-sm text-gray-500 self-end sm:self-center">{new Date(order.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">Anda belum menerima pesanan.</p>
                )}
            </div>
        </div>
    </div>
    );
};

// MAIN APP COMPONENT

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState<'home' | 'admin' | 'profile' | 'about'>('home');
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [adminWhatsapp, setAdminWhatsapp] = useState(INITIAL_ADMIN_WHATSAPP);
    const [hasPendingVerification, setHasPendingVerification] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedVillage, setSelectedVillage] = useState('Semua');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
    const [newProductIdsForNotification, setNewProductIdsForNotification] = useState<string[]>([]);
    const [isEditMemberModalOpen, setEditMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<User | null>(null);

    useEffect(() => {
        setUsers(mockUsers);
        setProducts(mockProducts);

        // Handle deep linking from shared product URLs
        const urlParams = new URLSearchParams(window.location.search);
        const productIdFromUrl = urlParams.get('product');
        if (productIdFromUrl) {
            const productToShow = mockProducts.find(p => p.id === productIdFromUrl);
            if (productToShow) {
                setSelectedProductForDetail(productToShow);
            }
        }
    }, []);
    
    useEffect(() => {
        const pending = users.some(u => u.role === UserRole.MEMBER && !u.isVerified);
        setHasPendingVerification(pending);
    }, [users]);

    const categories = useMemo(() => ['Semua', ...Array.from(new Set(products.map(p => p.category)))], [products]);
    const villages = useMemo(() => {
        const uniqueVillages = [...new Set(users.filter(u => u.isVerified).map(u => u.village))];
        return ['Semua', ...uniqueVillages.sort()];
    }, [users]);
    const hasNewProducts = newProductIdsForNotification.length > 0;

    const handleMemberRegister = (name: string, whatsapp: string, village: string) => {
        const fullWhatsapp = '62' + whatsapp;
        const existingUser = users.find(u => u.whatsapp === fullWhatsapp);
        
        if (existingUser) {
            alert('Nomor WhatsApp ini sudah terdaftar. Silakan masuk.');
            return;
        }
        
        const newUser: User = { id: `user-${Date.now()}`, name, whatsapp: fullWhatsapp, village, role: UserRole.MEMBER, isVerified: false };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setLoginModalOpen(false);
        setNotification('Pendaftaran berhasil! Akun Anda akan diverifikasi Admin.');
    };

    const handleMemberLogin = (whatsapp: string) => {
        const fullWhatsapp = '62' + whatsapp;
        const existingUser = users.find(u => u.whatsapp === fullWhatsapp && u.role === UserRole.MEMBER);

        if (existingUser) {
            setCurrentUser(existingUser);
            setLoginModalOpen(false);
        } else {
            alert('Anggota tidak ditemukan. Silakan periksa kembali nomor Anda atau daftar terlebih dahulu.');
        }
    };

    const handleAdminLogin = (whatsapp: string, password: string) => {
        const fullWhatsapp = '62' + whatsapp;
        const adminUser = users.find(u => u.whatsapp === fullWhatsapp && u.role === UserRole.ADMIN);

        if (adminUser && fullWhatsapp === adminWhatsapp && password === ADMIN_PASSWORD) {
            setCurrentUser(adminUser);
            setLoginModalOpen(false);
        } else {
            alert('Login Gagal. Nomor WhatsApp atau password yang Anda masukkan salah.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPage('home');
    };

    const handleOpenAddModal = () => {
        if (currentUser && currentUser.isVerified) {
            setEditingProduct(null);
            setProductModalOpen(true);
        } else {
            setNotification('Akun Anda perlu diverifikasi oleh Admin untuk mulai berjualan.');
        }
    };
    
    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setProductModalOpen(true);
    };

    const handleCloseProductModal = () => {
        setProductModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (productData: ProductFormData, id?: string) => {
        if (!currentUser) return;
    
        const finalProductData = {
            ...productData,
            videoUrl: productData.videoUrl || undefined,
            videoDuration: productData.videoDuration || undefined,
        };
    
        if (id) { // Update
            const updatedProducts = products.map(p => p.id === id ? { 
                ...p, 
                ...finalProductData, 
                imageUrl: finalProductData.imageUrl!, 
            } : p);
            setProducts(updatedProducts);
            mockProducts = updatedProducts;
            setNotification('Produk berhasil diperbarui!');
        } else { // Add new
            const newProduct: Product = {
                ...finalProductData,
                id: `prod-${Date.now()}`,
                seller: currentUser,
                createdAt: Date.now(),
                imageUrl: finalProductData.imageUrl!,
            };
            const updatedProducts = [newProduct, ...products];
            setProducts(updatedProducts);
            mockProducts = updatedProducts;
            setNotification('Produk baru berhasil ditambahkan!');
            setNewProductIdsForNotification(prev => [...prev, newProduct.id]);
        }
    };
    
    const handleDeleteProduct = (productId: string) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        mockProducts = updatedProducts;
        setNotification('Produk berhasil dihapus.');
    };
    
    const handleVerifyUser = (userId: string) => {
        setUsers(users.map(user => user.id === userId ? { ...user, isVerified: true } : user));
        setNotification('Anggota berhasil diverifikasi!');
    };
    
    const handleCreateOrder = (product: Product, buyerInfo: { name: string; whatsapp: string }) => {
        const newOrder: Order = {
            id: `order-${Date.now()}`,
            product,
            seller: product.seller,
            buyerName: buyerInfo.name,
            buyerWhatsapp: buyerInfo.whatsapp,
            createdAt: Date.now()
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    const handleNavigate = (targetPage: 'home' | 'admin' | 'profile' | 'about') => {
        if (targetPage === 'profile' && !currentUser) {
            setLoginModalOpen(true);
            return;
        }
        if (targetPage === 'admin' && currentUser?.role === UserRole.ADMIN) {
            setHasPendingVerification(false);
        }
        if (targetPage === 'home') {
            setSelectedCategory('Semua');
            setSelectedVillage('Semua');
        }
        setPage(targetPage);
    };

    const handleUpdateAdminWhatsapp = (newNumber: string) => {
        const newFullNumber = '62' + newNumber;
        setAdminWhatsapp(newFullNumber);
        setUsers(users.map(u => (u.role === UserRole.ADMIN ? { ...u, whatsapp: newFullNumber } : u)));
        setNotification("Nomor Admin berhasil diperbarui!");
    };

    const handleProductCardClick = (product: Product) => {
        setSelectedProductForDetail(product);
    };

    const handleCloseDetailModal = () => {
        setSelectedProductForDetail(null);
    };

    const handleOpenEditMemberModal = (user: User) => {
        setEditingMember(user);
        setEditMemberModalOpen(true);
    };

    const handleCloseEditMemberModal = () => {
        setEditingMember(null);
        setEditMemberModalOpen(false);
    };

    const handleUpdateMember = (updatedData: { name: string; village: string }, userId: string) => {
        const updatedUsers = users.map(user => user.id === userId ? { ...user, ...updatedData } : user);
        setUsers(updatedUsers);
        mockUsers = updatedUsers;
        setNotification('Data anggota berhasil diperbarui!');
        handleCloseEditMemberModal();
    };

    const handleDeleteMember = (userId: string) => {
        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete) return;

        const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus anggota "${userToDelete.name}"? Tindakan ini akan menyembunyikan semua produk mereka dari etalase, tetapi tidak akan menghapusnya secara permanen.`);

        if (isConfirmed) {
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            mockUsers = updatedUsers;
            setNotification('Anggota berhasil dihapus dan produknya diarsipkan.');
        }
    };

    const renderPage = () => {
        const visibleProducts = products.filter(p => users.find(u => u.id === p.seller.id)?.isVerified);
        
        const categoryFilteredProducts = selectedCategory === 'Semua'
            ? visibleProducts
            : visibleProducts.filter(p => p.category === selectedCategory);
        
        const villageFilteredProducts = selectedVillage === 'Semua'
            ? categoryFilteredProducts
            : categoryFilteredProducts.filter(p => p.seller.village === selectedVillage);

        const searchedProducts = searchQuery.trim() === ''
            ? villageFilteredProducts
            : villageFilteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

        const sortedProducts = [...searchedProducts].sort((a, b) => {
            if (sortOrder === 'newest') {
                return b.createdAt - a.createdAt;
            } else {
                return a.createdAt - b.createdAt;
            }
        });

        const homePageProps = {
            products: sortedProducts,
            onCreateOrder: handleCreateOrder,
            currentUser: currentUser,
            categories: categories,
            selectedCategory: selectedCategory,
            onSelectCategory: setSelectedCategory,
            villages: villages,
            selectedVillage: selectedVillage,
            onSelectVillage: setSelectedVillage,
            onProductCardClick: handleProductCardClick,
            sortOrder: sortOrder,
            onSortOrderChange: setSortOrder,
            searchQuery: searchQuery,
            onSearchChange: setSearchQuery,
        };
        
        const adminPageProps = {
            users: users,
            products: visibleProducts,
            orders: orders,
            onVerifyUser: handleVerifyUser,
            onEditUser: handleOpenEditMemberModal,
            onDeleteUser: handleDeleteMember,
            adminWhatsapp: adminWhatsapp,
            onUpdateAdminWhatsapp: handleUpdateAdminWhatsapp,
            newProductIds: newProductIdsForNotification,
            onBroadcastSent: () => setNewProductIdsForNotification([])
        };

        switch(page) {
            case 'admin':
                return currentUser?.role === UserRole.ADMIN ? <AdminPage {...adminPageProps} /> : <HomePage {...homePageProps} />;
            case 'profile':
                return currentUser ? <ProfilePage user={currentUser} products={products.filter(p => p.seller.id === currentUser.id)} orders={orders} onEditProduct={handleOpenEditModal} onDeleteProduct={handleDeleteProduct} /> : <HomePage {...homePageProps} />;
            case 'about':
                return <AboutPage />;
            case 'home':
            default:
                return <HomePage {...homePageProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-white text-gray-900 font-sans">
            <Header user={currentUser} onLoginClick={() => setLoginModalOpen(true)} onLogout={handleLogout} onAddProductClick={handleOpenAddModal} onNavigate={handleNavigate} page={page} hasPendingVerification={hasPendingVerification} hasNewProducts={hasNewProducts} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {renderPage()}
            </main>
            <footer className="text-center py-6 mt-8 border-t border-brand-pink text-gray-500">
                <p>&copy; {new Date().getFullYear()} WANITA TANGGUH. Diberdayakan oleh komunitas.</p>
            </footer>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onMemberRegister={handleMemberRegister} onMemberLogin={handleMemberLogin} onAdminLogin={handleAdminLogin} adminWhatsappNumber={adminWhatsapp} />
            {currentUser && ( <ProductModal isOpen={isProductModalOpen} onClose={handleCloseProductModal} onSave={handleSaveProduct} productToEdit={editingProduct} village={currentUser.village} /> )}
            <EditMemberModal 
                isOpen={isEditMemberModalOpen}
                onClose={handleCloseEditMemberModal}
                onSave={handleUpdateMember}
                member={editingMember}
            />
            {notification && ( <NotificationToast message={notification} onClose={() => setNotification(null)} /> )}
            {selectedProductForDetail && (
                <ProductDetailModal 
                    product={selectedProductForDetail}
                    onClose={handleCloseDetailModal}
                    onCreateOrder={handleCreateOrder}
                    currentUser={currentUser}
                />
            )}
            <Chatbot />
        </div>
    );
}

export default App;