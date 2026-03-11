import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";



const Navbar: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalQuantity = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const [, setUser] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null); // 🔥 this triggers re-render
        navigate("/login");
    };

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );


    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                MyStore
            </Link>

            <div className="space-x-6 flex items-center">
                <NavLink to="/" className="hover:text-gray-300">
                    Home
                </NavLink>

                <NavLink to="/cart" className="hover:text-gray-300">
                    Cart ({totalQuantity})
                </NavLink>

                <NavLink to="/wishlist" className="relative">
                    ❤️ Wishlist
                    {wishlistItems.length > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {wishlistItems.length}
                        </span>
                    )}
                </NavLink>

                <NavLink to="/contact" className="hover:text-gray-300">
                    Contact
                </NavLink>

                <NavLink to="/login" className="hover:text-gray-300">
                    {user ? (
                        <div className="flex gap-4 items-center">
                            <span>Hi, {user.name}</span>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login")}>
                            Login
                        </button>
                    )}

                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;