import { Link } from "react-router-dom";

const OrderSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">

            <div className="bg-green-100 text-green-600 text-6xl p-6 rounded-full mb-6">
                ✔
            </div>

            <h1 className="text-3xl font-bold mb-4">
                Order Placed Successfully 🎉
            </h1>

            <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been received
                and is now being processed.
            </p>

            <Link
                to="/"
                className="bg-black text-white px-6 py-3 rounded"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderSuccess;