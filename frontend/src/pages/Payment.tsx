import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";

const Payment = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { customer, cartItems, totalPrice } = location.state;

    const handlePayment = async () => {

        // simulate payment success

        const orderData = {
            orderId: Date.now(),
            customer,
            items: cartItems,
            totalAmount: totalPrice,
            paymentMethod: "ONLINE",
            orderDate: new Date().toISOString(),
            status: "Paid"
        };

        await fetch("http://localhost:5000/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        dispatch(clearCart());

        alert("Payment Successful 🎉");

        navigate("/order-success");
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Payment</h1>

            <p className="mb-4">Total Amount: ${totalPrice}</p>

            <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-3 rounded"
            >
                Pay Now
            </button>
        </div>
    );
};

export default Payment;