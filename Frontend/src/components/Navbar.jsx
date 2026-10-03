function Navbar({
  user,
  cartCount,
  onNavigate,
  onLogout
}) {
  return (
    <header className="navbar">

      <div className="navbar-container">

        <button
          className="navbar-brand"
          onClick={() => onNavigate("home")}
        >
          CASTLE
        </button>

        <nav className="navbar-links">

          <button
            onClick={() => onNavigate("home")}
          >
            Home
          </button>

          {user && (
            <span className="navbar-greeting">
              Hi, {user.name}
            </span>
          )}

          <button
            onClick={() => onNavigate("products")}
          >
            Products
          </button>

          {user && user.role !== "ADMIN" && (
            <>
              <button
                onClick={() => onNavigate("cart")}
              >
                Cart

                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate("orders")}
              >
                My Orders
              </button>
            </>
          )}

          {user && user.role === "ADMIN" && (
            <button
              onClick={() => onNavigate("admin")}
            >
              Admin
            </button>
          )}

          {!user && (
            <>
              <button
                onClick={() => onNavigate("login")}
              >
                Login
              </button>

              <button
                onClick={() => onNavigate("register")}
              >
                Register
              </button>
            </>
          )}

          {user && (
            <button
              className="logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>
          )}

        </nav>

      </div>

    </header>
  );
}

export default Navbar;