import { useMemo, useState } from "react";
import ProductFilter from "../components/ProductFilter";

function Products({
  products = [],
  user,
  isAdmin,
  addToCart,
  updateProduct,
  deleteProduct
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    quantity: "",
    imageUrl: ""
  });

  const [saving, setSaving] = useState(false);

  /*
  ============================================================
  CASTLE CATEGORY STRUCTURE
  ============================================================
  */

  const categoryGroups = {
    ELECTRONICS: [
      "COMPUTERS & LAPTOPS",
      "AUDIO",
      "CAMERAS"
    ],

    "HOME APPLIANCES": [
      "KITCHEN APPLIANCES",
      "HOME APPLIANCES"
    ],

    "FASHION & LIFESTYLE": [
      "CLOTHING & DRESSES",
      "FOOTWEAR",
      "BAGS",
      "JEWELLERY",
      "WATCH",
      "ACCESSORIES",
      "BEAUTY"
    ]
  };

  const mainCategories = Object.keys(categoryGroups);

  /*
  ============================================================
  NORMALIZE CATEGORY
  ============================================================
  */

  const normalizeCategory = (value) => {
    return String(value ?? "")
      .trim()
      .toUpperCase()
      .replace(/&/g, "AND")
      .replace(/[^A-Z0-9]+/g, "");
  };

  /*
  ============================================================
  CATEGORY LOOKUP
  ============================================================
  */

  const categoryLookup = useMemo(() => {
    const lookup = {};

    Object.entries(categoryGroups).forEach(
      ([mainCategory, subCategories]) => {
        lookup[normalizeCategory(mainCategory)] =
          mainCategory;

        subCategories.forEach((subCategory) => {
          lookup[normalizeCategory(subCategory)] =
            mainCategory;
        });
      }
    );

    /*
      Support old database values.

      WATCH
      WATCHES

      Both belong to:

      FASHION & LIFESTYLE
      -> WATCH
    */

    lookup["WATCH"] = "FASHION & LIFESTYLE";
    lookup["WATCHES"] = "FASHION & LIFESTYLE";

    return lookup;
  }, []);

  /*
  ============================================================
  WATCH VALUE CHECK
  ============================================================
  */

  const isWatchValue = (value) => {
    const normalized =
      normalizeCategory(value);

    return (
      normalized === "WATCH" ||
      normalized === "WATCHES"
    );
  };

  /*
  ============================================================
  WATCH PRODUCT CHECK
  ============================================================
  */

  const isWatchProduct = (product) => {
    const productName =
      String(product?.name ?? "")
        .trim()
        .toUpperCase();

    return (
      isWatchValue(product?.category) ||
      isWatchValue(product?.subcategory) ||
      productName.includes("WATCH")
    );
  };

  /*
  ============================================================
  GET CANONICAL PRODUCT CATEGORY
  ============================================================
  */

  const getCanonicalProductCategory = (product) => {
    const rawCategory =
      product?.category ?? "";

    const rawSubcategory =
      product?.subcategory ?? "";

    /*
      IMPORTANT:

      If the product itself is a watch,
      force it into:

      FASHION & LIFESTYLE
      WATCH
    */

    if (isWatchProduct(product)) {
      return {
        category: "FASHION & LIFESTYLE",
        subcategory: "WATCH"
      };
    }

    const normalizedCategory =
      normalizeCategory(rawCategory);

    const normalizedSubcategory =
      normalizeCategory(rawSubcategory);

    /*
      CATEGORY MATCH
    */

    if (categoryLookup[normalizedCategory]) {
      const mainCategory =
        categoryLookup[normalizedCategory];

      /*
        If category is already a main category.
      */

      if (
        normalizeCategory(mainCategory) ===
        normalizedCategory
      ) {
        return {
          category: mainCategory,
          subcategory:
            rawSubcategory || ""
        };
      }

      /*
        If category itself is a subcategory.
      */

      return {
        category: mainCategory,
        subcategory:
          isWatchValue(rawCategory)
            ? "WATCH"
            : rawSubcategory ||
              rawCategory ||
              ""
      };
    }

    /*
      SUBCATEGORY MATCH
    */

    if (categoryLookup[normalizedSubcategory]) {
      return {
        category:
          categoryLookup[
            normalizedSubcategory
          ],

        subcategory:
          isWatchValue(rawSubcategory)
            ? "WATCH"
            : rawSubcategory
      };
    }

    /*
      Nothing matched.
    */

    return {
      category: rawCategory || "",
      subcategory:
        rawSubcategory || ""
    };
  };

  /*
  ============================================================
  FIND PRODUCT MAIN CATEGORY
  ============================================================
  */

  const getProductMainCategory = (product) => {
    const canonical =
      getCanonicalProductCategory(product);

    return canonical.category || "";
  };

  /*
  ============================================================
  SELECTED MAIN CATEGORY
  ============================================================
  */

  const selectedMainCategory = useMemo(() => {
    if (!category) {
      return "";
    }

    const normalizedSelected =
      normalizeCategory(category);

    return (
      categoryLookup[normalizedSelected] || ""
    );
  }, [category, categoryLookup]);

  /*
  ============================================================
  PRODUCT CATEGORY MATCHING
  ============================================================
  */

  const matchesSelectedCategory = (product) => {
    if (!category) {
      return true;
    }

    const selected =
      normalizeCategory(category);

    const canonical =
      getCanonicalProductCategory(product);

    const canonicalCategory =
      normalizeCategory(
        canonical.category
      );

    const canonicalSubcategory =
      normalizeCategory(
        canonical.subcategory
      );

    /*
      WATCH FILTER

      Every one of these becomes:

      FASHION & LIFESTYLE -> WATCH

      WATCH
      WATCHES
      Product name containing WATCH
    */

    if (
      selected ===
      normalizeCategory("WATCH")
    ) {
      return (
        canonicalCategory ===
          normalizeCategory(
            "FASHION & LIFESTYLE"
          ) &&
        canonicalSubcategory ===
          normalizeCategory("WATCH")
      );
    }

    /*
      MAIN CATEGORY
    */

    if (
      selected === canonicalCategory
    ) {
      return true;
    }

    /*
      SUBCATEGORY
    */

    if (
      selected === canonicalSubcategory
    ) {
      return true;
    }

    /*
      MAIN CATEGORY FALLBACK
    */

    const productMainCategory =
      normalizeCategory(
        getProductMainCategory(product)
      );

    if (
      selected === productMainCategory
    ) {
      return true;
    }

    return false;
  };

  /*
  ============================================================
  FILTER + SEARCH + SORT
  ============================================================
  */

  const filteredProducts = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    const minimumPrice =
      minPrice === ""
        ? 0
        : Number(minPrice);

    const maximumPrice =
      maxPrice === ""
        ? Infinity
        : Number(maxPrice);

    let result = products.filter((product) => {
      const productName =
        String(product?.name ?? "")
          .toLowerCase();

      const productCategory =
        String(product?.category ?? "")
          .toLowerCase();

      const productSubcategory =
        String(product?.subcategory ?? "")
          .toLowerCase();

      const productPrice =
        Number(product?.price) || 0;

      const canonical =
        getCanonicalProductCategory(
          product
        );

      const canonicalCategory =
        String(
          canonical.category || ""
        ).toLowerCase();

      const canonicalSubcategory =
        String(
          canonical.subcategory || ""
        ).toLowerCase();

      const matchesSearch =
        productName.includes(searchText) ||
        productCategory.includes(searchText) ||
        productSubcategory.includes(searchText) ||
        canonicalCategory.includes(searchText) ||
        canonicalSubcategory.includes(searchText);

      const matchesCategory =
        matchesSelectedCategory(product);

      const matchesMinPrice =
        productPrice >= minimumPrice;

      const matchesMaxPrice =
        productPrice <= maximumPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    /*
    ==========================================================
    SORT
    ==========================================================
    */

    if (sort === "lowToHigh") {
      result.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (sort === "highToLow") {
      result.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    }

    if (sort === "nameAZ") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    if (sort === "nameZA") {
      result.sort((a, b) =>
        String(b.name || "").localeCompare(
          String(a.name || "")
        )
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    categoryLookup
  ]);

  /*
  ============================================================
  CLEAR FILTERS
  ============================================================
  */

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
  };

  /*
  ============================================================
  CATEGORY SELECTION
  ============================================================
  */

  const selectMainCategory = (mainCategory) => {
    setCategory(mainCategory);
  };

  const selectSubCategory = (subCategory) => {
    setCategory(subCategory);
  };

  const isMainCategoryActive = (mainCategory) => {
    return (
      normalizeCategory(
        selectedMainCategory
      ) ===
      normalizeCategory(mainCategory)
    );
  };

  /*
  ============================================================
  UPDATE PRODUCT
  ============================================================
  */

  const startUpdate = (product) => {
    const canonical =
      getCanonicalProductCategory(
        product
      );

    setEditingProduct(product);

    setEditForm({
      name:
        product?.name || "",

      category:
        canonical.category || "",

      subcategory:
        canonical.subcategory || "",

      price:
        product?.price ?? "",

      quantity:
        product?.quantity ?? "",

      imageUrl:
        product?.imageUrl ||
        product?.image_url ||
        ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /*
  ============================================================
  CANCEL UPDATE
  ============================================================
  */

  const cancelUpdate = () => {
    setEditingProduct(null);

    setEditForm({
      name: "",
      category: "",
      subcategory: "",
      price: "",
      quantity: "",
      imageUrl: ""
    });
  };

  /*
  ============================================================
  HANDLE EDIT CHANGE
  ============================================================
  */

  const handleEditChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  /*
  ============================================================
  HANDLE CATEGORY CHANGE
  ============================================================
  */

  const handleEditCategoryChange = (event) => {
    const newCategory =
      event.target.value;

    setEditForm((previous) => ({
      ...previous,
      category: newCategory,
      subcategory: ""
    }));
  };

  /*
  ============================================================
  UPDATE SUBMIT
  ============================================================
  */

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!editingProduct?.id) {
      alert("Product ID not found.");
      return;
    }

    if (!editForm.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!editForm.category) {
      alert("Please select a category.");
      return;
    }

    if (!editForm.subcategory) {
      alert("Please select a subcategory.");
      return;
    }

    if (
      editForm.price === "" ||
      Number(editForm.price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      editForm.quantity === "" ||
      Number(editForm.quantity) < 0
    ) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (
      typeof updateProduct !==
      "function"
    ) {
      alert(
        "Update function is not connected."
      );
      return;
    }

    /*
      ALWAYS SAVE WATCH AS:

      FASHION & LIFESTYLE
      WATCH
    */

    let finalCategory =
      editForm.category;

    let finalSubcategory =
      editForm.subcategory;

    if (
      isWatchValue(finalCategory) ||
      isWatchValue(finalSubcategory) ||
      editForm.name
        .toUpperCase()
        .includes("WATCH")
    ) {
      finalCategory =
        "FASHION & LIFESTYLE";

      finalSubcategory =
        "WATCH";
    }

    try {
      setSaving(true);

      const success =
        await updateProduct(
          editingProduct.id,
          {
            name:
              editForm.name.trim(),

            category:
              finalCategory,

            subcategory:
              finalSubcategory,

            price:
              Number(editForm.price),

            quantity:
              Number(editForm.quantity),

            imageUrl:
              editForm.imageUrl.trim()
          }
        );

      if (success) {
        cancelUpdate();
      }
    } catch (error) {
      console.error(
        "PRODUCT UPDATE ERROR:",
        error
      );

      alert(
        "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ============================================================
  DELETE PRODUCT
  ============================================================
  */

  const handleDelete = async (product) => {
    if (!product?.id) {
      alert("Product ID not found.");
      return;
    }

    if (
      typeof deleteProduct !==
      "function"
    ) {
      alert(
        "Delete function is not connected."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    await deleteProduct(product.id);
  };

  /*
  ============================================================
  EDIT SUBCATEGORIES
  ============================================================
  */

  const editSubcategories =
    editForm.category
      ? categoryGroups[
          editForm.category
        ] || []
      : [];

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <div className="products-page">

      <div className="page-header">

        <span>
          CASTLE COLLECTION
        </span>

        <h1>
          All Products
        </h1>

        <p>
          Discover something beautiful
          for every part of your life.
        </p>

      </div>

      {/* UPDATE PANEL */}

      {isAdmin &&
        editingProduct && (
          <section className="product-update-panel">

            <div className="product-update-header">

              <div>
                <span>
                  CASTLE ADMIN
                </span>

                <h2>
                  Update Product
                </h2>

                <p>
                  Editing:{" "}
                  <strong>
                    {editingProduct.name}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="cancel-update-btn"
                onClick={cancelUpdate}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

            <form
              className="product-update-form"
              onSubmit={
                handleUpdateSubmit
              }
            >

              <div className="update-form-grid">

                <div className="update-form-group">

                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      editForm.name
                    }
                    onChange={
                      handleEditChange
                    }
                    disabled={saving}
                    required
                  />

                </div>

                <div className="update-form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      editForm.category
                    }
                    onChange={
                      handleEditCategoryChange
                    }
                    disabled={saving}
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    {mainCategories.map(
                      (mainCategory) => (
                        <option
                          key={
                            mainCategory
                          }
                          value={
                            mainCategory
                          }
                        >
                          {mainCategory}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="update-form-group">

                  <label>
                    Subcategory
                  </label>

                  <select
                    name="subcategory"
                    value={
                      editForm.subcategory
                    }
                    onChange={
                      handleEditChange
                    }
                    disabled={
                      saving ||
                      !editForm.category
                    }
                    required
                  >

                    <option value="">
                      Select Subcategory
                    </option>

                    {editSubcategories.map(
                      (subCategory) => (
                        <option
                          key={
                            subCategory
                          }
                          value={
                            subCategory
                          }
                        >
                          {subCategory}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="update-form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      editForm.price
                    }
                    onChange={
                      handleEditChange
                    }
                    min="0"
                    step="0.01"
                    disabled={saving}
                    required
                  />

                </div>

                <div className="update-form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={
                      editForm.quantity
                    }
                    onChange={
                      handleEditChange
                    }
                    min="0"
                    step="1"
                    disabled={saving}
                    required
                  />

                </div>

                <div className="update-form-group">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="url"
                    name="imageUrl"
                    value={
                      editForm.imageUrl
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="https://..."
                    disabled={saving}
                  />

                </div>

              </div>

              <div className="update-form-actions">

                <button
                  type="button"
                  className="cancel-update-btn"
                  onClick={cancelUpdate}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-update-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </section>
        )}

      {/* CATEGORY NAVIGATION */}

      <div className="category-section">

        <div className="category-list">

          <button
            className={`category-item ${
              category === ""
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCategory("")
            }
          >
            ALL
          </button>

          {mainCategories.map(
            (mainCategory) => (
              <button
                key={mainCategory}
                className={`category-item ${
                  isMainCategoryActive(
                    mainCategory
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectMainCategory(
                    mainCategory
                  )
                }
              >
                {mainCategory}
              </button>
            )
          )}

        </div>

        {selectedMainCategory && (
          <div className="subcategory-section">

            <div className="subcategory-title">
              {selectedMainCategory}
            </div>

            <div className="subcategory-list">

              {categoryGroups[
                selectedMainCategory
              ].map(
                (subCategory) => (
                  <button
                    key={subCategory}
                    className={`subcategory-item ${
                      normalizeCategory(
                        category
                      ) ===
                      normalizeCategory(
                        subCategory
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      selectSubCategory(
                        subCategory
                      )
                    }
                  >
                    {subCategory}
                  </button>
                )
              )}

            </div>

          </div>
        )}

      </div>

      {/* FILTER */}

      <ProductFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        categories={mainCategories}
        onClear={clearFilters}
      />

      {/* RESULT */}

      <div className="products-result-info">

        <p>
          {category === ""
            ? "All Products"
            : category}
        </p>

        <span>
          {filteredProducts.length}{" "}
          product
          {filteredProducts.length !==
          1
            ? "s"
            : ""}
        </span>

      </div>

      {/* EMPTY */}

      {filteredProducts.length ===
      0 ? (

        <div className="empty-products">

          <div className="empty-star">
            ✦
          </div>

          <h2>
            No Products Found
          </h2>

          <p>
            Try changing your search
            or filters.
          </p>

          <button
            className="reset-category-btn"
            onClick={clearFilters}
          >
            View All Products
          </button>

        </div>

      ) : (

        <div className="product-grid">

          {filteredProducts.map(
            (product) => {

              const stock =
                Number(
                  product?.quantity
                ) || 0;

              const isOutOfStock =
                stock <= 0;

              const canonical =
                getCanonicalProductCategory(
                  product
                );

              return (
                <div
                  className={`product-card ${
                    isOutOfStock
                      ? "product-out-of-stock"
                      : ""
                  }`}
                  key={product.id}
                >

                  <div className="product-image">

                    {product.imageUrl ||
                    product.image_url ? (

                      <img
                        src={
                          product.imageUrl ||
                          product.image_url
                        }
                        alt={
                          product.name ||
                          "Castle product"
                        }
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="image-placeholder">
                        ✦
                      </div>

                    )}

                    {isOutOfStock && (
                      <div className="out-of-stock-badge">
                        OUT OF STOCK
                      </div>
                    )}

                  </div>

                  <div className="product-info">

                    <span className="product-category">
                      {canonical.category ||
                        product.category}
                    </span>

                    {canonical.subcategory && (
                      <span className="product-subcategory">
                        {
                          canonical.subcategory
                        }
                      </span>
                    )}

                    <h3>
                      {product.name}
                    </h3>

                    <p className="product-price">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p
                      className={`stock-text ${
                        isOutOfStock
                          ? "stock-out"
                          : ""
                      }`}
                    >
                      {isOutOfStock
                        ? "Out of stock"
                        : `${stock} available`}
                    </p>

                    {!isAdmin && (
                      <button
                        className="add-cart-btn"
                        onClick={() => {
                          if (
                            isOutOfStock
                          ) {
                            alert(
                              "This product is currently out of stock."
                            );
                            return;
                          }

                          if (
                            typeof addToCart ===
                            "function"
                          ) {
                            addToCart(
                              product
                            );
                          }
                        }}
                        disabled={
                          isOutOfStock
                        }
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                    )}

                    {isAdmin && (
                      <div className="admin-product-actions">

                        <button
                          type="button"
                          className="update-btn"
                          onClick={() =>
                            startUpdate(
                              product
                            )
                          }
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default Products;