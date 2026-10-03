function Cart({
  cart,
  cartTotal,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onPlaceOrder,
  loading
}) {
  return (
    <div className="cart-page">

      <section className="page-header">

        <span>✦ YOUR COLLECTION ✦</span>

        <h1>Shopping Cart</h1>

        <p>
        </p>

      </section>

      {cart.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-star">
            ✦
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Add something beautiful to your collection.
          </p>

        </div>

      ) : (

        <div className="cart-layout">

          {/* LEFT SIDE */}

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                <div className="cart-item-image">
                  ✦
                </div>

                <div className="cart-item-details">

                  <span>PRODUCT</span>

                  <h3>
                    {item.productName}
                  </h3>

                  <p>
                    ₹
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <div className="quantity-control">

                  <button
                    onClick={() => onDecrease(item)}
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => onIncrease(item)}
                  >
                    +
                  </button>

                </div>

                <div className="cart-item-total">

                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}

                </div>

                <button
                  className="remove-item"
                  onClick={() => onRemove(item.id)}
                >
                  ×
                </button>

              </div>

            ))}

            <button
              className="clear-cart-btn"
              onClick={onClear}
            >
              Clear Cart
            </button>

          </div>

          {/* RIGHT SIDE */}

          <div className="cart-summary">

            <span>ORDER SUMMARY</span>

            <h2>Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>
                {cart.reduce(
                  (total, item) =>
                    total + Number(item.quantity),
                  0
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹
                {cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>FREE</span>
            </div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹
                {cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="delivery-note">
              ✦ Expected delivery within 5–6 days
            </div>

            <button
              className="checkout-btn"
              onClick={onPlaceOrder}
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;