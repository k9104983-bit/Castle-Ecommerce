import React from "react";

function OrderCard({ order, onCancelOrder }) {

  const handleCancel = () => {
    if (!order?.id) {
      alert("Order ID not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    if (typeof onCancelOrder !== "function") {
      console.error("onCancelOrder function is missing.");
      alert("Unable to cancel order. Please try again.");
      return;
    }

    onCancelOrder(order.id);
  };

  const status = order?.status || "PLACED";

  return (
    <div className="order-card">

      <div className="order-card-header">
        <div>
          <h3>Order #{order.id}</h3>

          <p>
            Ordered on:{" "}
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <span className={`order-status ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="order-details">

        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>

        <p>
          <strong>Payment:</strong>{" "}
          {order.paymentMethod || "Cash on Delivery"}
        </p>

        <p>
          <strong>Delivery Address:</strong>{" "}
          {order.houseStreet}, {order.city}, {order.state} -{" "}
          {order.pincode}
        </p>

        {order.expectedDeliveryDate && (
          <p>
            <strong>Expected Delivery:</strong>{" "}
            {new Date(
              order.expectedDeliveryDate
            ).toLocaleDateString()}
          </p>
        )}

      </div>

      {order.items && order.items.length > 0 && (
        <div className="order-items">

          <h4>Items</h4>

          {order.items.map((item) => (
            <div
              className="order-item"
              key={item.id}
            >

              <div>
                <strong>
                  {item.productName}
                </strong>

                <p>
                  Quantity: {item.quantity}
                </p>
              </div>

              <span>
                ₹{item.price}
              </span>

            </div>
          ))}

        </div>
      )}

      {status !== "CANCELLED" &&
        status !== "DELIVERED" && (
          <div className="order-actions">

            <button
              type="button"
              className="cancel-order-btn"
              onClick={handleCancel}
            >
              Cancel Order
            </button>

          </div>
        )}

      {status === "CANCELLED" && (
        <div className="cancelled-message">
          This order has been cancelled.
        </div>
      )}

    </div>
  );
}

export default OrderCard;