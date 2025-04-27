import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import docImg from "../Photos/doc.png";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  // ✅ Fetch all appointments from the backend
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/appointment/getall",
        {
          credentials: "include", // Ensures cookies/session get sent
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.appointment);
      console.log("Appointments fetched:", data.appointment);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Handle update status API call
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ✅ Optional route protection
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <>
      <section className="dashboard page">
        {/* Header Banner */}
        <div className="banner">
          <div className="firstBox">
            <img src={docImg} alt="Doctor" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>Admin</h5>
              </div>
              <p>ClinicSphere</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{new Set(appointments.map((a) => a.doctorId)).size}</h3>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      {appointment.doctor
                        ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                        : "N/A"}
                    </td>
                    <td>{appointment.department || "N/A"}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Appointments Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
