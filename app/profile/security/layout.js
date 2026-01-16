const { default: ProtectedRoute } = require("@/components/ProtectedRoute");


const Layout = ({ children }) => {
    return (
        <ProtectedRoute>{children}</ProtectedRoute>
    );
}

export default Layout;