"use client";

import React, { useState } from "react";
import { Eye, Edit3, ShoppingBag, Search, CreditCard, Clock, Check, X, ShieldAlert, RotateCcw, Lock } from "lucide-react";
import { useAppState, Order } from "@/context/StateContext";
import { useHasPermission } from "@/lib/permissions";

// Maps each status to the status directly before it, so we know what
// "undo" should revert to. Statuses not listed here have no previous step.
const PREVIOUS_STATUS: Partial<Record<Order["status"], Order["status"]>> = {
  "Confirmed": "Pending",
  "Baking/Decorating": "Confirmed",
  "Ready for Dispatch": "Baking/Decorating",
  "Delivered": "Ready for Dispatch",
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAppState();

  const canReadOrder = useHasPermission("orders", "read");
  const canUpdateOrder = useHasPermission("orders", "update");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Status lists
  const statusFilters = ["All", "Pending", "Confirmed", "Baking/Decorating", "Ready for Dispatch", "Delivered", "Completed", "Cancelled"];

  if (!canReadOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="text-sm font-black text-slate-700">You don't have access to this page</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Your role doesn't include permission to view Orders. Contact an administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  // Safe display helper — falls back gracefully if a customer name was
  // never captured (e.g. an old/guest order that skipped the field),
  // instead of rendering blank or crashing on .toLowerCase().
  const getCustomerDisplayName = (order: Order) => {
    return order.customerName?.trim() || order.customerEmail?.trim() || "Guest Customer";
  };

  // Filter and sort orders (recent first)
  const filteredOrders = orders
    .filter((order) => {
      const customerDisplay = getCustomerDisplayName(order);
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerPhone || "").includes(searchTerm);
      const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Baking/Decorating":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Ready for Dispatch":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Delivered":
      case "Completed":
        return "bg-green-50 text-green-700 border-green-100";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const handleOpenDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleStatusChange = (id: string, status: Order["status"]) => {
    if (!canUpdateOrder) return;
    const paymentStatus = (status === "Delivered" || status === "Completed") ? "Paid" as const : undefined;
    updateOrderStatus(id, status, paymentStatus);
    
    // Update local state if modal is open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({
        ...selectedOrder,
        status,
        ...(paymentStatus ? { paymentStatus } : {})
      });
    }
  };

  // Reverts an order to the status immediately before its current one.
  // Also clears paymentStatus back to Unpaid if we're undoing out of
  // Delivered, since that's the step that auto-marked it Paid.
  const handleUndoStatus = (id: string, currentStatus: Order["status"]) => {
    if (!canUpdateOrder) return;
    const previous = PREVIOUS_STATUS[currentStatus];
    if (!previous) return;

    const paymentStatus = currentStatus === "Delivered" ? ("Unpaid" as const) : undefined;
    updateOrderStatus(id, previous, paymentStatus);

    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({
        ...selectedOrder,
        status: previous,
        ...(paymentStatus ? { paymentStatus } : {})
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Order Management</h1>
        <p className="text-slate-500 text-xs mt-0.5">Manage customer orders, track delivery dates, and update baking status.</p>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search order ID, customer name..."
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

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Delivery Date</th>
                <th className="px-6 py-4">Total Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-purple-700">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-800 block">{getCustomerDisplayName(order)}</span>
                        <span className="text-[10px] text-slate-400">{order.customerPhone || "No phone on file"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold block text-slate-800">{order.deliveryDate}</span>
                        <span className="text-[10px] text-slate-400">Slot: {order.deliveryTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      Rs. {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetailModal(order)}
                          className="p-1.5 bg-purple-50 text-purple-700 hover:bg-[#9D5CDB] hover:text-white rounded-lg transition"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <span>No orders found matching your search.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {detailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setDetailModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white border border-purple-100 rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 z-10">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>Order Details</span>
                  <span className="text-[#9D5CDB]">{selectedOrder.id}</span>
                </h3>
                <p className="text-[10px] text-slate-400">Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Customer Details</h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong className="text-slate-800">Name:</strong> {getCustomerDisplayName(selectedOrder)}</p>
                  <p><strong className="text-slate-800">Phone:</strong> {selectedOrder.customerPhone || "Not provided"}</p>
                  <p><strong className="text-slate-800">Email:</strong> {selectedOrder.customerEmail || "Not provided"}</p>
                  <p><strong className="text-slate-800">Address:</strong> {selectedOrder.deliveryAddress || "Not provided"}</p>
                  <p><strong className="text-slate-800">Region:</strong> {selectedOrder.deliveryRegion || "Not provided"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Delivery Slot Details</h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong className="text-slate-800">Scheduled Date:</strong> {selectedOrder.deliveryDate}</p>
                  <p>
                    <strong className="text-slate-800">Time Slot:</strong>{" "}
                    {selectedOrder.deliveryTime === "10:00" ? "Morning (10am-12pm)" : 
                     selectedOrder.deliveryTime === "14:00" ? "Afternoon (2pm-4pm)" : 
                     "Evening (6pm-8pm)"}
                  </p>
                  <p>
                    <strong className="text-slate-800">Status: </strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p>
                    <strong className="text-slate-800">Payment: </strong>
                    <span className="font-semibold text-[#f59e0b]">{selectedOrder.paymentMethod}</span> (
                    <span className="font-bold text-slate-700">{selectedOrder.paymentStatus}</span>)
                  </p>
                </div>
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="border border-purple-50 rounded-2xl overflow-hidden bg-purple-50/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-purple-50 text-purple-700 font-bold border-b border-purple-100">
                    <th className="px-4 py-2.5">Item Name</th>
                    <th className="px-4 py-2.5">Customization</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/50 font-medium text-slate-700">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold text-slate-800">{item.product.name}</td>
                      <td className="px-4 py-3 text-slate-500">
                        <div className="space-y-0.5 text-[10px]">
                          <p>Size: {item.selectedSize}</p>
                          <p>Flavour: {item.selectedFlavour}</p>
                          {item.customMessage && (
                            <p className="text-amber-600 font-bold italic">Msg: "{item.customMessage}"</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing math */}
            <div className="border-t border-slate-100 pt-4 flex flex-col items-end text-xs space-y-1">
              <p className="text-slate-500">Subtotal: <span className="font-semibold text-slate-800">Rs. {(selectedOrder.totalPrice - selectedOrder.deliveryFee).toLocaleString()}</span></p>
              <p className="text-slate-500">Delivery Fee: <span className="font-semibold text-slate-800">Rs. {selectedOrder.deliveryFee.toLocaleString()}</span></p>
              <p className="text-sm font-bold text-slate-800">Grand Total: <span className="text-[#2F0538] font-black text-base">Rs. {selectedOrder.totalPrice.toLocaleString()}</span></p>
            </div>

            {selectedOrder.orderNotes && (
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-amber-800 block">Order Notes:</span>
                <p className="text-slate-600 leading-relaxed italic">"{selectedOrder.orderNotes}"</p>
              </div>
            )}

            {/* Action State transitions */}
            {canUpdateOrder && (
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Advance Order Status</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === "Pending" && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "Confirmed")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                    >
                      Confirm Order
                    </button>
                  )}
                  {selectedOrder.status === "Confirmed" && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "Baking/Decorating")}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                    >
                      Start Baking
                    </button>
                  )}
                  {selectedOrder.status === "Baking/Decorating" && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "Ready for Dispatch")}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                    >
                      Mark Ready for Dispatch
                    </button>
                  )}
                  {selectedOrder.status === "Ready for Dispatch" && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "Delivered")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                    >
                      Mark Delivered & Completed
                    </button>
                  )}

                  {/* Undo button — reverts to the previous status in the flow.
                      Hidden when there's no previous step (Pending) or when
                      the order is Completed/Cancelled, since those are terminal. */}
                  {PREVIOUS_STATUS[selectedOrder.status] && (
                    <button
                      onClick={() => handleUndoStatus(selectedOrder.id, selectedOrder.status)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Undo (Back to {PREVIOUS_STATUS[selectedOrder.status]})
                    </button>
                  )}

                  {selectedOrder.status !== "Completed" && selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "Cancelled")}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition ml-auto"
                    >
                      Cancel Order
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