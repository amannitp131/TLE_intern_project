"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ExportCSVButton from "./UI/ExportCSVButton";
import StudentFormModal from "../components/StudentFormModal";
import AddCronModal from "../components/UI/AddCronModal"
import ViewCronModal from "../components/UI/ViewCronModal"
import { Eye, Pencil, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [savedTheme, setSavedTheme] = useState("light");
   const [theme, setTheme] = useState("0");
  const [showAddCronModal, setShowAddCronModal] = useState(false);
  const [showViewCronModal, setShowViewCronModal] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);
  
   useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(stored || "0");
  }, []);

  const excludedKeys = ["_id", "__v", "cf_contests", "cf_problems_solved", "current_rank"];

  const getRatingClass = (rating) => {
    if (rating < 1200) return "text-gray-500";
    if (rating < 1400) return "text-green-500";
    if (rating < 1600) return "text-cyan-500";
    if (rating < 1900) return "text-blue-500";
    if (rating < 2100) return "text-violet-500";
    if (rating < 2300) return "text-orange-500";
    if (rating < 2400) return "text-orange-600";
    if (rating < 2600) return "text-red-500";
    if (rating < 2900) return "text-red-600";
    return "text-red-800 font-bold";
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/get-students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (student) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`${API_URL}/api/delete-student-by-handle/${student.cf_handle}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: student.id }),
        });
        fetchStudents();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleUpdate = async (updatedStudent) => {
    try {
      await fetch(`${API_URL}/api/edit-student/${updatedStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleAdd = async (newStudent) => {
    try {
      await fetch(`${API_URL}/api/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleAddcron = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inactivity/add-cf-cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add cron");
      setTime("");
      // Optionally call a parent callback or close the modal
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setSelected(null);
    setIsAddMode(true);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelected(student);
    setIsAddMode(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setIsAddMode(false);
  };

  const columns =
    students.length > 0
      ? Object.keys(students[0])
        .filter((key) => !excludedKeys.includes(key))
        .map((key) => ({
          key,
          header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        }))
      : [];

  // Conditional classes
  const mainBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const tableHeadBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const tableBodyBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const borderColor = savedTheme === "dark" ? "border-gray-700" : "border-gray-300";
  const hoverRow = savedTheme === "dark" ? "hover:bg-gray-900" : "hover:bg-gray-100";
  const titleColor = savedTheme === "dark" ? "text-white" : "text-gray-800";

  return (
    <div className={`overflow-x-auto p-4 ${mainBg}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className={`text-2xl font-bold ${titleColor}`}>All Students</h2>
        <div className="flex gap-3">
          <ExportCSVButton data={students} columns={columns} />
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            ➕ Add Student
          </button>
          <button
            onClick={() => {
              setShowAddCronModal(true);
              handleAdd();
            }}

            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            ➕ Add Cron
          </button>
          <button
            onClick={() => setShowViewCronModal(true)}
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            🕒 View Cron
          </button>

          {/* Add Cron Modal */}
          {showAddCronModal && (
            <AddCronModal
              isOpen={showAddCronModal}
              onClose={() => setShowAddCronModal(false)}
              onAdded={fetchStudents}
              apiUrl={API_URL}
            />
          )}

          {/* View Cron Modal */}
          {showViewCronModal && (
            <ViewCronModal
              isOpen={showViewCronModal}
              onClose={() => setShowViewCronModal(false)}
              apiUrl={API_URL}
            />
          )}
        </div>
      </div>

    <div className={`border rounded-xl overflow-hidden shadow-lg ${borderColor} ${theme === "1" ? "bg-black text-white" : "bg-white text-black"}`}>
  <table className="min-w-full text-sm text-left">
    <thead className={`${tableHeadBg} ${theme === "1" ? "bg-black text-white" : "bg-white text-black"}`}>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`px-5 py-3 text-xs font-semibold tracking-wider uppercase ${borderColor} border-b`}
          >
            {col.header}
          </th>
        ))}
        <th className={`px-5 py-3 text-xs font-semibold tracking-wider uppercase ${borderColor} border-b`}>
          Actions
        </th>
      </tr>
    </thead>
    <tbody className={`${tableBodyBg} ${theme === "1" ? "bg-black text-white" : "bg-white text-black"}`}>
      {students.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length + 1}
            className={`text-center p-6 ${theme === "1" ? "text-gray-300" : "text-gray-500"}`}
          >
            No students found.
          </td>
        </tr>
      ) : (
        students.map((student, idx) => (
          <tr
            key={student._id}
            className={`transition-all duration-300 ${
              theme === "1"
                ? idx % 2 === 0
                  ? "bg-gray-900"
                  : "bg-black"
                : idx % 2 === 0
                ? "bg-gray-50"
                : "bg-white"
            } `}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={`px-5 py-3 ${col.key === "cf_handle" ? getRatingClass(student.current_rating) : ""}`}
              >
                {student[col.key]}
              </td>
            ))}
            <td className="px-5 py-3 flex justify-center gap-3">
              <Link href={`/students/${student._id}`}>
                <button
                  className={`p-2 rounded-full hover:bg-blue-200 transition ${
                    theme === "1"
                      ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                      : "bg-blue-100 text-blue-600"
                  }`}
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </Link>

              <button
                onClick={() => openEditModal(student)}
                className={`p-2 rounded-full hover:bg-yellow-200 transition ${
                  theme === "1"
                    ? "bg-yellow-900 text-yellow-300 hover:bg-yellow-800"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(student)}
                className={`p-2 rounded-full hover:bg-red-200 transition ${
                  theme === "1"
                    ? "bg-red-900 text-red-300 hover:bg-red-800"
                    : "bg-red-100 text-red-600"
                }`}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {modalOpen && (
        <StudentFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={isAddMode ? handleAdd : handleUpdate}
          student={selected}
        />
      )}
    </div>
  );
}