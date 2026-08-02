"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useHasPermission } from "@/lib/permissions";
import { Lock } from "lucide-react";
import {
  Eye,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  RotateCcw,
  X,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: "New" | "Replied";
  createdAt?: { toDate: () => Date };
}

// Same number-cleaning logic Cake Bae uses for WhatsApp — country code, digits only
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0")) return "94" + digits.slice(1);
  return digits;
}

export default function AdminMessagesPage() {
  const canReadMessage = useHasPermission("messages", "read");
  const canUpdateMessage = useHasPermission("messages", "update");

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const statusFilters = ["All", "New", "Replied"];

  useEffect(() => {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            name: data.name,
            email: data.email ?? null,
            phone: data.phone ?? null,
            message: data.message,
            // normalize old lowercase "new"/"replied" values from earlier version
            status: data.status === "replied" || data.status === "Replied" ? "Replied" : "New",
            createdAt: data.createdAt,
          } as ContactMessage;
        })
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getStatusBadgeClass = (status: ContactMessage["status"]) => {
    switch (status) {
      case "New":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Replied":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.phone || "").includes(searchTerm) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || msg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetailModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setDetailModalOpen(true);
  };

  // Toggles between "New" and "Replied" for the given message id/current status
  const toggleReplied = async (id: string, currentStatus: ContactMessage["status"]) => {
    if (!canUpdateMessage) return;
    const nextStatus: ContactMessage["status"] = currentStatus === "Replied" ? "New" : "Replied";
    await updateDoc(doc(db, "contactMessages", id), { status: nextStatus });
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: nextStatus });
    }
  };

  const replyOnWhatsApp = (msg: ContactMessage) => {
    if (!msg.phone) return;
    const number = toWhatsAppNumber(msg.phone);
    const text = encodeURIComponent(
      `Hi ${msg.name}, thanks for reaching out to Cake Bae! Regarding your message: "${msg.message}" — `
    );
    window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer");
    // Opening WhatsApp still marks it as replied; use the toggle button afterward if you need to undo it
    if (msg.status !== "Replied" && canUpdateMessage) {
      toggleReplied(msg.id, msg.status);
    }
  };

  if (!canReadMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="text-sm font-black text-slate-700">You don't have access to this page</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Your role doesn't include permission to view Customer Messages. Contact an administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Customer Messages</h1>
        <p className="text-slate-500 text-xs mt-0.5">Messages sent from the FAQ / contact form, and replies sent over WhatsApp.</p>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search name, email, phone, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
                selectedStatus === status
                  ? "bg-[#4A1054] border-[#4A1054] text-white shadow-xs"
                  : "bg-white border-purple-50 text-slate-600 hover:bg-purple-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Received</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{msg.name}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        {msg.email && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {msg.email}
                          </span>
                        )}
                        {msg.phone && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {msg.phone}
                          </span>
                        )}
                        {!msg.email && !msg.phone && (
                          <span className="text-[10px] text-slate-400">No contact info</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span className="line-clamp-1 text-slate-600">{msg.message}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] text-slate-500">
                        {msg.createdAt ? msg.createdAt.toDate().toLocaleString() : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusBadgeClass(msg.status)}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetailModal(msg)}
                          className="p-1.5 bg-purple-50 text-purple-700 hover:bg-[#9D5CDB] hover:text-white rounded-lg transition"
                          title="View message details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <span>No messages found matching your search.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {detailModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setDetailModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white border border-purple-100 rounded-3xl w-full max-w-lg p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 z-10">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>Message from</span>
                  <span className="text-[#9D5CDB]">{selectedMessage.name}</span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Received: {selectedMessage.createdAt ? selectedMessage.createdAt.toDate().toLocaleString() : "—"}
                </p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Contact Details</h4>
              <div className="space-y-1 text-slate-600">
                <p><strong className="text-slate-800">Name:</strong> {selectedMessage.name}</p>
                <p><strong className="text-slate-800">Email:</strong> {selectedMessage.email || "Not provided"}</p>
                <p><strong className="text-slate-800">Phone:</strong> {selectedMessage.phone || "Not provided"}</p>
                <p>
                  <strong className="text-slate-800">Status: </strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-purple-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Message:
              </span>
              <p className="text-slate-600 leading-relaxed italic">"{selectedMessage.message}"</p>
            </div>

            {/* Actions */}
            {canUpdateMessage && (
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMessage.phone && (
                    <button
                      onClick={() => replyOnWhatsApp(selectedMessage)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Reply on WhatsApp
                    </button>
                  )}

                  {selectedMessage.status === "New" ? (
                    <button
                      onClick={() => toggleReplied(selectedMessage.id, selectedMessage.status)}
                      className="px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Replied
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleReplied(selectedMessage.id, selectedMessage.status)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Undo (Mark as New)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}