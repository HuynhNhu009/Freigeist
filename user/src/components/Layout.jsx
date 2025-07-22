import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen ">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
