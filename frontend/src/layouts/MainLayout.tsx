import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 w-full">
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;