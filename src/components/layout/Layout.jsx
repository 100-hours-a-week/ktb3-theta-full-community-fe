import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ToastContainer from "../common/ToastContainer";
import UserInitializer from "../common/UserInitializer";

function Layout() {
  return (
    <>
      <UserInitializer />
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
}

export default Layout;
