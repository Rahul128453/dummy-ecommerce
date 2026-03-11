import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { socket } from "../socket/socket";

type FormValues = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
};

const Checkout = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = () => {

        socket.emit("new-order", {
            user: "Rahul",
            total: totalPrice,
            time: new Date().toLocaleTimeString()
        });

    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {

        if (cartItems.length === 0) {
            alert("Cart is empty!");
            return;
        }

        if (data.paymentMethod === "UPI" || data.paymentMethod === "CARD") {
            navigate("/payment", {
                state: {
                    customer: data,
                    cartItems,
                    totalPrice
                }
            });
            return;
        }

        // COD order directly placed

        const orderData = {
            orderId: Date.now(),
            customer: data,
            items: cartItems,
            totalAmount: totalPrice,
            paymentMethod: data.paymentMethod,
            orderDate: new Date().toISOString(),
            status: "Pending"
        };

        await fetch("http://localhost:5000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        dispatch(clearCart());
        navigate("/order-success");
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
    }, []);


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* Cart Summary */}
            <div className="mb-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                        <span>{item.title} (x{item.quantity})</span>
                        <span>${item.price * item.quantity}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between font-bold mb-6">
                <span>Total:</span>
                <span>${totalPrice}</span>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <input
                    placeholder="Full Name"
                    {...register("fullName", { required: "Full Name is required" })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.fullName?.message}</p>

                <input
                    placeholder="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Invalid email format"
                        }
                    })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.email?.message}</p>

                <input
                    placeholder="Phone"
                    {...register("phone", {
                        required: "Phone is required",
                        minLength: {
                            value: 10,
                            message: "Phone must be 10 digits"
                        }
                    })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.phone?.message}</p>

                <input
                    placeholder="Address"
                    {...register("address", { required: "Address required" })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.address?.message}</p>

                <input
                    placeholder="City"
                    {...register("city", { required: "City required" })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.city?.message}</p>

                <input
                    placeholder="State"
                    {...register("state", { required: "State required" })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.state?.message}</p>

                <input
                    placeholder="Pincode"
                    {...register("pincode", {
                        required: "Pincode required",
                        minLength: {
                            value: 6,
                            message: "Pincode must be 6 digits"
                        }
                    })}
                    className="w-full border px-4 py-2 rounded"
                />
                <p className="text-red-500">{errors.pincode?.message}</p>

                <select
                    {...register("paymentMethod", {
                        required: "Select payment method"
                    })}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value="">Select Payment</option>
                    <option value="COD">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                </select>
                <p className="text-red-500">{errors.paymentMethod?.message}</p>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded" onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default Checkout;