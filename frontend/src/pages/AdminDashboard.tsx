import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

interface Product {
    id?: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
}

const AdminDashboard = () => {


    const [orderCount, setOrderCount] = useState(0);

    const [orders, setOrders] = useState<any[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState<Product>({
        title: "",
        price: 0,
        thumbnail: "",
        category: ""
    });

    const API = "http://localhost:4000/products";

    // fetch products
    const fetchProducts = async () => {
        const res = await fetch(API);
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "price" ? Number(value) : value
        });
    };

    // add product
    const addProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const res = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error("Failed to add product");
            }

            const newProduct = await res.json();

            setProducts((prev) => [...prev, newProduct]);

            setFormData({
                title: "",
                price: 0,
                thumbnail: "",
                category: ""
            });

        } catch (error) {
            console.error(error);
        }
    };

    // delete product
    const deleteProduct = async (id: number | undefined) => {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        fetchProducts();
    };


    useEffect(() => {

        fetch("http://localhost:5000/orders")
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setOrderCount(data.length);
            });

        socket.on("order-notification", (data) => {

            setOrders((prev) => [data, ...prev]);
            setOrderCount((prev) => prev + 1);

            toast.success(`New order from ${data.user} - ₹${data.total}`);

        });

        return () => {
            socket.off("order-notification");
        };

    }, []);



    return (
        <div className="p-10">

            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                Admin Dashboard

                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {orderCount}
                </span>
            </h1>
            <div style={{ padding: "20px" }}>
                <h2>Admin Live Orders</h2>

                {orders.length === 0 && <p>No orders yet</p>}

                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="border p-4 mb-4 rounded"
                    >
                        <p><strong>User:</strong> {order.user}</p>
                        <p><strong>Total:</strong> ₹{order.total}</p>
                        <p><strong>Time:</strong> {order.time}</p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span className="text-blue-600">
                                {order.status || "Preparing"}
                            </span>
                        </p>

                        <div className="mt-2 flex gap-2">

                            <button
                                onClick={() =>
                                    socket.emit("update-order-status", {
                                        orderId: index,
                                        status: "Shipped"
                                    })
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                                Mark Shipped
                            </button>

                            <button
                                onClick={() =>
                                    socket.emit("update-order-status", {
                                        orderId: index,
                                        status: "Delivered"
                                    })
                                }
                                className="bg-purple-500 text-white px-3 py-1 rounded"
                            >
                                Mark Delivered
                            </button>

                        </div>
                    </div>
                ))}

            </div>

            {/* Add Product Form */}

            <form
                onSubmit={addProduct}
                className="bg-white p-6 rounded shadow-md mb-10"
            >
                <h2 className="text-xl font-semibold mb-4">Add Product</h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    type="text"
                    name="thumbnail"
                    placeholder="Image URL"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3"
                    required
                />

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Product
                </button>
            </form>

            {/* Product List */}

            <h2 className="text-2xl font-semibold mb-4">Product List</h2>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3">Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border text-center">
                            <td className="p-3">
                                <img
                                    src={product.thumbnail}
                                    className="w-16 mx-auto"
                                />
                            </td>

                            <td>{product.title}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>

                            <td>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;