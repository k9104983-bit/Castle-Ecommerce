function Hero({ onExplore }) {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-small">
          ✦ THE CASTLE COLLECTION ✦
        </span>

        <h1>
          Timeless.
          <br />
          Elegant.
          <br />
          Yours.
        </h1>

        <p className="hero-description">
          Discover a carefully selected collection
          designed to bring elegance into everyday life.
        </p>

        <button
          className="hero-btn"
          onClick={onExplore}
        >
          Explore Collection
        </button>

      </div>

    </section>
  );
}

export default Hero;