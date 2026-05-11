import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleWishlistItem } from "../store/slices/wishlistSlice";
import { toggleShortlistItem } from "../store/slices/shortlistSlice";
import { logout as reduxLogout, type UserProfile } from "../store/slices/userSlice";
import { getPropertiesApi } from "../api/propertyApi";
import { logoutApi } from "../api/authApi";
import type { AdminProfile } from "../store/slices/adminSlice";

// Create a context interface
interface AppContextType {
    navigate: ReturnType<typeof useNavigate>;
    user: boolean;
    userProfile: UserProfile | null;
    admin: boolean;
    adminProfile: AdminProfile | null;
    logout: () => void;
    showUserLogin: boolean;
    setShowUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
    showRegister: boolean;
    setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
    showForgotPassword: boolean;
    setShowForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
    properties: any[];
    fetchProperties: () => Promise<void>;
    currency: string;
    wishlisted: string[];
    shortlisted: string[];
    toggleWishlist: (id: string) => void;
    toggleShortlist: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || '₹';
    const [showUserLogin, setShowUserLogin] = useState<boolean>(false);
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [properties, setProperties] = useState<any[]>([]);

    const dispatch = useAppDispatch();
    // Auth state derived from Redux
    const user = useAppSelector(state => state.user.isLoggedIn);
    const userProfile = useAppSelector(state => state.user.profile);

    // const admin = useAppSelector(state => state.admin.isAdminLoggedIn);
    // const adminProfile = useAppSelector(state => state.admin.profile)

    // Wishlist & shortlist are now managed in Redux (single source of truth).
    const wishlisted = useAppSelector(state => state.wishlist.ids);
    const shortlisted = useAppSelector(state => state.shortlist.ids);

    // fetch all properties from API
    const fetchProperties = async () => {
        try {
            const { data } = await getPropertiesApi();
            setProperties(data.properties);
        } catch {
            console.error('Failed to fetch properties');
        }
    }

    const logout = async () => {
        try { await logoutApi(); } catch { /* ignore */ }
        dispatch(reduxLogout());
        navigate('/');
    };

    const toggleWishlist = (id: string) => {
        dispatch(toggleWishlistItem(id));
    }

    const toggleShortlist = (id: string) => {
        dispatch(toggleShortlistItem(id));
    }

    useEffect(() => {
        fetchProperties();
    }, []);

    const value = {
        navigate, user, userProfile, logout,
        showUserLogin, setShowUserLogin,
        showRegister, setShowRegister,
        showForgotPassword, setShowForgotPassword,
        properties, fetchProperties, currency,
        wishlisted, shortlisted,
        toggleWishlist, toggleShortlist,
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("useAppContext must be used inside AppContextProvider");
    }
    return context
}
