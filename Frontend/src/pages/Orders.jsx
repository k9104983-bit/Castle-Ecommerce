import React from "react";
import OrderCard from "../components/OrderCard";

function Orders({
  orders = [],
  user,
  onCancelOrder
}) {

  return (
    <div className="orders-page">

      <div className="orders-container">

        <div className="orders-title-section">
          <h1>My Orders</h1>

          <p>
            Track and manage your Castle orders
          </p>
        </div>

        {!user ? (
          <div className="empty-orders">
            <h3>Please login to view your orders.</h3>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No orders found.</h3>

            <p>
              Your placed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancelOrder={onCancelOrder}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Orders;