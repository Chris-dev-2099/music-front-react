import Navbar from "../components/Navbar";
import SongsTable from "../components/SongsTable";

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      
      <Navbar />

      <div className="p-4 sm:p-6">
        <SongsTable />
      </div>

    </div>
  );
}