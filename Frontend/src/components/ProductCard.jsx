function ProductCard({
  product,
  user,
  onAddToCart,
  onUpdate,
  onDelete
}) {
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="product-card">

      <div className="product-image">

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
          />
        ) : (
          <div className="image-placeholder">
            Castle
          </div>
        )}

      </div>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p className="product-price">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        <p className="stock-text">
          {product.quantity > 0
            ? `${product.quantity} available`
            : "Out of stock"}
        </p>

        {isAdmin ? (
          <div className="admin-product-actions">

            <button
              className="update-btn"
              onClick={() => onUpdate(product)}
            >
              Update
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </button>

          </div>
        ) : (
          <button
            className="add-cart-btn"
            disabled={product.quantity <= 0}
            onClick={() => onAddToCart(product)}
          >
            {product.quantity > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>
        )}

      </div>

    </div>
  );
}

export default ProductCard;