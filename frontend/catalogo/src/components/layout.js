import React from "react";
import header from "./header";
import footer from "./footer";
const Layout = ({ children }) => {
    return (
        <div>
            <header /> 
            <main style={{ minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
                {children}
            </main>
            <footer />
        </div>
    );
}
export default Layout;