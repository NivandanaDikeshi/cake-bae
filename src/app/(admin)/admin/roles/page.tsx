"use client";

import React, { useState } from "react";
import { Plus, Eye, Key, Edit, Trash2, X, ShieldAlert, Check } from "lucide-react";
import { useAppState, Role } from "@/context/StateContext";

const PERMISSION_ACTIONS = ["create", "read", "update", "delete", "export"];

export default function AdminRolesPage() {
  const { roles, addRole, updateRole, deleteRole } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields state
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [isAdminPrivileges, setIsAdminPrivileges] = useState(false);
  const [permissions, setPermissions] = useState<Role["permissions"]>({
    dashboard: ["read"],
    products: ["read"],
    orders: ["read"],
    customers: ["read"],
    calendar: ["read"],
    roles: [],
    reports: []
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setStatus("Active");
    setIsAdminPrivileges(false);
    setPermissions({
      dashboard: ["read"],
      products: ["read"],
      orders: ["read"],
      customers: ["read"],
      calendar: ["read"],
      roles: [],
      reports: []
    });
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingId(role.id);
    setName(role.name);
    setStatus(role.status);
    setIsAdminPrivileges(role.isAdminPrivileges);
    setPermissions(role.permissions);
    setError(null);
    setIsOpen(true);
  };

  const handlePermissionChange = (module: keyof Role["permissions"], action: string, checked: boolean) => {
    const updatedModulePerms = [...permissions[module]];
    if (checked) {
      if (!updatedModulePerms.includes(action)) {
        updatedModulePerms.push(action);
      }
    } else {
      const idx = updatedModulePerms.indexOf(action);
      if (idx > -1) {
        updatedModulePerms.splice(idx, 1);
      }
    }

    setPermissions({
      ...permissions,
      [module]: updatedModulePerms,
    });
  };

  const handleSelectAllModule = (module: keyof Role["permissions"], checked: boolean) => {
    setPermissions({
      ...permissions,
      [module]: checked ? [...PERMISSION_ACTIONS] : [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please input a valid role name.");
      return;
    }

    const payload = {
      name: name.trim(),
      status,
      isAdminPrivileges,
      permissions
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateRole(editingId, payload);
      } else {
        await addRole(payload);
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
        <span>FMS</span>
        <span>&gt;</span>
        <span>Roles</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Roles & Permissions</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage system roles and assign granular permissions.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Permissions</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#2F0538] hover:bg-[#4A1054] text-white font-bold text-xs rounded-xl shadow-md transition h-fit w-fit"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Roles list table matching Screenshot 1 */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="px-6 py-4">Role Name</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{role.name}</span>
                        {role.isSystem && (
                          <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 text-[8px] font-black flex items-center justify-center" title="System defined role">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 mt-1 text-[9px] font-bold uppercase">
                        <span className="text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">SYSTEM</span>
                        <span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                          {role.isAdminPrivileges ? "SUPER ADMIN" : "ADMIN"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-bold">
                    {role.isAdminPrivileges ? "All Permissions" : `${role.permissionCount ?? 0} actions`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                      role.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                        title="View role details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="p-1.5 text-slate-400 hover:text-[#9D5CDB] hover:bg-purple-50 rounded-lg transition"
                        title="Configure permissions"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                        title="Edit name"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete custom role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Role Modal matching Screenshot 3 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpen(false)}></div>
          
          <form
            onSubmit={handleSubmit}
            className="relative bg-white border border-purple-100 rounded-3xl w-full max-w-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {editingId ? "Edit Role" : "Add Role"}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {editingId ? "Modify roles and system privileges." : "Create a new role for system users."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Branch Manager"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
                />
              </div>

              {/* Status and Super Admin toggles */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status Toggle */}
                <div className="border border-purple-50 rounded-2xl p-4 bg-purple-50/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Status</span>
                    <span className="text-[9px] text-slate-400">Determine if role is active</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
                    className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                      status === "Active" ? "bg-green-600 justify-end" : "bg-slate-300 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                {/* Admin Privileges Toggle */}
                <div className="border border-purple-50 rounded-2xl p-4 bg-purple-50/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Admin Privileges</span>
                    <span className="text-[9px] text-slate-400">Grant admin system access</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdminPrivileges(!isAdminPrivileges)}
                    className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                      isAdminPrivileges ? "bg-green-600 justify-end" : "bg-slate-300 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>
              </div>

              {/* Granular Permissions Section */}
              {!isAdminPrivileges && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700">Permissions</h4>
                  <p className="text-[10px] text-slate-400">Select the features this role can access.</p>

                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                    {/* Permissions list per module */}
                    {(["products", "orders", "customers", "calendar"] as const).map((module) => {
                      const moduleLabel = module.charAt(0).toUpperCase() + module.slice(1);
                      const isAllChecked = PERMISSION_ACTIONS.every(action => permissions[module]?.includes(action));
                      
                      return (
                        <div key={module} className="border border-purple-50 rounded-2xl p-4 bg-white space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-800">{moduleLabel}</span>
                            <button
                              type="button"
                              onClick={() => handleSelectAllModule(module, !isAllChecked)}
                              className="text-[10px] font-bold text-purple-600 hover:text-purple-900"
                            >
                              {isAllChecked ? "Deselect All" : "Select All"}
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {PERMISSION_ACTIONS.map((action) => {
                              const isChecked = permissions[module]?.includes(action) || false;
                              return (
                                <label key={action} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                                    className="rounded border-purple-200 text-purple-600 focus:ring-purple-500/20 w-4 h-4 cursor-pointer"
                                  />
                                  <span className="capitalize">{action}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            {/* Footer Buttons */}
            <div className="border-t border-slate-100 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 border border-purple-100 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#2F0538] hover:bg-[#4A1054] text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}