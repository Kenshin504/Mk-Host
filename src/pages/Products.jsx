import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { UploadCloud } from "lucide-react";

const PRODUCTS_PER_PAGE = 10;

function Products() {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    price: "",
    category: "",
    image: null,
  });

  const [editIndex, setEditIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({ ...prev, image: base64String }));
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
      setShowUpload(false);
    }
  };

  const handleAddOrUpdateProduct = () => {
    const { barcode, name, price, category, image } = formData;

    if (!barcode || !name || !price || !category || !image) {
      setError("Please fill in all fields.");
      return;
    }

    if (editIndex !== null) {
      // Editing existing product
      const updatedProducts = [...products];
      updatedProducts[editIndex] = {
        barcode,
        name,
        price: parseFloat(price),
        category,
        image,
      };
      setProducts(updatedProducts);
    } else {
      // Adding new product
      const barcodeExists = products.some(
        (product) => product.barcode === barcode
      );
      if (barcodeExists) {
        setError("A product with this barcode already exists.");
        return;
      }
      const newProduct = {
        barcode,
        name,
        price: parseFloat(price),
        category,
        image,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setFormData({
      barcode: "",
      name: "",
      price: "",
      category: "",
      image: null,
    });
    setPreviewImage(null);
    setError("");
    setIsFormVisible(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const product = products[index];
    setFormData({
      barcode: product.barcode,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    setPreviewImage(product.image);
    setEditIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    }
  };  

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const inputStyle = {
    padding: "10px",
    border: "solid",
    borderRadius: "7px",
    borderWidth: "2px",
    width: "300px",
    marginRight: "20px",
    marginTop: "15px",
  };

  const selectStyle = {
    overflow: "hidden",
    backgroundColor: "white",
    padding: "10px",
    border: "solid",
    borderRadius: "7px",
    borderWidth: "2px",
    width: "200px",
    marginRight: "20px",
    marginTop: "15px",
    marginBottom: "10px",
    cursor: "pointer",
  };

  return (
    <Layout>
      <b className="content-header">Products</b>

      <div className="product-nav">
        <input
          type="text"
          placeholder="🔍︎ Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={inputStyle}
        />
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="filter"
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="School Supplies">School Supplies</option>
        </select>
        <button
          className="edit-button"
          onClick={() => {
            setFormData({
              barcode: "",
              name: "",
              price: "",
              category: "",
              image: null,
            });
            setPreviewImage(null);
            setEditIndex(null);
            setIsFormVisible(true);
          }}
        >
          Add Product
        </button>
      </div>

      {isFormVisible && (
        <div className="hidden-overlay" style={{ display: "flex" }}>
          <div className="popup-content">
            <h3>{editIndex !== null ? "Edit Product" : "Add Product"}</h3>
            <div className="product-form">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <input
                name="barcode"
                placeholder="Barcode"
                value={formData.barcode}
                onChange={handleInputChange}
              />
              <input
                name="name"
                placeholder="Product Name"
                style={{ width: "250px" }}
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                style={{ width: "150px" }}
                value={formData.price}
                onChange={handleInputChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="product-category"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="School Supplies">School Supplies</option>
              </select>

              <div
                className="button-container"
              >
                <button
                  className="edit-button"
                  style={{ backgroundColor: "#212121" }}
                  onClick={() => setShowUpload(!showUpload)}
                >
                  {formData.image ? "Change Image" : "Add Image"}
                </button>
              </div>

              {showUpload && (
                <div
                  className="upload-box"
                  style={{
                    border: "2px dashed gray",
                    padding: "20px",
                    textAlign: "center",
                    marginBottom: "15px",
                  }}
                >
                  <UploadCloud className="w-10 h-10 text-gray-500 mx-auto" />
                  <p className="text-gray-600">Drag & drop or click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    className="edit-button mt-3"
                    style={{ backgroundColor: "#212121" }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Choose File
                  </button>
                </div>
              )}

              {previewImage && (
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <p>Preview Image</p>
                </div>
              )}

              <div>
                <button onClick={handleAddOrUpdateProduct}>Submit</button>
                <button
                  onClick={() => {
                    setIsFormVisible(false);
                    setEditIndex(null);
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th >Barcode</th>
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th >Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="6">No products available</td>
              </tr>
            ) : (
              paginatedProducts.map((product, index) => (
                <tr key={index}>
                  <td >{product.barcode}</td>
                  <td>{product.name}</td>
                  <td>₱{parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td style={{ width: "1%", whiteSpace: "nowrap" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      width="90"
                      height="90"
                      borderRadius="8px"
                      style={{ paddingLeft:"10px", paddingRight:"10px"}}
                    />
                  </td>
                  <td style={{ width: "1%", whiteSpace: "nowrap" }}>
                    <button
                      className="product-action-button"
                      style={{ marginLeft:"0px" }}
                      onClick={() =>
                        handleEdit(
                          (currentPage - 1) * PRODUCTS_PER_PAGE + index
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="product-action-button"
                      style={{ marginRight:"0px" }}
                      onClick={() =>
                        handleDelete(
                          (currentPage - 1) * PRODUCTS_PER_PAGE + index
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="prev-next-button" style={{ marginTop: "10px" }}>
        <button
          className="previous"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="next"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    </Layout>
  );
}

export default Products;
