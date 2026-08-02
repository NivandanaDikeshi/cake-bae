"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Users, Search, X, AlertTriangle } from "lucide-react";
import { useAppState, User } from "@/context/StateContext";

export default function AdminUsersPage() {
  const { users, roles, addUser, updateUser, deleteUser } = useAppState();

  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id || "");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // This page is for STAFF logins only. Customers who sign up on the
  // storefront get roleId "customer" (or have no matching entry in the
  // `roles` collection at all), which isn't a staff role — so they must
  // never appear in this table. Without this filter they'd show up with
  // their role badge reading "Unknown", since getRoleName() can't find
  // a "customer" role among the staff roles list.
  const staffUsers = users.filter((u) => u.roleId !== "customer" && roles.some((r) => r.id === u.roleId));

  const filteredUsers = staffUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleName = (roleId: string) => {
    if (roleId === "customer") return "Customer";
    return roles.find((r) => r.id === roleId)?.name || "Unassigned Role";
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRoleId(roles[0]?.id || "");
    setStatus("Active");
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRoleId(user.roleId);
    setStatus(user.status);
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !roleId) {
      setError("Please fill out Name, Email, and select a Role.");
      return;
    }

    if (!editingId && (!password || password.length < 6)) {
      setError("Please enter a password of at least 6 characters for the new user.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      roleId,
      status
    };

    try {
      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await addUser(payload, password);
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save user. Please check if email is valid and not already registered.");
    }
  };

  // Open the confirmation modal instead of deleting immediately
  const handleRequestDelete = (user: User) => {
    setDeleteTarget(user);
    setDeleteError(null);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return; // don't allow closing mid-request
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      setDeleteError(err?.message || "Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Staff Management</h1>
          <p className="text-slate-500 text-xs mt-0.5">Add, edit, or terminate staff user logins and control role bindings.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold text-xs rounded-xl shadow-md transition h-fit w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Profile</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-850">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-md uppercase text-[10px]">
                        {getRoleName(u.roleId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        u.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit staff details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(u)}
                          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition"
                          title="Remove staff member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <span>No staff members found.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpen(false)}></div>
          <form
            onSubmit={handleSubmit}
            className="relative bg-white border border-purple-100 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl space-y-6 z-10"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Staff User" : "Add Staff User"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="kasun@cakebae.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {!editingId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Login Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assign Role Profile *</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">User Login Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="Active">Active / Access Granted</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <div className="border-t border-slate-100 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-purple-100 text-slate-600 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                {editingId ? "Save Changes" : "Register User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={handleCancelDelete}
          ></div>
          <div className="relative bg-white border border-red-100 rounded-3xl w-full max-w-sm p-6 sm:p-8 shadow-2xl space-y-5 z-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Remove Staff Member?</h3>
              <p className="text-xs text-slate-500">
                You're about to permanently remove{" "}
                <span className="font-bold text-slate-700">{deleteTarget.name}</span>{" "}
                ({deleteTarget.email}) and revoke their login access. This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <p className="text-xs text-red-500 font-bold text-center">{deleteError}</p>
            )}

            <div className="border-t border-slate-100 pt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-purple-100 text-slate-600 font-bold rounded-xl text-xs disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Yes, Remove User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}