import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { fetchUsers, updateUser, deleteUser } from "../../features/admin/adminUsersSlice";

const AdminUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.adminUsers);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }
    dispatch(fetchUsers());
  }, [userInfo, navigate, dispatch]);

  const handleEdit = (user) => {
    const newName = prompt("Enter new name:", user.name);
    if (!newName) return;
    const newEmail = prompt("Enter new email:", user.email);
    if (!newEmail) return;

    dispatch(updateUser({ id: user._id, name: newName, email: newEmail }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      
      <div className="flex-1 p-10">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Management</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Members</p>
            <p className="text-2xl font-black text-slate-900">{users.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold animate-pulse">Accessing Database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] text-red-600 font-bold">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Info</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                  <th className="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                  <th className="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-black text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <p className="text-sm font-medium text-slate-500">{user.email}</p>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.role === "admin" 
                        ? "bg-purple-50 text-purple-600 border-purple-100" 
                        : "bg-slate-50 text-slate-600 border-slate-100"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-sm font-bold text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-6 px-8 text-right">
                      {user.role !== "admin" ? (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors"
                            title="Edit User"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                            title="Delete User"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;