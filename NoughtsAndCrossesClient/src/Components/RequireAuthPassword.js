import {useLocation, Navigate, Outlet} from "react-router-dom"
import useAuth from "../hooks/useAuth";

const RequireAuthPassword = () =>{
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.email
            ? <Outlet />
            : <Navigate to = "/" state={{ from: location }} replace/>
    );
}

export default RequireAuthPassword;