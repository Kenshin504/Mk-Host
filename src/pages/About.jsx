import Layout from "../components/Layout";

function About() {
  return (
    <>
      <Layout>
        <div>
          <b className="content-header">About</b>
          <div className="about-content">
            <p>
              Welcome to MK Inventory Ledger—Momikie's General Merchandise's exclusive web-based inventory management system.
              This system allows you to efficiently track and manage your store’s inventory, sales, and accounts all in one location,
              streamlining your daily operations and allowing you more time to focus on running and expanding your business.
            </p>
            <p>
              <h3 style={{ marginBottom: "0px" }}>What You Can Do</h3>
              <ul style={{ marginTop: "8px" }}>
                <li>Dashboard – Get a quick overview of your store’s inventory, sales, and recent activities.</li>
                <li>Product List – View and manage all available products, including details like pricing and available stock.</li>
                <li>Stock List – Monitor current stock, update quantities, and ensure items are always available.</li>
                <li>Sales List – Keep track of all transactions and sales records for better financial management.</li>
                <li>Account – Manage user profiles, personal information, and access control to ensure secure and efficient operations.</li>
              </ul>
            </p>
          </div>
          <div>
            <b className="content-header">Contacts</b>
            <div className="about-content">
              <p>
                For questions or suggestions, you may contact the developers.
              </p>
            </div>
          </div>
        </div>
        </Layout>
    </>
  );
}

export default About;
