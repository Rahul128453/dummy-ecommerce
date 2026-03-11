import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";

interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
    rating: number;
    stock: number;
    discountPercentage: number;
}

interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const limit = 8; // products per page
    const pagesToShow = 4;
    const totalPages = Math.ceil(totalProducts / limit);
    const currentGroup = Math.floor((currentPage - 1) / pagesToShow);
    const startPage = currentGroup * pagesToShow + 1;
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);
    const fetchProducts = async (page: number) => {
        try {
            setLoading(true);
            const skip = (page - 1) * limit;
            const response = await axiosInstance.get<ProductsResponse>(
                `/products?limit=${limit}&skip=${skip}`
            );
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    //  filter
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [category, setCategory] = useState("all");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2000);
    const [sortOrder, setSortOrder] = useState("default");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const filteredProducts = products
        .filter((product) =>
            product.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .filter((product) =>
            category === "all" ? true : product.category === category
        )
        .filter(
            (product) =>
                product.price >= minPrice && product.price <= maxPrice
        );

    const sortedProducts = [...filteredProducts];

    if (sortOrder === "low-high") {
        sortedProducts.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high-low") {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-black">Products</h1>
            <div className="flex gap-5">
                <div className="flex flex-col w-2/5">
                    <label>Search by Name</label>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded w-full mb-5"
                    />
                </div>

                <div className="flex flex-col w-1/5">
                    <label>Search by Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border px-4 py-2 rounded mb-4"
                    >
                        <option value="all">All</option>
                        <option value="beauty">Beauty</option>
                        <option value="smartphones">Smartphones</option>
                        <option value="laptops">Laptops</option>
                        <option value="fragrances">Fragrances</option>
                        <option value="skincare">Skincare</option>
                    </select>
                </div>
                <div className="flex flex-col w-1/5">
                    <label>Search by Price</label>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="border px-3 py-2 rounded w-1/2"
                        />

                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="border px-3 py-2 rounded w-1/2"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-1/5">
                    <label>Search by Low to High</label>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border px-4 py-2 rounded mb-4"
                    >
                        <option value="default">Default</option>
                        <option value="low-high">Price: Low to High</option>
                        <option value="high-low">Price: High to Low</option>
                    </select>
                </div>
            </div>
            {loading && <p>Loading...</p>}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {sortedProducts.length === 0 ? (

                    <p className="text-center text-gray-500 mt-10">
                        No products found 😢
                    </p>) : (

                    sortedProducts.map((product) => (
                        <Link key={product.id} to={`/product/${product.id}`}>
                            <div className="bg-white shadow-md rounded-lg p-4">
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-40 w-full object-cover mb-4 rounded"
                                />
                                <h2 className="text-lg text-black font-semibold">
                                    {product.title}
                                </h2>

                                <div className="flex justify-between">
                                    <h3>{product.category}</h3>
                                    <h4
                                        className={`px-2 py-1 rounded text-xs text-white ${product.stock > 0 ? "bg-green-500" : "bg-red-500"
                                            }`}
                                    >
                                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </h4>
                                </div>

                                <div className="flex justify-between">
                                    <h5>rating: {product.rating}</h5>
                                    <h6>stock: {product.stock}</h6>
                                </div>

                                <p className="text-blue-600 font-bold">
                                    ${product.price}
                                    <span className="text-xs text-green-600">
                                        {product.discountPercentage}% off
                                    </span>
                                </p>
                                <div className="flex items-center gap-2 mt-4">
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                addToWishlist({
                                                    id: product.id,
                                                    title: product.title,
                                                    price: product.price,
                                                    thumbnail: product.thumbnail
                                                })
                                            )
                                        }
                                        className="bg-pink-500 text-white px-1 py-2 rounded w-1/2"
                                    >
                                        ❤️ Add to Wishlist
                                    </button>
                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => dispatch(addToCart({
                                            id: product.id,
                                            title: product.title,
                                            price: product.price,
                                            thumbnail: product.thumbnail,
                                            quantity: 1,
                                        }

                                        ))

                                        }

                                        className="px-1 w-1/2 flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800"
                                    >
                                        <FaShoppingCart />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            <div className="flex justify-center items-center mt-8 gap-2">

                {/* Previous Group Button */}
                <button
                    disabled={startPage === 1}
                    onClick={() => setCurrentPage(startPage - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-40"
                >
                    Prev
                </button>

                {/* Page Numbers */}
                {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, index) => {
                        const pageNumber = startPage + index;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`px-3 py-1 border rounded ${currentPage === pageNumber
                                    ? "bg-black text-white"
                                    : "bg-white"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    }
                )}

                {/* Next Group Button */}
                <button
                    disabled={endPage === totalPages}
                    onClick={() => setCurrentPage(endPage + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-40"
                >
                    Next
                </button>

            </div>
        </div>
    );
};

export default Home;