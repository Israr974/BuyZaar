import React, { useEffect } from 'react'
import ShowMenu from '../components/ShowMenu'
import { useSelector } from 'react-redux';
import { X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const MobileUser = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-card flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                <h2 className="text-lg font-display font-bold gradient-text">Menu</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-bg-alt transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
                <ShowMenu user={user} isMobile={true} />
            </div>
        </div>
    );
};

export default MobileUser;