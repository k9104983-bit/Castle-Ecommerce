import { useState } from "react";

function Checkout({
  cart,
  cartTotal,
  products,
  onPlaceOrder,
  onBack,
  loading
}) {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    houseStreet: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!address.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(address.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!address.houseStreet.trim()) {
      alert("Please enter your house/street address.");
      return;
    }

    if (!address.city.trim()) {
      alert("Please enter your city.");
      return;
    }

    if (!address.state.trim()) {
      alert("Please enter your state.");
      return;
    }

    if (!/^[0-9]{6}$/.test(address.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    onPlaceOrder(address);
  };

  return (
    <div className="checkout-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="page-header">
        <span>✦ CASTLE CHECKOUT ✦</span>

        <h1>Checkout</h1>

        <p>
          Enter your delivery details and review your order.
        </p>
      </section>


      <div className="checkout-layout">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="checkout-items">

          {/* DELIVERY ADDRESS */}

          <h2>Delivery Address</h2>

          <div className="address-form">

            {/* FULL NAME */}

            <div className="checkout-field">

              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={address.fullName}
                onChange={handleChange}
              />

            </div>


            {/* PHONE */}

            <div className="checkout-field">

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={address.phone}
                maxLength="10"
                onChange={handleChange}
              />

            </div>


            {/* HOUSE / STREET */}

            <div className="checkout-field">

              <label>
                House / Street Address
              </label>

              <textarea
                name="houseStreet"
                placeholder="House number, street, area"
                value={address.houseStreet}
                onChange={handleChange}
                rows="3"
              />

            </div>


            {/* CITY */}

            <div className="checkout-field">

              <label>City</label>

              <input
                type="text"
                name="city"
                placeholder="Enter your city"
                value={address.city}
                onChange={handleChange}
              />

            </div>


            {/* STATE */}

            <div className="checkout-field">

              <label>State</label>

              <input
                type="text"
                name="state"
                placeholder="Enter your state"
                value={address.state}
                onChange={handleChange}
              />

            </div>


            {/* PINCODE */}

            <div className="checkout-field">

              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                placeholder="6-digit pincode"
                value={address.pincode}
                maxLength="6"
                onChange={handleChange}
              />

            </div>

          </div>


          {/* =================================================
              ORDER ITEMS
          ================================================= */}

          <h2 className="order-items-title">
            Your Order
          </h2>


          {cart.map((item) => {

            const productId =
              item.productId || item.id;


            const product =
              products?.find(
                (p) =>
                  Number(p.id) ===
                  Number(productId)
              );


            /*
             * Get the product name from cart first,
             * then backend product data.
             */

            const productName =
              item.name ||
              item.productName ||
              product?.name ||
              "Product";


            /*
             * Your Product entity currently
             * stores imageUrl.
             *
             * So this displays the stored URL.
             */

            const productUrl =
              product?.imageUrl ||
              product?.image ||
              "";


            return (

              <div
                className="checkout-item"
                key={
                  item.id ||
                  item.cartId ||
                  item.productId
                }
              >

                <div className="checkout-product-info">

                  <h3>
                    {productName}
                  </h3>


                  <p>
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString("en-IN")}

                    {" × "}

                    {item.quantity}
                  </p>


                  {/* PRODUCT URL */}

                  {productUrl && (

                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="checkout-product-url"
                    >
                      Product URL
                    </a>

                  )}

                </div>


                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            );
          })}

        </div>


        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="checkout-summary">

          <span>
            PAYMENT
          </span>


          <h2>
            Order Summary
          </h2>


          {/* ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <span>

              {cart.reduce(
                (total, item) =>
                  total +
                  Number(
                    item.quantity || 0
                  ),
                0
              )}

            </span>

          </div>


          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹
              {cartTotal.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>


          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              FREE
            </span>

          </div>


          {/* PAYMENT METHOD */}

          <div className="payment-method">

            <span>
              Payment Method
            </span>


            <div className="cod-option">

              <input
                type="radio"
                checked
                readOnly
              />

              <label>
                Cash on Delivery
              </label>

            </div>

          </div>


          {/* DELIVERY NOTE */}

          <div className="delivery-note">

            Your order will be delivered within

            <strong>
              {" "}5–6 days.
            </strong>

          </div>


          {/* TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {cartTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          {/* CONFIRM ORDER */}

          <button
            className="checkout-btn"
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Placing Order..."
              : "Confirm Order"}

          </button>


          {/* BACK */}

          <button
            className="back-cart-btn"
            onClick={onBack}
            disabled={loading}
          >
            Back to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;