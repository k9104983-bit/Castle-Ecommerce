import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";

import {
  API_URL,
  AUTH_URL,
  CART_URL,
  ORDER_URL
} from "./services/api";


/* =========================================================
   APP
========================================================= */

function App() {

  /* =========================================================
     PAGE
  ========================================================= */

  const [page, setPage] = useState("home");


  /* =========================================================
     USER
  ========================================================= */

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("castleUser");

    if (!savedUser) {
      return null;
    }

    try {

      const parsedUser =
        JSON.parse(savedUser);

      return {
        ...parsedUser,

        email:
          parsedUser.email ||
          parsedUser.userEmail ||
          ""
      };

    } catch (error) {

      console.error(
        "Invalid saved user:",
        error
      );

      localStorage.removeItem("castleUser");

      return null;
    }
  });


  /* =========================================================
     OTP
  ========================================================= */

  const [verificationEmail, setVerificationEmail] =
    useState("");


  /* =========================================================
     DATA
  ========================================================= */

  const [products, setProducts] =
    useState([]);

  const [cart, setCart] =
    useState([]);

  const [orders, setOrders] =
    useState([]);


  /* =========================================================
     LOADING
  ========================================================= */

  const [loading, setLoading] =
    useState(false);


  /* =========================================================
     GET USER EMAIL
  ========================================================= */

  const getUserEmail = (currentUser = user) => {

    return (
      currentUser?.email ||
      currentUser?.userEmail ||
      ""
    );
  };


  /* =========================================================
     GET PRODUCT FOR CART ITEM
  ========================================================= */

  const getProductForCartItem = (cartItem) => {

    if (!cartItem) {
      return null;
    }

    const productId =
      cartItem.productId ||
      cartItem.id;

    return products.find(
      (product) =>
        Number(product.id) ===
        Number(productId)
    ) || null;
  };


  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async () => {

    try {

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        console.error(
          "Failed to fetch products"
        );

        setProducts([]);

        return;
      }

      const data =
        await response.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Error fetching products:",
        error
      );

      setProducts([]);
    }
  };


  /* =========================================================
     FETCH CART
  ========================================================= */

  const fetchCart = async () => {

    const userEmail =
      getUserEmail();

    if (!userEmail) {

      setCart([]);

      return;
    }

    try {

      const response =
        await fetch(
          `${CART_URL}/${encodeURIComponent(
            userEmail
          )}`
        );

      if (!response.ok) {

        setCart([]);

        return;
      }

      const data =
        await response.json();

      setCart(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Error fetching cart:",
        error
      );

      setCart([]);
    }
  };


  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = async () => {

    const userEmail =
      getUserEmail();

    if (!userEmail) {

      setOrders([]);

      return;
    }

    try {

      const response =
        await fetch(
          `${ORDER_URL}/user/${encodeURIComponent(
            userEmail
          )}`
        );

      if (!response.ok) {

        console.error(
          "Failed to fetch orders:",
          response.status
        );

        setOrders([]);

        return;
      }

      const data =
        await response.json();

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Error fetching orders:",
        error
      );

      setOrders([]);
    }
  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    fetchProducts();

  }, []);


  /* =========================================================
     USER DATA LOAD
  ========================================================= */

  useEffect(() => {

    const userEmail =
      getUserEmail();

    if (userEmail) {

      fetchCart();
      fetchOrders();

    } else {

      setCart([]);
      setOrders([]);
    }

  }, [user]);


  /* =========================================================
     REGISTER
  ========================================================= */

  const register = async (userData) => {

    try {

      setLoading(true);

      const response =
        await fetch(
          `${AUTH_URL}/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(userData)
          }
        );

      const responseText =
        await response.text();

      let data = {};

      try {

        data =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch {

        data = {
          message: responseText
        };
      }


      if (!response.ok || !data) {

        alert(
          data?.message ||
          "Registration failed"
        );

        return;
      }


      setVerificationEmail(
        userData.email
      );


      alert(
        "Registration successful. OTP sent to your email."
      );


      setPage("verifyOtp");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      alert(
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };


  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const verifyOtp = async (email, otp) => {

    try {

      setLoading(true);

      const response =
        await fetch(
          `${AUTH_URL}/verify-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                email: email,
                otp: otp
              })
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        data !== true
      ) {

        alert(
          "Invalid or expired OTP. Please enter the correct OTP."
        );

        return;
      }


      alert(
        "Email verified successfully. You can now login."
      );


      setPage("login");

    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );

      alert(
        "OTP verification failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  /* =========================================================
     RESEND OTP
  ========================================================= */

  const resendOtp = async (email) => {

    const emailToUse =
      email ||
      verificationEmail;

    if (!emailToUse) {

      alert(
        "Email not found."
      );

      return;
    }


    try {

      setLoading(true);

      const response =
        await fetch(
          `${AUTH_URL}/resend-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                email: emailToUse
              })
          }
        );


      const responseText =
        await response.text();

      let data = {};

      try {

        data =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch {

        data = {
          message: responseText
        };
      }


      if (!response.ok) {

        alert(
          data.message ||
          data.error ||
          responseText ||
          "Failed to resend OTP"
        );

        return;
      }


      alert(
        "New OTP sent to your email."
      );

    } catch (error) {

      console.error(
        "Resend OTP error:",
        error
      );

      alert(
        "Failed to resend OTP"
      );

    } finally {

      setLoading(false);
    }
  };


  /* =========================================================
     LOGIN
  ========================================================= */

  const login = async (loginData) => {

    try {

      setLoading(true);

      const response =
        await fetch(
          `${AUTH_URL}/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(loginData)
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        data.success === false
      ) {

        alert(
          data.message ||
          "Login failed"
        );

        return;
      }


      if (!data.user) {

        alert(
          "Login failed: user information was not received."
        );

        return;
      }


      const loggedInUser =
        data.user;


      const userData = {

        ...loggedInUser,

        email:
          loggedInUser.email ||
          loggedInUser.userEmail ||
          loginData.email ||
          ""
      };


      setUser(userData);


      localStorage.setItem(
        "castleUser",
        JSON.stringify(userData)
      );


      alert(
        "Login successful!"
      );


      setPage("home");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      alert(
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      "castleUser"
    );

    setCart([]);

    setOrders([]);

    setPage("home");
  };


  /* =========================================================
     ADD TO CART
     STOCK VALIDATION
  ========================================================= */

  const addToCart = async (product) => {

    const userEmail =
      getUserEmail();


    if (!userEmail) {

      alert(
        "Please login first."
      );

      setPage("login");

      return;
    }


    /* -------------------------------------------------------
       OUT OF STOCK CHECK
    ------------------------------------------------------- */

    const availableStock =
      Number(product?.quantity ?? 0);


    if (
      !Number.isFinite(availableStock) ||
      availableStock <= 0
    ) {

      alert(
        "This product is currently out of stock."
      );

      return;
    }


    /* -------------------------------------------------------
       CHECK EXISTING CART QUANTITY
    ------------------------------------------------------- */

    const existingCartItem =
      cart.find(
        (item) =>
          Number(
            item.productId
          ) ===
          Number(
            product.id
          )
      );


    const existingQuantity =
      Number(
        existingCartItem?.quantity || 0
      );


    if (
      existingQuantity >=
      availableStock
    ) {

      alert(
        `Only ${availableStock} item${
          availableStock === 1
            ? ""
            : "s"
        } available.`
      );

      return;
    }


    try {

      const response =
        await fetch(
          CART_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({

                userEmail:
                  userEmail,

                productId:
                  product.id,

                productName:
                  product.name,

                price:
                  product.price,

                quantity:
                  1
              })
          }
        );


      const responseText =
        await response.text();

      let data = {};

      try {

        data =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch {

        data = {
          message:
            responseText
        };
      }


      if (!response.ok) {

        alert(
          data.message ||
          data.error ||
          "Unable to add product"
        );

        return;
      }


      await fetchCart();


      alert(
        "Product added to cart."
      );

    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );

      alert(
        "Unable to add product to cart."
      );
    }
  };


  /* =========================================================
     REMOVE FROM CART
  ========================================================= */

  const removeFromCart = async (id) => {

    if (!id) {

      alert(
        "Cart item ID not found."
      );

      return;
    }


    try {

      const response =
        await fetch(
          `${CART_URL}/${id}`,
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        alert(
          "Unable to remove item."
        );

        return;
      }


      await fetchCart();

    } catch (error) {

      console.error(
        "Remove cart item error:",
        error
      );

      alert(
        "Unable to remove item."
      );
    }
  };


  /* =========================================================
     UPDATE CART QUANTITY
     STOCK VALIDATION
  ========================================================= */

  const updateCartQuantity =
    async (id, quantity) => {

      if (!id) {

        alert(
          "Cart item ID not found."
        );

        return;
      }


      if (quantity < 1) {

        return;
      }


      /* -------------------------------------------------------
         FIND CART ITEM
      ------------------------------------------------------- */

      const cartItem =
        cart.find(
          (item) =>
            Number(item.id) === Number(id) ||
            Number(item.cartId) === Number(id)
        );


      /* -------------------------------------------------------
         FIND PRODUCT
      ------------------------------------------------------- */

      const product =
        getProductForCartItem(
          cartItem
        );


      /* -------------------------------------------------------
         CHECK PRODUCT STOCK
      ------------------------------------------------------- */

      if (product) {

        const availableStock =
          Number(
            product.quantity ?? 0
          );


        if (availableStock <= 0) {

          alert(
            "This product is now out of stock."
          );

          await fetchCart();

          return;
        }


        if (
          Number(quantity) >
          availableStock
        ) {

          alert(
            `Only ${availableStock} item${
              availableStock === 1
                ? ""
                : "s"
            } available.`
          );

          return;
        }
      }


      try {

        const response =
          await fetch(
            `${CART_URL}/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  quantity
                })
            }
          );


        const responseText =
          await response.text();


        let data = {};


        try {

          data =
            responseText
              ? JSON.parse(responseText)
              : {};

        } catch {

          data = {
            message:
              responseText
          };
        }


        if (!response.ok) {

          alert(
            data.message ||
            data.error ||
            "Unable to update quantity."
          );

          return;
        }


        await fetchCart();

      } catch (error) {

        console.error(
          "Update cart quantity error:",
          error
        );

        alert(
          "Unable to update quantity."
        );
      }
    };


  /* =========================================================
     CLEAR CART
  ========================================================= */

  const clearCart = async () => {

    try {

      for (const item of cart) {

        const itemId =
          item.id ||
          item.cartId;


        if (itemId) {

          await fetch(
            `${CART_URL}/${itemId}`,
            {
              method: "DELETE"
            }
          );
        }
      }


      await fetchCart();

    } catch (error) {

      console.error(
        "Clear cart error:",
        error
      );

      alert(
        "Unable to clear cart."
      );
    }
  };


  /* =========================================================
     ADMIN - ADD PRODUCT
  ========================================================= */

  const addProduct = async (productData) => {

    try {

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({

                name:
                  productData.name,

                category:
                  productData.category,

                subcategory:
                  productData.subcategory,

                price:
                  Number(
                    productData.price
                  ),

                quantity:
                  Number(
                    productData.quantity
                  ),

                imageUrl:
                  productData.imageUrl
              })
          }
        );


      const responseText =
        await response.text();


      let data = {};


      try {

        data =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch {

        data = {
          message:
            responseText
        };
      }


      if (!response.ok) {

        alert(
          data.message ||
          data.error ||
          responseText ||
          "Unable to add product."
        );

        return false;
      }


      await fetchProducts();


      alert(
        "Product added successfully."
      );


      return true;

    } catch (error) {

      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      alert(
        "Unable to add product."
      );

      return false;
    }
  };


  /* =========================================================
     ADMIN - UPDATE PRODUCT
  ========================================================= */

  const updateProduct =
    async (id, productData) => {

      if (!id) {

        alert(
          "Product ID not found."
        );

        return false;
      }


      try {

        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  name:
                    productData.name,

                  category:
                    productData.category,

                  subcategory:
                    productData.subcategory,

                  price:
                    Number(
                      productData.price
                    ),

                  quantity:
                    Number(
                      productData.quantity
                    ),

                  imageUrl:
                    productData.imageUrl
                })
            }
          );


        const responseText =
          await response.text();


        let data = {};


        try {

          data =
            responseText
              ? JSON.parse(responseText)
              : {};

        } catch {

          data = {
            message:
              responseText
          };
        }


        if (!response.ok) {

          alert(
            data.message ||
            data.error ||
            responseText ||
            "Unable to update product."
          );

          return false;
        }


        await fetchProducts();


        alert(
          "Product updated successfully."
        );


        return true;

    } catch (error) {

        console.error(
          "UPDATE PRODUCT ERROR:",
          error
        );

        alert(
          "Unable to update product."
        );

        return false;
      }
    };


  /* =========================================================
     ADMIN - DELETE PRODUCT
  ========================================================= */

  const deleteProduct = async (id) => {

    if (!id) {

      alert(
        "Product ID not found."
      );

      return false;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmed) {

      return false;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE"
          }
        );


      const responseText =
        await response.text();


      if (!response.ok) {

        let data = {};


        try {

          data =
            responseText
              ? JSON.parse(responseText)
              : {};

        } catch {

          data = {};
        }


        alert(
          data.message ||
          data.error ||
          responseText ||
          "Unable to delete product."
        );

        return false;
      }


      await fetchProducts();


      alert(
        "Product deleted successfully."
      );


      return true;

    } catch (error) {

      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        "Unable to delete product."
      );

      return false;
    }
  };


  /* =========================================================
     VALIDATE CART STOCK
  ========================================================= */

  const validateCartStock = () => {

    const problems = [];


    cart.forEach((item) => {

      const product =
        getProductForCartItem(
          item
        );


      const wantedQuantity =
        Number(
          item.quantity || 0
        );


      if (!product) {

        problems.push(
          `${item.productName || "A product"} is no longer available.`
        );

        return;
      }


      const availableStock =
        Number(
          product.quantity ?? 0
        );


      if (availableStock <= 0) {

        problems.push(
          `${product.name} is out of stock.`
        );

        return;
      }


      if (
        wantedQuantity >
        availableStock
      ) {

        problems.push(
          `${product.name}: only ${availableStock} available, but ${wantedQuantity} is in your cart.`
        );
      }
    });


    return problems;
  };


  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const placeOrder = async (address) => {

    const userEmail =
      getUserEmail();


    if (!userEmail) {

      alert(
        "Please login first."
      );

      setPage("login");

      return;
    }


    if (cart.length === 0) {

      alert(
        "Your cart is empty."
      );

      setPage("cart");

      return;
    }


    /* -------------------------------------------------------
       REFRESH PRODUCTS BEFORE ORDER
       This makes sure we use the latest stock.
    ------------------------------------------------------- */

    await fetchProducts();


    /* -------------------------------------------------------
       STOCK VALIDATION
    ------------------------------------------------------- */

    const stockProblems =
      validateCartStock();


    if (
      stockProblems.length > 0
    ) {

      alert(
        "Please check your cart:\n\n" +
        stockProblems.join("\n")
      );

      await fetchCart();

      setPage("cart");

      return;
    }


    try {

      setLoading(true);


      const orderData = {

        userEmail:
          userEmail,

        paymentMethod:
          "CASH_ON_DELIVERY",

        fullName:
          address.fullName,

        phone:
          address.phone,

        houseStreet:
          address.houseStreet,

        city:
          address.city,

        state:
          address.state,

        pincode:
          address.pincode
      };


      console.log(
        "ORDER DATA SENT:",
        orderData
      );


      const response =
        await fetch(
          ORDER_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(orderData)
          }
        );


      const responseText =
        await response.text();


      let data = {};


      try {

        data =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch {

        data = {
          message:
            responseText
        };
      }


      if (!response.ok) {

        alert(
          `Order failed.\n\nStatus: ${response.status}\nMessage: ${
            data.message ||
            data.error ||
            responseText ||
            "Unable to place order."
          }`
        );

        /*
          Refresh because stock may have changed
          on the backend.
        */

        await fetchProducts();
        await fetchCart();

        return;
      }


      /* -----------------------------------------------------
         REFRESH EVERYTHING AFTER SUCCESS
      ----------------------------------------------------- */

      await fetchProducts();

      await fetchCart();

      await fetchOrders();


      alert(
        "Order placed successfully!\n\nYour order will be delivered within 5–6 days."
      );


      setPage("orders");

    } catch (error) {

      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        "Unable to place order.\n\n" +
        error.message
      );

    } finally {

      setLoading(false);
    }
  };


  /* =========================================================
     CANCEL ORDER
  ========================================================= */

  const cancelOrder = async (orderId) => {

    if (!orderId) {

      alert(
        "Order ID not found."
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "Cancelling order:",
        orderId
      );


      const response =
        await fetch(
          `${ORDER_URL}/cancel/${orderId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );


      const responseText =
        await response.text();


      console.log(
        "CANCEL ORDER STATUS:",
        response.status
      );


      console.log(
        "CANCEL ORDER RESPONSE:",
        responseText
      );


      let data = {};


      try {

        data =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch {

        data = {
          message:
            responseText
        };
      }


      if (!response.ok) {

        alert(
          data.message ||
          data.error ||
          responseText ||
          "Unable to cancel order."
        );

        return;
      }


      /* -----------------------------------------------------
         REFRESH PRODUCTS
         Cancelled order should restore stock.
      ----------------------------------------------------- */

      await fetchProducts();


      /* -----------------------------------------------------
         REFRESH ORDERS
         Status should become CANCELLED.
      ----------------------------------------------------- */

      await fetchOrders();


      /* -----------------------------------------------------
         REFRESH CART
      ----------------------------------------------------- */

      await fetchCart();


      alert(
        data.message ||
        "Order cancelled successfully."
      );


      setPage("orders");

    } catch (error) {

      console.error(
        "CANCEL ORDER ERROR:",
        error
      );

      alert(
        "Unable to cancel order. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  /* =========================================================
     CART TOTAL
  ========================================================= */

  const cartTotal =
    cart.reduce(
      (total, item) =>

        total +

        Number(
          item.price || 0
        ) *

        Number(
          item.quantity || 1
        ),

      0
    );


  /* =========================================================
     RENDER PAGE
  ========================================================= */

  const renderPage = () => {

    switch (page) {


      /* =====================================================
         HOME
      ===================================================== */

      case "home":

        return (
          <Home
            products={products}
            user={user}
            onAddToCart={addToCart}
            onProducts={() =>
              setPage("products")
            }
          />
        );


      /* =====================================================
         PRODUCTS
      ===================================================== */

      case "products":

        return (
          <Products
            products={products}
            user={user}

            isAdmin={
              user?.role === "ADMIN"
            }

            addToCart={
              addToCart
            }

            updateProduct={
              updateProduct
            }

            deleteProduct={
              deleteProduct
            }
          />
        );


      /* =====================================================
         LOGIN
      ===================================================== */

      case "login":

        return (
          <Login
            onLogin={login}

            onRegister={() =>
              setPage("register")
            }

            loading={loading}
          />
        );


      /* =====================================================
         REGISTER
      ===================================================== */

      case "register":

        return (
          <Register
            onRegister={
              register
            }

            onLogin={() =>
              setPage("login")
            }

            loading={loading}
          />
        );


      /* =====================================================
         VERIFY OTP
      ===================================================== */

      case "verifyOtp":

        return (
          <VerifyOtp
            email={
              verificationEmail
            }

            onVerify={
              verifyOtp
            }

            onResend={
              resendOtp
            }

            onLogin={() =>
              setPage("login")
            }

            loading={loading}
          />
        );


      /* =====================================================
         ORDERS
      ===================================================== */

      case "orders":

        if (!user) {

          setTimeout(
            () =>
              setPage("login"),
            0
          );

          return null;
        }


        return (
          <Orders
            orders={orders}
            user={user}

            onCancelOrder={
              cancelOrder
            }
          />
        );


      /* =====================================================
         CART
      ===================================================== */

      case "cart":

        if (!user) {

          setTimeout(
            () =>
              setPage("login"),
            0
          );

          return null;
        }


        return (

          <div className="cart-page">

            <section className="page-header">

              <span>
                ✦ CASTLE COLLECTION ✦
              </span>

              <h1>
                Your Cart
              </h1>

              <p>
                Review your selected
                products before checkout.
              </p>

            </section>


            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-star">
                  ✦
                </div>

                <h2>
                  Your Cart is Empty
                </h2>

                <p>
                  Add some beautiful
                  products to your cart.
                </p>

                <button
                  onClick={() =>
                    setPage(
                      "products"
                    )
                  }
                >
                  Continue Shopping
                </button>

              </div>

            ) : (

              <div className="cart-layout">


                {/* CART ITEMS */}

                <div className="cart-items">

                  {cart.map((item) => {

                    const itemId =
                      item.id ||
                      item.cartId ||
                      item.productId;


                    const itemName =
                      item.productName ||
                      item.name ||
                      "Product";


                    const currentProduct =
                      getProductForCartItem(
                        item
                      );


                    const currentStock =
                      Number(
                        currentProduct?.quantity ??
                        0
                      );


                    const currentQuantity =
                      Number(
                        item.quantity || 0
                      );


                    const isOutOfStock =
                      currentStock <= 0;


                    const reachedStockLimit =
                      currentQuantity >=
                      currentStock;


                    return (

                      <div
                        className="cart-item"
                        key={itemId}
                      >

                        <div className="cart-item-image">

                          {item.image ? (

                            <img
                              src={item.image}
                              alt={itemName}
                            />

                          ) : (

                            <div>
                              ✦
                            </div>

                          )}

                        </div>


                        <div className="cart-item-info">

                          <span>
                            {
                              item.category ||
                              currentProduct?.category ||
                              "CASTLE"
                            }
                          </span>


                          <h3>
                            {itemName}
                          </h3>


                          <p>
                            ₹
                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>


                          {/* STOCK STATUS */}

                          {isOutOfStock ? (

                            <strong
                              className="out-of-stock"
                            >
                              Out of Stock
                            </strong>

                          ) : (

                            <small>
                              {currentStock} available
                            </small>

                          )}


                          <div className="quantity-control">

                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  itemId,
                                  currentQuantity - 1
                                )
                              }

                              disabled={
                                currentQuantity <= 1
                              }
                            >
                              −
                            </button>


                            <span>
                              {
                                currentQuantity
                              }
                            </span>


                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  itemId,
                                  currentQuantity + 1
                                )
                              }

                              disabled={
                                isOutOfStock ||
                                reachedStockLimit
                              }

                              title={
                                reachedStockLimit
                                  ? "Maximum available stock reached"
                                  : "Increase quantity"
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>


                        <div className="cart-item-right">

                          <strong>
                            ₹
                            {(
                              Number(
                                item.price
                              ) *

                              currentQuantity
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>


                          <button
                            className="remove-cart-btn"
                            onClick={() =>
                              removeFromCart(
                                itemId
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>
                    );
                  })}


                  <button
                    className="clear-cart-btn"
                    onClick={
                      clearCart
                    }
                  >
                    Clear Cart
                  </button>

                </div>


                {/* CART SUMMARY */}

                <div className="cart-summary">

                  <span>
                    ORDER SUMMARY
                  </span>

                  <h2>
                    Cart Summary
                  </h2>


                  <div className="summary-row">

                    <span>
                      Items
                    </span>

                    <span>

                      {cart.reduce(
                        (
                          total,
                          item
                        ) =>

                          total +

                          Number(
                            item.quantity ||
                            0
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

                    onClick={() => {

                      const stockProblems =
                        validateCartStock();


                      if (
                        stockProblems.length >
                        0
                      ) {

                        alert(
                          "Please check your cart:\n\n" +
                          stockProblems.join(
                            "\n"
                          )
                        );

                        return;
                      }


                      setPage(
                        "checkout"
                      );
                    }}
                  >
                    Proceed to Checkout
                  </button>

                </div>

              </div>
            )}

          </div>
        );


      /* =====================================================
         CHECKOUT
      ===================================================== */

      case "checkout":

        if (!user) {

          setTimeout(
            () =>
              setPage("login"),
            0
          );

          return null;
        }


        if (cart.length === 0) {

          setTimeout(
            () =>
              setPage("cart"),
            0
          );

          return null;
        }


        return (
          <Checkout
            cart={cart}

            cartTotal={
              cartTotal
            }

            products={
              products
            }

            onPlaceOrder={
              placeOrder
            }

            onBack={() =>
              setPage("cart")
            }

            loading={
              loading
            }
          />
        );


      /* =====================================================
         ADMIN
      ===================================================== */

      case "admin":

        if (
          !user ||
          user.role !== "ADMIN"
        ) {

          setTimeout(
            () =>
              setPage("home"),
            0
          );

          return null;
        }


        return (
          <Admin
            products={
              products
            }

            onAddProduct={
              addProduct
            }

            onUpdateProduct={
              updateProduct
            }

            onDeleteProduct={
              deleteProduct
            }
          />
        );


      /* =====================================================
         DEFAULT
      ===================================================== */

      default:

        return (
          <Home
            products={
              products
            }

            user={
              user
            }

            onAddToCart={
              addToCart
            }

            onProducts={() =>
              setPage(
                "products"
              )
            }
          />
        );
    }
  };


  /* =========================================================
     MAIN APP
  ========================================================= */

  return (

    <>

      <Navbar
        user={
          user
        }

        cartCount={
          cart.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.quantity ||
                0
              ),

            0
          )
        }

        onNavigate={
          setPage
        }

        onLogout={
          logout
        }
      />


      <main>
        {renderPage()}
      </main>


      <Footer />

    </>

  );
}


export default App;