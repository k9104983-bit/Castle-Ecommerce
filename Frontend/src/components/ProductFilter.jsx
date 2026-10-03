import React from "react";

function ProductFilter({
  search,
  setSearch,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  categories,
  onClear
}) {
  return (
    <div className="product-filter">

      <div className="filter-title">
        <span>✦</span>
        <h3>Filter Products</h3>
      </div>

      <div className="filter-group search-group">
        <label>Search</label>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>


      <div className="filter-group">

        <label>Category</label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

      </div>


      <div className="filter-group">

        <label>Price</label>

        <div className="price-inputs">

          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            min="0"
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
          />

          <span>–</span>

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            min="0"
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

        </div>

      </div>


      <div className="filter-group">

        <label>Sort</label>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="">
            Default
          </option>

          <option value="lowToHigh">
            Price: Low to High
          </option>

          <option value="highToLow">
            Price: High to Low
          </option>

          <option value="nameAZ">
            Name: A to Z
          </option>

          <option value="nameZA">
            Name: Z to A
          </option>
        </select>

      </div>


      <button
        type="button"
        className="clear-filter-btn"
        onClick={onClear}
      >
        Clear Filters
      </button>

    </div>
  );
}

export default ProductFilter;