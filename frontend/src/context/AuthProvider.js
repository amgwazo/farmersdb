import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({});

     


    const logout = useCallback(() => {
        // Clear the auth variable
        setAuth({});
        // Redirect the user to the home component
        navigate("/login");
    })

     useEffect(() => {
       const checkTokenExpiration = () => {
        try{
             console.log(`token: ${auth?.token}`);
             const decodedToken = jwtDecode(auth?.token);
             const tokenExpiration = decodedToken.exp * 1000;
             console.log(`token expiration: ${new Date(tokenExpiration)}`);
             if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
               // Token has expired, perform logout
               logout();
             }

        }
        catch(error){

           console.log(`Auth Provider error: ${error}`);

        }
        
       };

       const tokenExpirationCheckInterval = setInterval(
         checkTokenExpiration,
         1000 * 60 * 60 
       ); // Check every hour
       return () => clearInterval(tokenExpirationCheckInterval);
     }, [auth?.token, logout]);


    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;