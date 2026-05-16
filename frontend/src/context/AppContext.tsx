import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProperties } from "../store/slices/propertySlice";          // ✅ from slice
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";
import { toggleShortlistItem } from "../store/slices/shortlistSlice";
import { logout as reduxLogout, type UserProfile } from "../store/slices/userSlice";
import { logoutApi } from "../api/authApi";
import type { AdminProfile } from "../store/slices/adminSlice";

// ─── Context Interface ────────────────────────────────────

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
  currency: string;
  wishlisted: string[];
  shortlisted: string[];
  toggleWishlist: (id: string) => void;
  toggleShortlist: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────

export const AppContextProvider = ({ children }: { children: ReactNode }) => {

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || '₹';

  const [showUserLogin, setShowUserLogin]           = useState(false);
  const [showRegister, setShowRegister]             = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const dispatch    = useAppDispatch();
  const user        = useAppSelector(state => state.user.isLoggedIn);
  const userProfile = useAppSelector(state => state.user.profile);
  const wishlisted  = useAppSelector(state => state.wishlist?.ids ?? []); 
  const shortlisted = useAppSelector(state => state.shortlist?.ids ?? []);

  // Fetch properties once on app load
  useEffect(() => {
    dispatch(fetchProperties());
  }, []);

  // Fetch wishlist whenever user logs in
  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user]);

  const toggleWishlist = (id: string) => {
    wishlisted.includes(id)
      ? dispatch(removeFromWishlist(id))
      : dispatch(addToWishlist(id));
  };

  const toggleShortlist = (id: string) => {
    dispatch(toggleShortlistItem(id));
  };

  const logout = async () => {
    try { await logoutApi(); } catch { /* ignore */ }
    dispatch(reduxLogout());
    navigate('/');
  };

  const value = {
    navigate, user, userProfile, logout,
    showUserLogin, setShowUserLogin,
    showRegister, setShowRegister,
    showForgotPassword, setShowForgotPassword,
    currency,
    wishlisted, shortlisted,
    toggleWishlist, toggleShortlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppContextProvider");
  return context;
};