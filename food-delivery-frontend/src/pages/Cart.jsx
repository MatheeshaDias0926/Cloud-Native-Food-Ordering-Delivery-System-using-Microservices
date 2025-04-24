import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const cartItems = cart?.cartItems || [];
  const removeFromCart = cart?.removeFromCart;
  const updateQuantity = cart?.updateQuantity;
  const getCartTotal = cart?.getCartTotal;
  const clearCart = cart?.clearCart;

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    navigate("/checkout");
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/restaurants")}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item._id} className="p-6 flex items-center">
                <img
                  src={item.image || "https://via.placeholder.com/100x100"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.restaurantName}
                  </p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity?.(
                          item._id,
                          Math.max(0, item.quantity - 1)
                        )
                      }
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="mx-4 text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity?.(item._id, item.quantity + 1)
                      }
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="ml-6">
                  <p className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart?.(item._id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <button
                  onClick={() => clearCart?.()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  Total: ${getCartTotal?.()?.toFixed(2) || "0.00"}
                </p>
                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
