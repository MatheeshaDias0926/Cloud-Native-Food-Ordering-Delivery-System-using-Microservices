import React from "react";
import { useAuth } from "../../context/AuthContext";

const RestaurantDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Orders</h2>
          <p className="text-gray-600">No orders for today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          <p className="text-gray-600">Manage your menu items</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Restaurant Settings</h2>
          <p className="text-gray-600">Update your restaurant information</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
