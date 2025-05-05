import { useState, useEffect } from "react";
import "../styles/KeyMetrics.css";

function KeyMetrics({ stockData }) {
  const [metrics, setMetrics] = useState({
    totalSales: 1245678.0,
    totalOrders: 1893,
    pendingOrders: 42,
    lowStockItems: 15,
    percentChanges: {
      totalSales: 12.5,
      totalOrders: 8.2,
      pendingOrders: 3.1,
      lowStockItems: 0,
    },
  });

  const [previousStocks, setPreviousStocks] = useState([...stockData]);

  useEffect(() => {
    // Store current stocks for comparison
    setPreviousStocks([...stockData]);

    // Calculate low stock items based on current stock data
    const lowItems = calculateLowStockItems(stockData);
    const lowItemsChange = calculateLowStockItemsChange(
      stockData,
      previousStocks
    );

    // Update low stock items count and percentage change
    setMetrics((prev) => ({
      ...prev,
      lowStockItems: lowItems,
      percentChanges: {
        ...prev.percentChanges,
        lowStockItems: lowItemsChange,
      },
    }));
  }, [stockData]);

  // Calculate number of items with less than 100 in stock
  const calculateLowStockItems = (currentStocks) => {
    return currentStocks.filter((item) => item.stock < 100).length;
  };

  // Calculate change in low stock items
  const calculateLowStockItemsChange = (currentStocks, prevStocks) => {
    const currentLow = calculateLowStockItems(currentStocks);
    const prevLow = calculateLowStockItems(prevStocks);

    if (prevLow === 0) return 0;
    return ((currentLow - prevLow) / prevLow) * 100;
  };

  // Format currency with peso sign
  const formatCurrency = (value) => {
    return "₱" + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  // Function to simulate data updates (can be replaced with API calls later)
  const updateMetricsWithRandomChange = () => {
    setMetrics((prev) => {
      const salesChange = Math.random() * 5 - 2; // -2% to +3%
      const ordersChange = Math.random() * 3 - 1; // -1% to +2%
      const pendingChange = Math.random() * 2 - 0.5; // -0.5% to +1.5%

      return {
        totalSales: prev.totalSales * (1 + salesChange / 100),
        totalOrders: Math.floor(prev.totalOrders * (1 + ordersChange / 100)),
        pendingOrders: Math.floor(
          prev.pendingOrders * (1 + pendingChange / 100)
        ),
        lowStockItems: prev.lowStockItems, // This is calculated from stockData
        percentChanges: {
          totalSales: salesChange,
          totalOrders: ordersChange,
          pendingOrders: pendingChange,
          lowStockItems: prev.percentChanges.lowStockItems, // This is calculated from stockData
        },
      };
    });
  };

  // Update metrics every 5 seconds for simulation
  useEffect(() => {
    const interval = setInterval(updateMetricsWithRandomChange, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="key-metrics-container">
      <div className="key-metrics-header">
        <div className="key-metrics-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          </svg>
          <h2>Key Metrics</h2>
        </div>
        <div className="key-metrics-actions">
          <button className="expand-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
          </button>
          <button className="close-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="key-metrics-cards">
        {/* Total Sales */}
        <div className="metric-card">
          <div className="metric-icon sales-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-label">Total Sales</div>
            <div className="metric-value">
              {formatCurrency(metrics.totalSales)}
            </div>
            <div
              className={`metric-change ${
                metrics.percentChanges.totalSales >= 0 ? "positive" : "negative"
              }`}
            >
              {metrics.percentChanges.totalSales >= 0 ? "+" : ""}
              {metrics.percentChanges.totalSales.toFixed(1)}% vs last period
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="metric-card">
          <div className="metric-icon orders-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-label">Total Orders</div>
            <div className="metric-value">{metrics.totalOrders}</div>
            <div
              className={`metric-change ${
                metrics.percentChanges.totalOrders >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {metrics.percentChanges.totalOrders >= 0 ? "+" : ""}
              {metrics.percentChanges.totalOrders.toFixed(1)}% vs last period
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="metric-card">
          <div className="metric-icon pending-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-label">Pending Orders</div>
            <div className="metric-value">{metrics.pendingOrders}</div>
            <div
              className={`metric-change ${
                metrics.percentChanges.pendingOrders >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {metrics.percentChanges.pendingOrders >= 0 ? "+" : ""}
              {metrics.percentChanges.pendingOrders.toFixed(1)}% vs last period
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="metric-card">
          <div className="metric-icon low-stock-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-label">Low Stock Items</div>
            <div className="metric-value">{metrics.lowStockItems}</div>
            <div className="metric-change neutral">
              {metrics.percentChanges.lowStockItems.toFixed(1)}% vs last period
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyMetrics;
