import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

interface Product {
    shippingInformation: string;
    returnPolicy: string;
    rating: number;
    brand: string;
    warrantyInformation: string;
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
}

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axiosInstance.get(`/products/${id}`);
            setProduct(response.data);
        };

        fetchProduct();
    }, [id]);

    const dispatch = useDispatch();

    if (!product) return <p>Loading...</p>;
    console.log(product)
    return (
        <div className="p-10 grid items-end md:grid-cols-2 gap-1">
            <img src={product.thumbnail} alt={product.title} />
            <h1 className="text-3xl font-bold mt-2">{product.title}</h1>
            <p className="mt-2 text-gray-600 text-green-400">{product.brand}</p>
            <p className="mt-2 text-gray-600">{product.description}</p>
            <p className="text-xl font-bold text-green-600 mt-2">
                ${product.price.toFixed(2)}
            </p>
            <p className="text-xs text-blue-800 p-1 mt-1">Return Policy: {product.returnPolicy}</p>
            <p className="text-xs text-black-800 p-1 mt-1">Shipping Information: {product.shippingInformation}</p>
            <p className="text-xs text-blue-800 p-1 mt-1">Rating: ⭐ {product.rating} / 5</p>
            <p className="font-semibold mt-2">{product.warrantyInformation}</p>
            <button
                onClick={() => {
                    dispatch(
                        addToCart({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            thumbnail: product.thumbnail,
                            quantity: 1,
                        })
                    );

                    toast.success("Product added to cart!");
                }}
                className="bg-black text-white px-6 py-2 mt-4 rounded"
            >
                Add To Cart
            </button>
        </div>
    );
};

export default ProductDetails;