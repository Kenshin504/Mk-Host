import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const STAFFS_PER_PAGE = 10;

function StaffList() {
  const [staffs, setStaffs] = useState(() => {
    const stored = localStorage.getItem("staffs");
    return stored ? JSON.parse(stored) : [];
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("staffs", JSON.stringify(staffs));
  }, [staffs]);

  const totalPages = Math.ceil(staffs.length / STAFFS_PER_PAGE);
  const paginatedStaffs = staffs.slice(
    (currentPage - 1) * STAFFS_PER_PAGE,
    currentPage * STAFFS_PER_PAGE
  );

  return (
    <Layout>
      <b className="content-header" style={{ marginBottom: "10px" }}>Staff List</b>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaffs.length === 0 ? (
              <tr>
                <td colSpan="4">No staff accounts available</td>
              </tr>
            ) : (
              paginatedStaffs.map((staff, index) => (
                <tr key={index}>
                  <td>{staff.username}</td>
                  <td>{staff.fullName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phoneNumber}</td>
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

export default StaffList;
