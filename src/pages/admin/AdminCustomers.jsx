import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { fetchUsers, updateUserRole, updateUserStatus } from '../../firebase/services';
import { 
  Users, Search, ShieldCheck, ShieldAlert, User, Mail, 
  Phone, Calendar, AlertTriangle, CheckCircle2, UserCheck, 
  UserX, Shield, RefreshCw 
} from 'lucide-react';

export default function AdminCustomers() {
  const { userProfile, isSuperAdmin } = useAuth();
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation modal state
  const [modalConfig, setModalConfig] = useState(null); // { type: 'promote' | 'ban' | 'unban', user: Object }

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Unable to fetch user registry. Showing cached entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(u => {
      const name = (u.displayName || u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || u.phoneNumber || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [users, searchQuery]);

  // Statistics counters
  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'admin' || u.role === 'superAdmin').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;

  // Actions
  const handlePromoteConfirm = async (targetUser) => {
    try {
      await updateUserRole(targetUser.id || targetUser.uid, 'admin');
      setUsers(prev => prev.map(u => (u.id === targetUser.id || u.uid === targetUser.uid) ? { ...u, role: 'admin' } : u));
      showToast('User role updated successfully.', 'success');
    } catch (err) {
      showToast('Failed to promote user.', 'error');
    } finally {
      setModalConfig(null);
    }
  };

  const handleBanConfirm = async (targetUser) => {
    try {
      await updateUserStatus(targetUser.id || targetUser.uid, 'banned');
      setUsers(prev => prev.map(u => (u.id === targetUser.id || u.uid === targetUser.uid) ? { ...u, status: 'banned' } : u));
      showToast('User has been banned.', 'success');
    } catch (err) {
      showToast('Failed to ban user.', 'error');
    } finally {
      setModalConfig(null);
    }
  };

  const handleUnbanConfirm = async (targetUser) => {
    try {
      await updateUserStatus(targetUser.id || targetUser.uid, 'active');
      setUsers(prev => prev.map(u => (u.id === targetUser.id || u.uid === targetUser.uid) ? { ...u, status: 'active' } : u));
      showToast('User has been unbanned.', 'success');
    } catch (err) {
      showToast('Failed to unban user.', 'error');
    } finally {
      setModalConfig(null);
    }
  };

  // Helper check for admin protection
  const canModifyUser = (targetUser) => {
    // Current admin ID
    const currentUid = userProfile?.uid || userProfile?.id;
    const targetUid = targetUser.uid || targetUser.id;

    // Admin cannot modify themselves
    if (currentUid && currentUid === targetUid) return false;

    // Target is superAdmin
    if (targetUser.role === 'superAdmin') {
      // Only superAdmin can modify another superAdmin (if not self)
      return isSuperAdmin;
    }

    // Normal admin can modify regular customers or other admins
    return true;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-rose-600" />
            User Management Hub
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage registered website members, search customer records, promote administrators, and manage account statuses.
          </p>
        </div>

        <button 
          onClick={loadData} 
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 rounded-full text-xs font-bold text-gray-700 shadow-sm hover:bg-rose-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-600 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-rose-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Registered</span>
            <span className="font-serif-title font-bold text-2xl text-gray-900">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Administrators</span>
            <span className="font-serif-title font-bold text-2xl text-rose-600">{adminCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Banned Accounts</span>
            <span className="font-serif-title font-bold text-2xl text-amber-600">{bannedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email address, or phone number..."
            className="w-full pl-10 pr-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-rose-100 space-y-3">
          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-600">Loading user registry...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        /* Empty / No Results State */
        <div className="glass-card rounded-3xl p-12 text-center border border-rose-100 space-y-3">
          <UserX className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-serif-title font-bold text-lg text-gray-800">
            {searchQuery ? 'No Matching Users Found' : 'User Registry Empty'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery ? `No users match "${searchQuery}". Try searching with a different name, email, or phone number.` : 'There are currently no registered users in the platform.'}
          </p>
        </div>
      ) : (
        /* Content List - Desktop Table & Mobile Cards */
        <div className="space-y-4">
          
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block glass-card rounded-3xl p-6 border border-rose-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-rose-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Profile</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Joined</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filteredUsers.map((u) => {
                  const isUserAdmin = u.role === 'admin' || u.role === 'superAdmin';
                  const isUserBanned = u.status === 'banned';
                  const isSelf = (userProfile?.uid || userProfile?.id) === (u.uid || u.id);
                  const canAct = canModifyUser(u);

                  return (
                    <tr key={u.id || u.uid} className="hover:bg-rose-50/40 transition">
                      
                      {/* Avatar */}
                      <td className="py-3.5 px-3">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.displayName} className="w-8 h-8 rounded-full object-cover border border-rose-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                            {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-3 font-bold text-gray-900">
                        {u.displayName || u.name || 'Anonymous User'}
                        {isSelf && <span className="ml-1 text-[10px] text-rose-500 font-semibold">(You)</span>}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-3 text-gray-600 font-mono text-[11px]">{u.email}</td>

                      {/* Phone */}
                      <td className="py-3.5 px-3 text-gray-600">{u.phone || u.phoneNumber || 'N/A'}</td>

                      {/* Role */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'superAdmin'
                            ? 'bg-purple-600 text-white'
                            : u.role === 'admin'
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role === 'superAdmin' && <Shield className="w-3 h-3" />}
                          {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          <span>{u.role || 'customer'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isUserBanned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUserBanned ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <span>{isUserBanned ? 'Banned' : 'Active'}</span>
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-3 text-gray-500 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Make Admin Button */}
                          {!isUserAdmin && canAct && (
                            <button
                              onClick={() => setModalConfig({ type: 'promote', user: u })}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Make Admin</span>
                            </button>
                          )}

                          {/* Ban / Unban Button */}
                          {canAct && (
                            isUserBanned ? (
                              <button
                                onClick={() => setModalConfig({ type: 'unban', user: u })}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Unban</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setModalConfig({ type: 'ban', user: u })}
                                className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Ban</span>
                              </button>
                            )
                          )}

                          {!canAct && (
                            <span className="text-[10px] text-gray-400 italic">Protected</span>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {filteredUsers.map((u) => {
              const isUserAdmin = u.role === 'admin' || u.role === 'superAdmin';
              const isUserBanned = u.status === 'banned';
              const isSelf = (userProfile?.uid || userProfile?.id) === (u.uid || u.id);
              const canAct = canModifyUser(u);

              return (
                <div key={u.id || u.uid} className="glass-card rounded-2xl p-5 border border-rose-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full object-cover border border-rose-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm">
                          {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif-title font-bold text-sm text-gray-900 flex items-center gap-1">
                          {u.displayName || u.name || 'Anonymous User'}
                          {isSelf && <span className="text-[10px] text-rose-500">(You)</span>}
                        </h4>
                        <span className="text-xs text-gray-500 block truncate">{u.email}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isUserBanned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isUserBanned ? 'Banned' : 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-rose-50/50 rounded-xl p-3">
                    <div>
                      <span className="text-gray-400 block font-medium">Role</span>
                      <span className="font-bold text-gray-800 capitalize">{u.role || 'customer'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Phone</span>
                      <span className="font-bold text-gray-800">{u.phone || u.phoneNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Joined Date</span>
                      <span className="text-gray-700">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-100">
                    {!isUserAdmin && canAct && (
                      <button
                        onClick={() => setModalConfig({ type: 'promote', user: u })}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition"
                      >
                        Make Admin
                      </button>
                    )}

                    {canAct && (
                      isUserBanned ? (
                        <button
                          onClick={() => setModalConfig({ type: 'unban', user: u })}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition"
                        >
                          Unban User
                        </button>
                      ) : (
                        <button
                          onClick={() => setModalConfig({ type: 'ban', user: u })}
                          className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-600 hover:text-white transition"
                        >
                          Ban User
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                modalConfig.type === 'promote'
                  ? 'bg-purple-100 text-purple-700'
                  : modalConfig.type === 'ban'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {modalConfig.type === 'promote' && <ShieldCheck className="w-6 h-6" />}
                {modalConfig.type === 'ban' && <AlertTriangle className="w-6 h-6" />}
                {modalConfig.type === 'unban' && <CheckCircle2 className="w-6 h-6" />}
              </div>

              <div>
                <h3 className="font-serif-title font-bold text-lg text-gray-900">
                  {modalConfig.type === 'promote' && 'Promote User to Admin'}
                  {modalConfig.type === 'ban' && 'Ban User Account'}
                  {modalConfig.type === 'unban' && 'Unban User Account'}
                </h3>
                <p className="text-xs text-gray-500">{modalConfig.user.displayName || modalConfig.user.email}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-2xl">
              {modalConfig.type === 'promote' && 'Are you sure you want to make this user an Admin?'}
              {modalConfig.type === 'ban' && 'Are you sure you want to ban this user?'}
              {modalConfig.type === 'unban' && 'Are you sure you want to unban this user?'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalConfig(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              {modalConfig.type === 'promote' && (
                <button
                  onClick={() => handlePromoteConfirm(modalConfig.user)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow-md transition"
                >
                  Confirm Promote
                </button>
              )}

              {modalConfig.type === 'ban' && (
                <button
                  onClick={() => handleBanConfirm(modalConfig.user)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 shadow-md transition"
                >
                  Confirm Ban
                </button>
              )}

              {modalConfig.type === 'unban' && (
                <button
                  onClick={() => handleUnbanConfirm(modalConfig.user)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md transition"
                >
                  Confirm Unban
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
