import { useState } from "react";
import ProductGrid from "../components/ProductGrid";

function Admin({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) {
  /*
  ============================================================
  CASTLE CATEGORY STRUCTURE
  ============================================================
  */

  const categoryData = {
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

  /*
  ============================================================
  EMPTY FORM
  ============================================================
  */

  const emptyForm = {
    name: "",
    category: "",
    subcategory: "",
    price: "",
    quantity: "",
    imageUrl: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  /*
  ============================================================
  NORMALIZE
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
  WATCH VALUE
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
  WATCH PRODUCT
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
  CANONICAL PRODUCT CATEGORY
  ============================================================
  */

  const getCanonicalProductCategory = (
    product
  ) => {
    /*
      Any watch becomes:

      FASHION & LIFESTYLE
      WATCH
    */

    if (isWatchProduct(product)) {
      return {
        category:
          "FASHION & LIFESTYLE",

        subcategory:
          "WATCH"
      };
    }

    return {
      category:
        product?.category || "",

      subcategory:
        product?.subcategory || ""
    };
  };

  /*
  ============================================================
  HANDLE CHANGE
  ============================================================
  */

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    if (name === "category") {
      setForm({
        ...form,
        category: value,
        subcategory: ""
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  /*
  ============================================================
  CLEAR FORM
  ============================================================
  */

  const clearForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  /*
  ============================================================
  SUBMIT
  ============================================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.category ||
      !form.subcategory ||
      form.price === "" ||
      form.quantity === ""
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    if (Number(form.price) < 0) {
      alert(
        "Price cannot be negative."
      );
      return;
    }

    if (Number(form.quantity) < 0) {
      alert(
        "Quantity cannot be negative."
      );
      return;
    }

    /*
    ==========================================================
    WATCH CONVERSION
    ==========================================================

    If the product is a watch, ALWAYS save:

    category:
    FASHION & LIFESTYLE

    subcategory:
    WATCH
    */

    let finalCategory =
      form.category;

    let finalSubcategory =
      form.subcategory;

    if (
      isWatchValue(finalCategory) ||
      isWatchValue(finalSubcategory) ||
      form.name
        .trim()
        .toUpperCase()
        .includes("WATCH")
    ) {
      finalCategory =
        "FASHION & LIFESTYLE";

      finalSubcategory =
        "WATCH";
    }

    const productData = {
      name:
        form.name.trim(),

      category:
        finalCategory,

      subcategory:
        finalSubcategory,

      price:
        Number(form.price),

      quantity:
        Number(form.quantity),

      imageUrl:
        form.imageUrl.trim()
    };

    let success;

    if (editingId) {
      success =
        await onUpdateProduct(
          editingId,
          productData
        );
    } else {
      success =
        await onAddProduct(
          productData
        );
    }

    if (success) {
      clearForm();
    }
  };

  /*
  ============================================================
  START UPDATE
  ============================================================
  */

  const startUpdate = (product) => {
    const canonical =
      getCanonicalProductCategory(
        product
      );

    setEditingId(product.id);

    setForm({
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
  SUBCATEGORIES
  ============================================================
  */

  const subcategories =
    form.category
      ? categoryData[
          form.category
        ] || []
      : [];

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <div className="admin-page">

      {/* PAGE HEADER */}

      <section className="page-header">

        <span>
          ✦ CASTLE MANAGEMENT ✦
        </span>

        <h1>
          Admin Panel
        </h1>

        <p>
          Manage your product collection.
        </p>

      </section>

      {/* ADD / UPDATE FORM */}

      <div className="admin-form-container">

        <h2>
          {editingId
            ? "Update Product"
            : "Add Product"}
        </h2>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Category
            </option>

            {Object.keys(
              categoryData
            ).map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

          {/* SUBCATEGORY */}

          <select
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            disabled={!form.category}
            required
          >

            <option value="">
              {form.category
                ? "Select Subcategory"
                : "Select Category First"}
            </option>

            {subcategories.map(
              (subcategory) => (
                <option
                  key={subcategory}
                  value={subcategory}
                >
                  {subcategory}
                </option>
              )
            )}

          </select>

          {/* PRICE */}

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          {/* QUANTITY */}

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            step="1"
            required
          />

          {/* IMAGE */}

          <input
            name="imageUrl"
            placeholder="Product Image URL"
            value={form.imageUrl}
            onChange={handleChange}
          />

          {/* IMAGE PREVIEW */}

          {form.imageUrl && (
            <div className="admin-image-preview">

              <img
                src={form.imageUrl}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}

          {/* BUTTONS */}

          <div className="admin-form-buttons">

            <button type="submit">
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* INVENTORY */}

      <section className="admin-products">

        <div className="section-heading">

          <span>
            ✦ INVENTORY ✦
          </span>

          <h2>
            Manage Products
          </h2>

        </div>

        <ProductGrid
          products={products}
          user={{ role: "ADMIN" }}
          onUpdate={startUpdate}
          onDelete={onDeleteProduct}
        />

      </section>

    </div>
  );
}

export default Admin;