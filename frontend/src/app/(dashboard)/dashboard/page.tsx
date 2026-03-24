export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Sameh!</h1>
      <p className="text-gray-600">Select a module from the sidebar to start managing your portfolio.</p>
      
      {/* Stats Cards (Quick Overview) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Total Projects</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Active Skills</h3>
          <p className="text-3xl font-bold">25</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Blog Posts</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>
    </div>
  );
}