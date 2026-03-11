import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
} from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛒</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-6 py-2 rounded"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            {cartItems.map(item => (
                <div
                    key={item.id}
                    className="flex items-center justify-between border p-4 mb-4 rounded"
                >
                    <div className="flex items-center gap-4">
                        <img src={item.thumbnail} className="w-20" />
                        <div>
                            <h2 className="font-semibold">{item.title}</h2>
                            <p>${item.price}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500"
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div className="text-right mt-6">
                <h2 className="text-2xl font-bold">
                    Total: ${totalPrice.toFixed(2)}
                </h2>
            </div>
            <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-6 py-2 rounded mt-4"
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Cart;