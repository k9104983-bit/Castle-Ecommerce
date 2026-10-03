import { useEffect, useState } from "react";

function Hero({ products = [], onProducts }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderProducts = products.filter(
    (product) => product.imageUrl
  );

  useEffect(() => {
    if (sliderProducts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderProducts.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [sliderProducts.length]);

  return (
    <section className="hero">

      {/* LEFT SIDE */}
      <div className="hero-content">

        <span>THE CASTLE COLLECTION</span>

        <h1>
          Timeless.
          <br />
          Elegant.
          <br />
          Yours.
        </h1>

        <p>
          Discover a carefully selected collection
          designed to bring elegance into everyday life.
        </p>

        <button
          className="hero-btn"
          onClick={onProducts}
        >
          Explore Collection
        </button>

      </div>

      {/* RIGHT SIDE - PRODUCT SLIDER */}
      <div className="hero-slider">

        <div className="hero-slider-glow"></div>

        {sliderProducts.length > 0 ? (
          <div
            className="hero-product-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {sliderProducts.map((product) => (
              <div
                className="hero-product-slide"
                key={product.id}
              >

                <div className="hero-product-image">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                  />
                </div>

                <div className="hero-product-details">

                  <span>
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="hero-empty-slider">
            <span>✦</span>
            <p>Discover Our Collection</p>
          </div>
        )}

        {/* DOTS */}
        {sliderProducts.length > 1 && (
          <div className="hero-slider-dots">
            {sliderProducts.map((product, index) => (
              <button
                key={product.id}
                className={
                  index === currentIndex
                    ? "hero-dot active"
                    : "hero-dot"
                }
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show ${product.name}`}
              />
            ))}
          </div>
        )}

      </div>

    </section>
  );
}

export default Hero;