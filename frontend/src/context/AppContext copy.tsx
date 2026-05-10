import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProperties } from "../assets/assets";

// Create a context interface
interface AppContextType {
    // navigate, user, setUser, showUserLogin, setShowUserLogin
    navigate: ReturnType< typeof useNavigate >;
    user: boolean;
    setUser: React.Dispatch< React.SetStateAction<boolean> >;
    showUserLogin: boolean;
    setShowUserLogin: React.Dispatch< React.SetStateAction<boolean> >
}

export const AppContext = createContext<AppContextType | null>(null)

export const AppContextProvider = ({children} : {children: ReactNode}) => {
    
    const navigate = useNavigate();
    const [user, setUser] = useState<boolean>(false);
    const [ showUserLogin, setShowUserLogin ] = useState<boolean>(false);
    const [ , setProperties ] = useState<any[]>([])

    // function to fetch properties from assets
    const fetchProperties = async () => {
        setProperties(dummyProperties)
    }

    useEffect( ()=> {
        fetchProperties()
    }, []  )

    const value = { navigate, user, setUser, showUserLogin, setShowUserLogin }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    const context = useContext(AppContext)

    if(!context){
            throw new Error("useAppContext must be used inside AppContextProvider");
    }
    return context
}
