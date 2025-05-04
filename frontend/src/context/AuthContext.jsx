import { createContext, useEffect, useState } from 'react';
import { getMe } from "../services/userService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken){
                setLoading(false);
                return;
            }

            try{
                const me = await getMe();
                setToken(storedToken);
                setUser(me);
                setIsAuthenticated(true);
            }catch(err){
                console.error("Auth error:", err.message);
                logout();
            }finally{
                setLoading(false);
            }
        };
        initAuth();
    }, []);
        
 
      
      

    const login = (newToken, userInfo) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setToken(newToken);
        setUser(userInfo);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }

    const refreshUser = async () => {
        try{
            const me = await getMe();
            setUser(me);
        }catch(err){
            console.error("Erreur chargement user", err);
            logout();
        }
    }

    useEffect(() => {
        if(token) refreshUser();
    }, [token]);

    return(
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}