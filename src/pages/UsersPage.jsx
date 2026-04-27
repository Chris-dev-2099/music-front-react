import Navbar from "../components/Navbar";
import UsersTable from "../components/UsersTable";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="p-4 sm:p-6">
        <UsersTable />
      </div>

    </div>
  );
}