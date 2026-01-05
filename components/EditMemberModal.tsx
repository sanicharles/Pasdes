
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: { name: string, village: string }, userId: string) => void;
    member: User | null;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, onSave, member }) => {
    const [name, setName] = useState('');
    const [village, setVillage] = useState('');

    useEffect(() => {
        if (member) {
            setName(member.name);
            setVillage(member.village);
        } else {
            setName('');
            setVillage('');
        }
    }, [member]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (member && name && village) {
            onSave({ name, village }, member.id);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-brand-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Edit Data Anggota</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-900">Nama Lengkap</label>
                        <input type="text" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                    </div>
                    <div>
                        <label htmlFor="edit-village" className="block text-sm font-medium text-gray-900">Nama Desa</label>
                        <input type="text" id="edit-village" value={village} onChange={(e) => setVillage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-pink rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-green transition-colors">
                            Batal
                        </button>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors">
                           Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMemberModal;
