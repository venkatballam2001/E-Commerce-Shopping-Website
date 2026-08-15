import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleBlockUser } from '../../store/authSlice';
import { Shield, ShieldAlert, Ban, CheckCircle } from 'lucide-react';

const UsersAdminPage = () => {
  const dispatch = useDispatch();
  const { usersList } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleBlock = (userId) => {
    dispatch(toggleBlockUser(userId));
  };

  return (
    <div className="space-y-6">
      
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white">Customer Directory & RBAC Security</h1>
        <p className="text-xs text-slate-400">View user accounts, verify administrative roles, and restrict access</p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {usersList.map((user) => (
              <tr key={user._id} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-800" />
                    <span className="font-bold text-white">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-400 font-mono">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    user.role === 'admin'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {user.isBlocked ? (
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center w-fit">
                      <Ban className="w-3 h-3 mr-1" /> Suspended / Blocked
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center w-fit">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active Account
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleBlock(user._id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                        user.isBlocked
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {user.isBlocked ? 'Unblock User' : 'Block User'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UsersAdminPage;
