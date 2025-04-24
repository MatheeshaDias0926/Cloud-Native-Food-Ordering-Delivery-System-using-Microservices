import React from "react";
import { useAuth } from "../../context/AuthContext";

const DeliveryDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
          <p className="text-gray-600">No active deliveries</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>
          <p className="text-gray-600">View your delivery history</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delivery Settings</h2>
          <p className="text-gray-600">Update your delivery preferences</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
