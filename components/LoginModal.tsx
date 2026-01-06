import React, { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMemberRegister: (name: string, whatsapp: string, village: string, password: string) => void;
    onMemberLogin: (whatsapp: string, password: string) => void;
    onAdminLogin: (whatsapp: string, password: string) => void;
    adminWhatsappNumber: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onMemberRegister, onMemberLogin, onAdminLogin, adminWhatsappNumber }) => {
    const [activeTab, setActiveTab] = useState<'member' | 'admin'>('member');
    const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
    
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [village, setVillage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [adminWhatsapp, setAdminWhatsapp] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'member') {
            if (authMode === 'register') {
                if (password !== confirmPassword) {
                    alert('Password dan konfirmasi password tidak cocok.');
                    return;
                }
                if (name && whatsapp && village && password) {
                    onMemberRegister(name, whatsapp, village, password);
                }
            } else if (authMode === 'login' && whatsapp && password) {
                onMemberLogin(whatsapp, password);
            }
        } else if (activeTab === 'admin' && adminWhatsapp && adminPassword) {
            onAdminLogin(adminWhatsapp, adminPassword);
        }
    };
    
    const resetForms = () => {
        setName('');
        setWhatsapp('');
        setVillage('');
        setPassword('');
        setConfirmPassword('');
        setAdminWhatsapp('');
        setAdminPassword('');
    };
    
    const handleTabChange = (tab: 'member' | 'admin') => {
        setActiveTab(tab);
        resetForms();
    };

    if (!isOpen) return null;
    
    const TabButton = ({ tab, children }: {tab: 'member' | 'admin', children: React.ReactNode}) => (
        <button
            type="button"
            onClick={() => handleTabChange(tab)}
            className={`w-1/2 py-2.5 text-sm font-medium leading-5 text-center transition-colors duration-300 border-b-2 ${
                activeTab === tab 
                ? 'border-brand-gold text-brand-gold' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-brand-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* FIX: Added required 'children' prop to TabButton components to display tab labels. */}
                <div className="flex border-b border-gray-200 mb-6">
                    <TabButton tab="member">Anggota</TabButton>
                    <TabButton tab="admin">Admin</TabButton>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'member' && (
                        <>
                            <div className="flex justify-center bg-brand-pink/60 rounded-lg p-1">
                                <button type="button" onClick={() => setAuthMode('register')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${authMode === 'register' ? 'bg-brand-gold text-white shadow' : 'text-gray-900'}`}>Daftar</button>
                                <button type="button" onClick={() => setAuthMode('login')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${authMode === 'login' ? 'bg-brand-gold text-white shadow' : 'text-gray-900'}`}>Masuk</button>
                            </div>
                            
                            {authMode === 'register' ? (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 font-serif text-center pt-2">Buat Akun Baru</h2>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-900">Nama Lengkap</label>
                                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                    </div>
                                    <div>
                                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-900">Nomor WhatsApp</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-brand-pink bg-gray-50 text-gray-500 text-sm">+62</span>
                                            <input type="tel" id="whatsapp" placeholder="8123456789" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-r-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="village" className="block text-sm font-medium text-gray-900">Nama Desa</label>
                                        <input type="text" id="village" value={village} onChange={(e) => setVillage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                    </div>
                                     <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">Konfirmasi Password</label>
                                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 font-serif text-center pt-2">Masuk Anggota</h2>
                                    <div>
                                        <label htmlFor="loginWhatsapp" className="block text-sm font-medium text-gray-900">Nomor WhatsApp</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-brand-pink bg-gray-50 text-gray-500 text-sm">+62</span>
                                            <input type="tel" id="loginWhatsapp" placeholder="8123456789" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-r-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-900">Password</label>
                                        <input type="password" id="loginPassword" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'admin' && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 font-serif text-center pt-2">Masuk Admin</h2>
                            <p className="text-sm text-center text-gray-500 mb-2">Halaman ini khusus untuk admin yang telah terdaftar di sistem.</p>
                            <div>
                                <label htmlFor="adminWhatsapp" className="block text-sm font-medium text-gray-900">Nomor WhatsApp Admin</label>
                                 <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-brand-pink bg-gray-50 text-gray-500 text-sm">+62</span>
                                    <input type="tel" id="adminWhatsapp" placeholder="81234567890" value={adminWhatsapp} onChange={(e) => setAdminWhatsapp(e.target.value.replace(/\D/g, ''))} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-r-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-900">Password</label>
                                <input type="password" id="adminPassword" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                            </div>
                        </>
                    )}
                    
                    <div className="flex space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-green transition-colors">
                            Batal
                        </button>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors">
                           {activeTab === 'member' && authMode === 'register' ? 'Daftar' : 'Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;