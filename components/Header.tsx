
import React from 'react';
import { User, UserRole } from '../types';
import { UserIcon, AdminIcon, HomeIcon, LogoutIcon, TagIcon, InfoIcon } from '../icons';
import { Logo } from '../Logo';

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    onAddProductClick: () => void;
    onNavigate: (page: 'home' | 'admin' | 'profile' | 'about') => void;
    page: 'home' | 'admin' | 'profile' | 'about';
    hasPendingVerification: boolean;
    hasNewProducts: boolean;
}

const NavButton = ({ icon, text, onClick, isActive }: { icon: React.ReactNode; text: string, onClick: () => void, isActive?: boolean }) => (
    <button
        onClick={onClick}
        className={`flex flex-col md:flex-row items-center space-x-0 md:space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
            ? 'bg-brand-gold text-white'
            : 'text-brand-white hover:bg-brand-dark/30'
        }`}
    >
        {icon}
        <span className="text-xs md:text-sm">{text}</span>
    </button>
);


const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogout, onAddProductClick, onNavigate, page, hasPendingVerification, hasNewProducts }) => {
    return (
        <header className="bg-brand-green/90 backdrop-blur-sm shadow-lg sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div 
                    onClick={() => onNavigate('home')} 
                    className="cursor-pointer"
                >
                    <Logo />
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                    <NavButton icon={<HomeIcon className="w-5 h-5"/>} text="Beranda" onClick={() => onNavigate('home')} isActive={page === 'home'} />
                    <NavButton icon={<InfoIcon className="w-5 h-5"/>} text="Tentang" onClick={() => onNavigate('about')} isActive={page === 'about'} />

                    {user ? (
                        <>
                            {user.role === UserRole.MEMBER && user.isVerified && (
                                <NavButton icon={<TagIcon className="w-5 h-5"/>} text="Jual" onClick={onAddProductClick} />
                            )}
                            <NavButton icon={<UserIcon className="w-5 h-5"/>} text="Profil" onClick={() => onNavigate('profile')} isActive={page === 'profile'} />
                            {user.role === UserRole.ADMIN && (
                                <div className="relative">
                                    <NavButton icon={<AdminIcon className="w-5 h-5"/>} text="Admin" onClick={() => onNavigate('admin')} isActive={page === 'admin'} />
                                    {(hasPendingVerification || hasNewProducts) && (
                                        <span className="absolute top-1 right-2 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </div>
                            )}
                            <NavButton icon={<LogoutIcon className="w-5 h-5"/>} text="Keluar" onClick={onLogout} />
                        </>
                    ) : (
                        <button 
                            onClick={onLoginClick} 
                            className="bg-brand-gold text-white font-semibold px-4 py-2 rounded-full shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                        >
                            Masuk
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;