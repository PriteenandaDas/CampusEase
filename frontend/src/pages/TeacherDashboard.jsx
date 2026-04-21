import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const TeacherDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("summary");
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(0);

  const menuItems = [
    { key: "summary", label: "Summary" },
    { key: "pending", label: "Pending Requests" },
    { key: "today", label: "Today's Appointments" },
    { key: "all", label: "All Appointments" },
    { key: "earnings", label: "My Earnings" },
  ];

  const fetchAppointments = async () => {
    const res = await fetch(
      `${backendUrl}/api/appointment/teacher`,
      { credentials: "include" }
    );

    const data = await res.json();

    if (data.success) {
      setAppointments(data.appointments);
    }
  };

  const fetchEarnings = async () => {
    const res = await fetch(
      `${backendUrl}/api/appointment/teacher/earnings`,
      { credentials: "include" }
    );

    const data = await res.json();

    if (data.success) {
      setEarnings(data.earnings);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchEarnings();
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(
      `${backendUrl}/api/appointment/teacher/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      fetchAppointments();
    } else {
      toast.error(data.message);
    }
  };

  const today = new Date().toLocaleDateString();

  const todayAppointments = appointments.filter(
    (appt) =>
      new Date(appt.appointmentDate).toLocaleDateString() === today
  );

  const pendingAppointments = appointments.filter(
    (appt) => appt.status === "pending"
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div
        style={{
          width: "250px",
          backgroundColor: "#342516",
          color: "white",
        }}
        className="p-3"
      >
        <h4 className="text-center mb-4">Teacher Panel</h4>

        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`p-2 mb-2 rounded ${
              activeTab === item.key
                ? "bg-light text-dark"
                : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="flex-grow-1 p-4 bg-light">
        {activeTab === "summary" && (
          <>
            <h3>Summary</h3>

            <div className="row my-4">
              <div className="col-md-4">
                <div className="card shadow p-4 text-center">
                  <h5>Total</h5>
                  <h2>{appointments.length}</h2>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow p-4 text-center">
                  <h5>Today</h5>
                  <h2>{todayAppointments.length}</h2>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow p-4 text-center">
                  <h5>Earnings</h5>
                  <h2>₹{earnings}</h2>
                </div>
              </div>
            </div>
          </>
        )}

        {(activeTab === "pending" ||
          activeTab === "all" ||
          activeTab === "today") && (
          <>
            <h3>
              {activeTab === "pending"
                ? "Pending Requests"
                : activeTab === "today"
                ? "Today's Appointments"
                : "All Appointments"}
            </h3>

            <div className="card shadow p-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {(activeTab === "pending"
                    ? pendingAppointments
                    : activeTab === "today"
                    ? todayAppointments
                    : appointments
                  ).map((item) => (
                    <tr key={item._id}>
                      <td>{item.studentId?.fullname}</td>
                      <td>{item.serviceId?.name}</td>
                      <td>
                        {new Date(
                          item.appointmentDate
                        ).toLocaleDateString()}
                      </td>
                      <td>{item.timeSlot}</td>
                      <td>{item.status}</td>

                     <td>
  {item.status === "pending" && (
    <>
      <button
        className="btn btn-sm btn-success me-2"
        onClick={() => updateStatus(item._id, "approved")}
      >
        Approve
      </button>

      <button
        className="btn btn-sm btn-danger"
        onClick={() => updateStatus(item._id, "cancelled")}
      >
        Cancel
      </button>
    </>
  )}

  {item.status === "approved" && (
    <>
      <button
        className="btn btn-sm btn-success me-2"
        onClick={() => updateStatus(item._id, "completed")}
      >
        Complete
      </button>

      <button
        className="btn btn-sm btn-danger"
        onClick={() => updateStatus(item._id, "cancelled")}
      >
        Cancel
      </button>
    </>
  )}

  {(item.status === "completed" ||
    item.status === "cancelled") && (
    <span className="text-muted">No Action</span>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "earnings" && (
          <div className="card shadow p-4 text-center">
            <h3>Total Earnings</h3>
            <h1>₹{earnings}</h1>
            <p>From cancellation penalties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;