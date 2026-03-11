import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const Wishlist = () => {
    const dispatch = useDispatch();

    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );

    if (wishlistItems.length === 0) {
        return <h2 className="p-10 text-xl">Your wishlist is empty ❤️</h2>;
    }

    const moveToCart = (item: any) => {
        dispatch(addToCart(item));
        dispatch(removeFromWishlist(item.id));
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

            {wishlistItems.map((item: { id: Key | null | undefined; thumbnail: string | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
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

                    <div className="flex gap-4">
                        <button
                            onClick={() => moveToCart(item)}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Move to Cart
                        </button>

                        <button
                            onClick={() => dispatch(removeFromWishlist(item.id as number))}
                            className="text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Wishlist;