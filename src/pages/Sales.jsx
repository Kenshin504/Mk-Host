import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const SALES_PER_PAGE = 10;

function Sales() {
  const [sales, setSales] = useState(() => {
    const stored = localStorage.getItem("sales");
    return stored ? JSON.parse(stored) : [];
  });

  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [stocks, setStocks] = useState(() => {
    const stored = localStorage.getItem("stocks");
    return stored ? JSON.parse(stored) : [];
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    barcode: "",
    quantity: "",
    customer: "",
    status: "Paid",
  });

  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSale = () => {
    const { barcode, quantity, customer, status } = formData;
  
    if (!barcode || !quantity) {
      setError("Please fill in all required fields.");
      return;
    }
  
    const productIndex = products.findIndex((p) => p.barcode === barcode);
    if (productIndex === -1) {
      setError(`No product found with barcode "${barcode}".`);
      return;
    }
  
    const stockItem = stocks.find((s) => s.barcode === barcode);
    if (!stockItem) {
      setError(`No stock available for product with barcode "${barcode}".`);
      return;
    }
  
    const currentProductQty = parseInt(products[productIndex].quantity || 0);
    const quantitySold = parseInt(quantity || 0);
  
    if (quantitySold > currentProductQty) {
      setError("Insufficient stock to complete the sale.");
      return;
    }
  
    const unitPrice = parseFloat(products[productIndex].price || 0);
    const total = unitPrice * quantitySold;
  
    const newSale = {
      id: `SALE-${Date.now()}`,
      invoiceNo: `INV-${Date.now()}`,
      date: formData.date,
      barcode,
      product: products[productIndex].name,
      quantity: quantitySold,
      unitPrice,
      total,
      customer: customer || "",
      status,
      processed: true,
    };
  
    // Update sales
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));
  
    // DO NOT modify stocks array here
  
    // Only update products quantity
    const updatedProducts = [...products];
    updatedProducts[productIndex].quantity = (currentProductQty - quantitySold).toString();
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  
    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      barcode: "",
      quantity: "",
      customer: "",
      status: "Paid",
    });
    setError("");
    setIsFormVisible(false);
  };
  

  const handleStatusChange = (index, newStatus) => {
    const updatedSales = [...sales];
    updatedSales[index].status = newStatus;
    setSales(updatedSales);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortedSales = () => {
    let filtered = filter === "all"
      ? [...sales]
      : sales.filter((s) => s.status.toLowerCase() === filter);

    if (!sortColumn) return filtered;

    return filtered.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedSales = getSortedSales();
  const totalPages = Math.ceil(sortedSales.length / SALES_PER_PAGE);
  const paginatedSales = sortedSales.slice(
    (currentPage - 1) * SALES_PER_PAGE,
    currentPage * SALES_PER_PAGE
  );

  return (
    <Layout>
      <b className="content-header">Sales</b>

      <div className="sales-controls">
        <select
          id="salesFilter"
          className="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <button className="edit-button" onClick={() => setIsFormVisible(true)}>
          Add Sales
        </button>
      </div>

      {isFormVisible && (
        <div className="hidden-overlay" style={{ display: "flex" }}>
          <div className="popup-content">
            <h3>Add Sale</h3>
            <div className="product-form">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <input name="date" type="date" value={formData.date} onChange={handleInputChange} />
              <input name="barcode" placeholder="Barcode" value={formData.barcode} onChange={handleInputChange} />
              <input name="quantity" type="number" placeholder="Quantity (pcs)" style={{ width: "150px" }} value={formData.quantity} onChange={handleInputChange} />
              <input name="customer" placeholder="Customer (optional)" value={formData.customer} onChange={handleInputChange} />
              <select name="status" className="payment-status" value={formData.status} onChange={handleInputChange}>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <div>
                <button style={{ marginTop: "15px" }} onClick={handleAddSale}>Submit</button>
                <button style={{ marginTop: "15px" }} onClick={() => setIsFormVisible(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("date")}>Date</th>
              <th onClick={() => handleSort("invoiceNo")}>Invoice No.</th>
              <th onClick={() => handleSort("barcode")}>Barcode</th>
              <th onClick={() => handleSort("product")}>Product</th>
              <th onClick={() => handleSort("quantity")}>Quantity</th>
              <th onClick={() => handleSort("unitPrice")}>Unit Price</th>
              <th onClick={() => handleSort("total")}>Total Sales</th>
              <th onClick={() => handleSort("customer")}>Customer</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.length === 0 ? (
              <tr><td colSpan="9">No sales recorded</td></tr>
            ) : (
              paginatedSales.map((sale, index) => {
                const globalIndex = (currentPage - 1) * SALES_PER_PAGE + index;
                return (
                  <tr key={index}>
                    <td>{sale.date}</td>
                    <td>{sale.invoiceNo}</td>
                    <td>{sale.barcode}</td>
                    <td>{sale.product}</td>
                    <td>{sale.quantity}</td>
                    <td>₱{parseFloat(sale.unitPrice).toFixed(2)}</td>
                    <td>₱{parseFloat(sale.total).toFixed(2)}</td>
                    <td>{sale.customer || "-"}</td>
                    <td>
                      <select
                        value={sale.status}
                        onChange={(e) => handleStatusChange(globalIndex, e.target.value)}
                        style={{
                          backgroundColor: sale.status === "Paid" ? "#4CAF50" : "#f44336",
                          color: "white",
                          padding: "4px 10px",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </td>
                  </tr>
                );
              })
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
        <span>Page {currentPage} of {totalPages}</span>
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

export default Sales;
