import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

interface Order {
    orderId: any;
    user: string;
    total: number;
    time: string;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {

        // Fetch existing orders from backend
        fetch("http://localhost:5000/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data));

        // Listen for real-time order notifications
        socket.on("order-status-updated", (data) => {

            setOrders((prev) =>
                prev.map(order =>
                    order.orderId === data.orderId
                        ? { ...order, status: data.status }
                        : order
                )
            );

        });

        return () => {
            socket.off("order-status-updated");
        };

    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order, index) => (
                    <div
                        key={index}
                        className="border p-4 mb-4 rounded"
                    >
                        <p><strong>User:</strong> {order.user}</p>
                        <p><strong>Total:</strong> ${order.total}</p>
                        <p><strong>Time:</strong> {order.time}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;