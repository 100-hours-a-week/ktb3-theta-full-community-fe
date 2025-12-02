import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ToastContainer from "../common/ToastContainer";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
}

export default Layout;
