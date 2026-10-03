import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  user,
  onAddToCart,
  onUpdate,
  onDelete
}) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-products">
        <h3>No products available</h3>
        <p>Please check again later.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          user={user}
          onAddToCart={onAddToCart}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}

export default ProductGrid;