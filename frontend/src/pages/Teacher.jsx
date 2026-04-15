import { useContext } from "react";
import { ServiceContext } from "../context/ServiceContext.jsx";

const Teacher = () => {
  const { teacherData } = useContext(ServiceContext);

  return (
    <div className="container-fluid my-5">
      <div className="row">
        <div className="col-md-9">
          <div className="row">
            {teacherData.map((teacher, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow border-0">
                  <img
                    src={teacher.image}
                    alt={teacher.teacher_name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">
                      {teacher.teacher_name}
                    </h5>
                    <p className="card-text text-secondary">
                      {teacher.branch}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {teacher.category}
                    </p>
                    <span
                      className={`badge ${
                        teacher.available ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {teacher.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {teacherData.length === 0 && (
              <p className="text-muted">No teachers available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
