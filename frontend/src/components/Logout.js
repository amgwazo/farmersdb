import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        // Use navigate to redirect after logout
        navigate("/home");
    }, [logout, navigate]);

    return null; // Logout component doesn't render anything
}

export default Logout;


