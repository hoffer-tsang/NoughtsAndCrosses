import {Outlet} from  "react-router-dom"

const Layout = () => {
    return (
        <main className="Login">
            <Outlet />
        </main>
    )
}

export default Layout