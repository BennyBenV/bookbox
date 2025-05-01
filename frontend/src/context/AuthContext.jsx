import { createContext, useEffect, useState } from 'react';
import { getMe } from "../services/userService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user")

        try{
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }catch(err){
            console.error("User data invalid: ", err);
            localStorage.removeItem("user");
        }
        
        setLoading(false); // <- une fois le check terminé
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