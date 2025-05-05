import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Stocks() {
  const [stocks, setStocks] = useState(() => {
    const stored = localStorage.getItem("stocks");
    return stored ? JSON.parse(stored) : [];
  });

  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [error, setError] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newStock, setNewStock] = useState({
    id: "",
    date: "",
    barcode: "",
    supplier: "",
    quantity: "",
    unitCost: "",
    totalCost: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const stocksPerPage = 10;
  const [stockListPage, setStockListPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    const applySalesToProducts = () => {
      const sales = JSON.parse(localStorage.getItem("sales") || "[]");
      if (!sales.length) return;

      const currentProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const updatedProducts = [...currentProducts];
      let hasChange = false;

      const updatedSales = sales.map(sale => {
        if (sale.processed) return sale;

        const productIndex = updatedProducts.findIndex(p => p.barcode === sale.barcode);
        if (productIndex === -1) {
          setError(`No product found with barcode "${sale.barcode}".`);
          return { ...sale, processed: true };
        }

        const currentQty = parseInt(updatedProducts[productIndex].quantity || "0");
        const soldQty = parseInt(sale.quantity || "0");
        const newQty = currentQty - soldQty;

        updatedProducts[productIndex].quantity = Math.max(0, newQty).toString();
        hasChange = true;

        return { ...sale, processed: true };
      });

      if (hasChange) {
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        localStorage.setItem("sales", JSON.stringify(updatedSales));
        setProducts(updatedProducts);
      }
    };

    applySalesToProducts();
    window.addEventListener("storage", applySalesToProducts);

    return () => {
      window.removeEventListener("storage", applySalesToProducts);
    };
  }, []);

  const updateProductStock = (barcode, quantity) => {
    const updatedProducts = products.map(product =>
      product.barcode === barcode
        ? {
            ...product,
            quantity: (
              parseInt(product.quantity || 0) + parseInt(quantity)
            ).toString(),
          }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleAddStockClick = () => {
    setError("");
    setNewStock({
      id: `STOCK-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      barcode: "",
      supplier: "",
      quantity: "",
      unitCost: "",
      totalCost: "",
    });
    setIsPopupVisible(true);
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "quantity" || name === "unitCost") {
        const quantity = name === "quantity" ? value : prev.quantity;
        const unitCost = name === "unitCost" ? value : prev.unitCost;
        updated.totalCost = (parseFloat(quantity || 0) * parseFloat(unitCost || 0)).toFixed(2);
      }
      return updated;
    });
  };

  const getStockStatus = (quantity) => {
    const qty = parseInt(quantity);
    if (qty <= 0) return "Out of Stock";
    if (qty < 50) return "Almost out of stock";
    return "Fully stocked";
  };

  const getStatusColor = (status) => {
    if (status === "Fully stocked") return "green";
    if (status === "Almost out of stock") return "orange";
    if (status === "Out of Stock") return "red";
    return "";
  };

  const handleSubmitStock = () => {
    if (!newStock.barcode || !newStock.quantity || !newStock.unitCost || !newStock.supplier) {
      setError("Please fill in all required fields.");
      return;
    }

    const productExists = products.some(
      (product) => product.barcode === newStock.barcode
    );
    if (!productExists) {
      setError(`No product found with barcode "${newStock.barcode}". Please enter a valid barcode.`);
      return;
    }

    const status = getStockStatus(newStock.quantity);
    const stockToAdd = { ...newStock, status };

    const updatedStocks = [...stocks, stockToAdd];
    setStocks(updatedStocks);
    updateProductStock(newStock.barcode, newStock.quantity);

    setIsPopupVisible(false);
    setShowHistory(true);
    setError("");
  };

  const stockList = products.map(product => {
    const currentQty = parseInt(product.quantity || 0);
    return {
      barcode: product.barcode,
      quantity: currentQty,
      status: getStockStatus(currentQty),
    };
  });

  const filteredStockList = stockList
    .filter(item => {
      const matchesSearch = item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || item.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.barcode.localeCompare(b.barcode);
      } else {
        return b.barcode.localeCompare(a.barcode);
      }
    });

  const stockListTotalPages = Math.ceil(filteredStockList.length / stocksPerPage);
  const historyTotalPages = Math.ceil(stocks.length / stocksPerPage);

  const paginatedStockList = filteredStockList.slice(
    (stockListPage - 1) * stocksPerPage,
    stockListPage * stocksPerPage
  );

  const paginatedStockHistory = stocks.slice(
    (historyPage - 1) * stocksPerPage,
    historyPage * stocksPerPage
  );

  return (
    <Layout>
      <b className="content-header">Stocks</b>
      <div className="stock-nav">
        <input
          type="text"
          placeholder="🔍︎ Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="fully stocked">Fully Stocked</option>
          <option value="almost out of stock">Almost out of Stock</option>
          <option value="out of stock">Out of Stock</option>
        </select>
        <button onClick={() => setSortOrder(order => order === "asc" ? "desc" : "asc")} className="edit-button">
          Sort {sortOrder === "asc" ? "↓" : "↑"}
        </button>
        <button onClick={handleAddStockClick} className="edit-button">Add Stock</button>
        <button onClick={() => setShowHistory(prev => !prev)} className="edit-button">
          {showHistory ? "Hide Stock History" : "Show Stock History"}
        </button>
      </div>

      
      {isPopupVisible && (
        <div className="hidden-overlay" style={{ display: 'flex' }}>
          <div className="popup-content" style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h3>Add New Stock</h3>
            <div className="product-form">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <input type="text" value={newStock.id} disabled />
              <input type="date" name="date" value={newStock.date} onChange={handleStockChange} />
              <input type="text" name="barcode" placeholder="Barcode" value={newStock.barcode} onChange={handleStockChange} />
              <input type="text" name="supplier" placeholder="Supplier" value={newStock.supplier} onChange={handleStockChange} />
              <input type="number" name="quantity" placeholder="Quantity (pcs)" style={{ width: "150px" }} value={newStock.quantity} onChange={handleStockChange} />
              <input type="number" name="unitCost" placeholder="Unit Cost" style={{ width: "150px" }} value={newStock.unitCost} onChange={handleStockChange} />
              <input type="number" name="totalCost" placeholder="Total Cost" style={{ width: "150px" }} value={newStock.totalCost} disabled />
              <div>
                <button style={{ marginTop: "15px" }} onClick={handleSubmitStock}>Add Stock</button>
                <button style={{ marginTop: "15px" }} onClick={() => setIsPopupVisible(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h3>Stock List</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th >Barcode</th>
              <th>Total Quantity</th>
              <th >Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStockList.length === 0 ? (
              <tr><td colSpan="3">No stocks available</td></tr>
            ) : (
              paginatedStockList.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.barcode}</td>
                  <td>{item.quantity}</td>
                  <td style={{ backgroundColor: getStatusColor(item.status), color: "white" }}>
                    {item.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="prev-next-button" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
        <button onClick={() => setStockListPage(p => Math.max(1, p - 1))} disabled={stockListPage === 1}>
          &laquo; Previous
        </button>
        <span>Page {stockListPage} of {stockListTotalPages}</span>
        <button onClick={() => setStockListPage(p => Math.min(stockListTotalPages, p + 1))} disabled={stockListPage === stockListTotalPages}>
          Next &raquo;
        </button>
      </div>

      {showHistory && (
        <>
          <h3 style={{ marginTop: "50px" }}>Stock History</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date Stocked<br />(Year-Month-Day)</th>
                  <th>Stock ID</th>
                  <th>Supplier</th>
                  <th>Quantity (pcs)</th>
                  <th>Unit Cost</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStockHistory.length === 0 ? (
                  <tr><td colSpan="6">No stock history available</td></tr>
                ) : (
                  paginatedStockHistory.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.date}</td>
                      <td>{stock.id}</td>
                      <td>{stock.supplier}</td>
                      <td>{stock.quantity}</td>
                      <td>₱{stock.unitCost}</td>
                      <td>₱{stock.totalCost}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="prev-next-button" style={{ marginTop: "20px", marginBottom: "50px", display: "flex", justifyContent: "center" }}>
            <button onClick={() => setHistoryPage(p => Math.max(1, p - 1))} disabled={historyPage === 1}>
              &laquo; Previous
            </button>
            <span>Page {historyPage} of {historyTotalPages}</span>
            <button onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))} disabled={historyPage === historyTotalPages}>
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Stocks;
