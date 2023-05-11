import App from "./Components/App";
import Dashboard from './Components/Dashboard';
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import UpdatePassword from "./Components/UpdatePassword";
import Login from './Components/Login';
import Layout from './Components/Layout';
import Missing from './Components/Missing';
import RequireAuth from './Components/RequireAuth';
import RequireAuthPassword from './Components/RequireAuthPassword';
import {Routes, Route} from 'react-router-dom'

function Router (){
    
    return (
        <Routes>
            <Route path = "/" element={<Layout />}>
                <Route path="/" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgotpassword" element={<ForgotPassword />} />

                {/* protected route */}
                <Route element = {<RequireAuth />}>
                    <Route path="app" element={<App />} />
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                
                <Route element = {<RequireAuthPassword />}>
                    <Route path="updatepassword" element={<UpdatePassword />} />
                </Route>

                {/* catch all 404 page */}
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    );
}

export default Router