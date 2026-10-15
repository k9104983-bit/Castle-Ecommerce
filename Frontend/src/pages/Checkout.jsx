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

      

      <section className="page-header">
        <span>✦ CASTLE CHECKOUT ✦</span>

        <h1>Checkout</h1>

        <p>
          Enter your delivery details and review your order.
        </p>
      </section>


      <div className="checkout-layout">



        <div className="checkout-items">

         

          <h2>Delivery Address</h2>

          <div className="address-form">

           

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


            

            const productName =
              item.name ||
              item.productName ||
              product?.name ||
              "Product";


          

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


       

        <div className="checkout-summary">

          <span>
            PAYMENT
          </span>


          <h2>
            Order Summary
          </h2>


         

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


        
          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              FREE
            </span>

          </div>


        

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




          <div className="delivery-note">

            Your order will be delivered within

            <strong>
              {" "}5–6 days.
            </strong>

          </div>


         

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


         

          <button
            className="checkout-btn"
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Placing Order..."
              : "Confirm Order"}

          </button>


        

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
