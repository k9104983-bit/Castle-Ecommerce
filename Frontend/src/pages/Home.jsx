import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

function Home({
  products = [],
  onAddToCart,
  onProducts,
  user
}) {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">

      {/* HERO WITH SLIDING PRODUCTS */}
      <Hero
        products={products}
        onExplore={onProducts}
      />

      {/* FEATURED PRODUCTS */}
      <section className="section">

        <div className="section-heading">
          <span>✦ OUR COLLECTION ✦</span>

          <h2>Featured Products</h2>

          <p>
            Explore some of our most loved products.
          </p>
        </div>

        <ProductGrid
          products={featuredProducts}
          user={user}
          onAddToCart={onAddToCart}
        />

        <div className="center-button">

          <button
            className="hero-btn"
            onClick={onProducts}
          >
            View All Products
          </button>

        </div>

      </section>

      {/* CASTLE STORY */}
      <section className="story-section">

        <div className="story-content">

          <span>✦ THE CASTLE STORY ✦</span>

          <h2>
            More than shopping.
            <br />
            It is an experience.
          </h2>

          <p>
            Castle brings together carefully selected
            products with a simple and elegant shopping
            experience.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Home;