import cat1 from "./academic.jpg";
import cat2 from "./administrative.jpg";
import cat3 from "./campus_facility.jpg";
import cat4 from "./health_wellness.jpg";
import cat5 from "./hostel_housing.jpg";
import logo from "./unisphere_logo.jpg";
import profile from "./profile_logo.jpg";
import heroImage from "./nav_search_imag1.jpeg";

export const assets = {
  logo,
  profile,
  heroImage,
};

export const categoryData = [
  {
    name: "Academic",
    items: ["Faculty Appointment", "Project Guidance"],
    description:
      "Schedule advising, tutoring sessions, and faculty office hours.",
    image: cat1,
  },
  {
    name: "Administrative",
    items: ["Office Admin", "Fee and Account"],
    description:
      "Appointments for registrar services, financial aid, and documents.",
    image: cat2,
  },
  {
    name: "Campus Facility",
    items: ["Guest House", "Library"],
    description:
      "Reserve study rooms, sports courts, and creative maker spaces.",
    image: cat3,
  },
  {
    name: "Health & Wellness",
    items: ["Medical Checkups", "Counseling Sessions", "Wellness Programs"],
    description:
      "Book medical checkups, counseling sessions, and wellness programs.",
    image: cat4,
  },
  {
    name: "Hostel & Housing",
    items: [
      "Maintenance Requests",
      "Move-in Schedules",
      "Room Equipment Rental",
    ],
    description:
      "Maintenance requests, move-in schedules, and room equipment rental.",
    image: cat5,
  },
];

