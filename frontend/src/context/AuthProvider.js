import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";



const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({});

    const logout = () => {
        // Clear the auth variable
        setAuth({});
        // Redirect the user to the home component
        navigate("/home");
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;