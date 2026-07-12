"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db as firebaseDb } from "@/lib/firebase";
const db = firebaseDb as any;
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch
} from "firebase/firestore";

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // LKR
  category: string;
  image: string;
  sizes: string[];
  flavours: string[];
  leadTime: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedFlavour: string;
  customMessage: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryRegion: string;
  deliveryFee: number;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: "COD" | "Card";
  paymentStatus: "Unpaid" | "Paid";
  orderNotes?: string;
  items: CartItem[];
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Baking/Decorating" | "Ready for Dispatch" | "Delivered" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  isAdminPrivileges: boolean;
  permissions: {
    dashboard: string[];
    products: string[];
    orders: string[];
    customers: string[];
    calendar: string[];
    roles: string[];
    reports: string[];
  };
  isSystem?: boolean;
  permissionCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

interface StateContextType {
  products: Product[];
  categories: string[];
  orders: Order[];
  roles: Role[];
  users: User[];
  cart: CartItem[];
  currentUser: User | null;
  currentRole: Role | null;
  // Cart Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // Product Actions
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Order Actions
  placeOrder: (orderData: Omit<Order, "id" | "status" | "createdAt">) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => Promise<void>;
  // Role Actions
  addRole: (role: Omit<Role, "id" | "permissionCount">) => Promise<void>;
  updateRole: (id: string, updatedRole: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  // User Actions
  addUser: (user: Omit<User, "id" | "createdAt">) => Promise<void>;
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  // Auth
  login: (email: string, roleName: string) => boolean;
  logout: () => void;
  // Settings/Cloudinary
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  setCloudinaryConfig: (name: string, preset: string) => void;
  // Availability Block Out Dates
  blockedDates: string[];
  toggleBlockedDate: (date: string) => Promise<void>;
  isFirebaseActive: boolean;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

// Initial mock data
const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Chocolate Fudge Gateau",
    description: "Rich layered chocolate sponge with luscious chocolate fudge and dark chocolate ganache drip. An all-time Sri Lankan favorite.",
    price: 4500,
    category: "Celebration Cakes",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/chocolate_gateau.jpg",
    sizes: ["500g", "1kg", "1.5kg", "2kg"],
    flavours: ["Chocolate Fudge", "Double Chocolate", "Mocha Chocolate"],
    leadTime: "24 Hours",
    rating: 4.9,
  },
  {
    id: "p2",
    name: "Classic Ribbon Cake",
    description: "Traditional Sri Lankan ribbon cake with moist, multi-colored layers sandwiched with rich butter cream icing.",
    price: 3600,
    category: "Celebration Cakes",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/ribbon_cake.jpg",
    sizes: ["500g", "1kg", "1.5kg", "2kg"],
    flavours: ["Vanilla & Almond", "Classic Buttercream"],
    leadTime: "24 Hours",
    rating: 4.8,
  },
  {
    id: "p3",
    name: "Red Velvet Dream",
    description: "Stunning crimson velvet cake layers with smooth, velvety cream cheese frosting and sweet white chocolate crumbs.",
    price: 5200,
    category: "Celebration Cakes",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/red_velvet.jpg",
    sizes: ["1kg", "2kg"],
    flavours: ["Cream Cheese Velvet", "Chocolate Red Velvet"],
    leadTime: "48 Hours",
    rating: 5.0,
  },
  {
    id: "p4",
    name: "Assorted Cupcake Box",
    description: "Box of 6 artisan cupcakes, including chocolate lava, red velvet cream cheese, and caramel vanilla crumble.",
    price: 2400,
    category: "Cupcakes",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/cupcakes.jpg",
    sizes: ["Box of 6", "Box of 12"],
    flavours: ["Assorted Mix", "All Chocolate", "All Red Velvet"],
    leadTime: "12 Hours",
    rating: 4.7,
  },
  {
    id: "p5",
    name: "Korean Bento Box Cake",
    description: "Cute minimalist Korean-style bento cake. Perfect for birthdays and small celebrations. Includes customized text.",
    price: 2800,
    category: "Bento Cakes",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/bento_cake.jpg",
    sizes: ["Mini (approx. 350g)"],
    flavours: ["Chocolate Fudge", "Classic Vanilla", "Strawberry Cream"],
    leadTime: "24 Hours",
    rating: 4.9,
  },
  {
    id: "p6",
    name: "Double Fudgy Brownie Tray",
    description: "Rich, dense chocolate brownies with a crackly top, loaded with real dark chocolate chunks and roasted walnuts.",
    price: 2900,
    category: "Desserts",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/brownies.jpg",
    sizes: ["Tray of 9 pcs", "Tray of 16 pcs"],
    flavours: ["Double Chocolate Fudgy", "Salted Caramel Drizzle"],
    leadTime: "24 Hours",
    rating: 4.8,
  },
  {
    id: "p7",
    name: "Lotus Biscoff Cheesecake Slice",
    description: "Creamy baked cheesecake with a Lotus Biscoff biscuit crust, topped with generous speculoos cookie butter spread.",
    price: 980,
    category: "Desserts",
    image: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/cheesecake.jpg",
    sizes: ["Single Slice", "Whole Cake (1.5kg)"],
    flavours: ["Lotus Biscoff Cream", "Blueberry Baked Cheese"],
    leadTime: "24 Hours",
    rating: 4.9,
  }
];

const initialRoles: Role[] = [
  {
    id: "r-superadmin",
    name: "Super Admin",
    status: "Active",
    isAdminPrivileges: true,
    isSystem: true,
    permissionCount: 30,
    permissions: {
      dashboard: ["read"],
      products: ["create", "read", "update", "delete"],
      orders: ["create", "read", "update", "delete"],
      customers: ["create", "read", "update", "delete"],
      calendar: ["create", "read", "update", "delete"],
      roles: ["create", "read", "update", "delete"],
      reports: ["read"]
    }
  },
  {
    id: "r-admin",
    name: "Admin",
    status: "Active",
    isAdminPrivileges: false,
    isSystem: true,
    permissionCount: 22,
    permissions: {
      dashboard: ["read"],
      products: ["create", "read", "update", "delete"],
      orders: ["create", "read", "update", "delete"],
      customers: ["create", "read", "update", "delete"],
      calendar: ["create", "read", "update", "delete"],
      roles: ["read"],
      reports: ["read"]
    }
  },
  {
    id: "r-branchmanager",
    name: "Branch Manager",
    status: "Active",
    isAdminPrivileges: false,
    permissionCount: 15,
    permissions: {
      dashboard: ["read"],
      products: ["read"],
      orders: ["create", "read", "update"],
      customers: ["create", "read", "update"],
      calendar: ["create", "read", "update", "delete"],
      roles: [],
      reports: []
    }
  },
  {
    id: "r-operator",
    name: "Operator",
    status: "Active",
    isAdminPrivileges: false,
    isSystem: true,
    permissionCount: 8,
    permissions: {
      dashboard: ["read"],
      products: ["read"],
      orders: ["read", "update"],
      customers: ["read"],
      calendar: ["read", "update"],
      roles: [],
      reports: []
    }
  },
  {
    id: "r-pumpoperator",
    name: "Pump Operator",
    status: "Active",
    isAdminPrivileges: false,
    permissionCount: 4,
    permissions: {
      dashboard: ["read"],
      products: ["read"],
      orders: ["read"],
      customers: [],
      calendar: [],
      roles: [],
      reports: []
    }
  }
];

const initialUsers: User[] = [
  {
    id: "u-1",
    name: "Savi Wijayalath",
    email: "savi.wijayalath@cakebae.lk",
    roleId: "r-superadmin",
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-2",
    name: "Kasun Perera",
    email: "kasun@cakebae.lk",
    roleId: "r-admin",
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-3",
    name: "Dilini Fernando",
    email: "dilini@cakebae.lk",
    roleId: "r-branchmanager",
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-4",
    name: "Nimal Silva",
    email: "nimal@cakebae.lk",
    roleId: "r-operator",
    status: "Active",
    createdAt: new Date().toISOString(),
  }
];

const initialOrders: Order[] = [
  {
    id: "CB-1001",
    customerName: "Niwan Dikeshi",
    customerPhone: "0771234567",
    customerEmail: "niwandikeshi@gmail.com",
    deliveryAddress: "No. 45, Flower Road, Colombo 07",
    deliveryRegion: "Colombo 1-15 (Fort, Borella, Havelock, etc.)",
    deliveryFee: 350,
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    deliveryTime: "14:00",
    paymentMethod: "COD",
    paymentStatus: "Unpaid",
    orderNotes: "Please write 'Happy Birthday Niwan!' in pink icing.",
    items: [
      {
        product: initialProducts[0],
        quantity: 1,
        selectedSize: "1kg",
        selectedFlavour: "Chocolate Fudge",
        customMessage: "Happy Birthday Niwan!"
      }
    ],
    totalPrice: 4850,
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<string[]>(["Celebration Cakes", "Cupcakes", "Bento Cakes", "Desserts"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState<string>("dzxuzqg5g");
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState<string>("cakebae_unsigned");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const isFirebaseActive = !!db;

  // Load from database / local storage
  useEffect(() => {
    const loadState = async () => {
      if (typeof window === "undefined") return;

      const storedCart = localStorage.getItem("cb_cart");
      const storedUser = localStorage.getItem("cb_currentUser");
      const storedCloudName = localStorage.getItem("cb_cloud_name");
      const storedPreset = localStorage.getItem("cb_upload_preset");

      setCart(storedCart ? JSON.parse(storedCart) : []);
      if (storedCloudName) setCloudinaryCloudName(storedCloudName);
      if (storedPreset) setCloudinaryUploadPreset(storedPreset);

      if (db) {
        try {
          // 1. Load Products from Firestore
          const productsSnap = await getDocs(collection(db, "products"));
          const productsData: Product[] = [];
          productsSnap.forEach((doc) => {
            productsData.push({ id: doc.id, ...doc.data() } as Product);
          });
          
          // Seed database if empty
          if (productsData.length === 0) {
            console.log("Seeding Firestore products...");
            const batch = writeBatch(db);
            initialProducts.forEach((p) => {
              const pRef = doc(collection(db, "products"), p.id);
              batch.set(pRef, { ...p, id: undefined });
            });
            await batch.commit();
            setProducts(initialProducts);
          } else {
            setProducts(productsData);
          }

          // 2. Load Roles from Firestore
          const rolesSnap = await getDocs(collection(db, "roles"));
          const rolesData: Role[] = [];
          rolesSnap.forEach((doc) => {
            rolesData.push({ id: doc.id, ...doc.data() } as Role);
          });

          if (rolesData.length === 0) {
            console.log("Seeding Firestore roles...");
            const batch = writeBatch(db);
            initialRoles.forEach((r) => {
              const rRef = doc(collection(db, "roles"), r.id);
              batch.set(rRef, { ...r, id: undefined });
            });
            await batch.commit();
            setRoles(initialRoles);
          } else {
            setRoles(rolesData);
          }

          // 3. Load Users from Firestore
          const usersSnap = await getDocs(collection(db, "users"));
          const usersData: User[] = [];
          usersSnap.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() } as User);
          });

          if (usersData.length === 0) {
            const batch = writeBatch(db);
            initialUsers.forEach((u) => {
              const uRef = doc(collection(db, "users"), u.id);
              batch.set(uRef, { ...u, id: undefined });
            });
            await batch.commit();
            setUsers(initialUsers);
          } else {
            setUsers(usersData);
          }

          // 4. Load Orders from Firestore
          const ordersSnap = await getDocs(collection(db, "orders"));
          const ordersData: Order[] = [];
          ordersSnap.forEach((doc) => {
            ordersData.push({ id: doc.id, ...doc.data() } as Order);
          });

          if (ordersData.length === 0) {
            const batch = writeBatch(db);
            initialOrders.forEach((o) => {
              const oRef = doc(collection(db, "orders"), o.id);
              batch.set(oRef, { ...o, id: undefined });
            });
            await batch.commit();
            setOrders(initialOrders);
          } else {
            setOrders(ordersData);
          }

          // 5. Load settings (Blocked Dates)
          const settingsRef = doc(db, "settings", "blocked_dates");
          const settingsSnap = await getDoc(settingsRef);
          if (settingsSnap.exists()) {
            setBlockedDates(settingsSnap.data().dates || []);
          } else {
            await setDoc(settingsRef, { dates: [] });
            setBlockedDates([]);
          }

          // Handle Authentication Session binding
          const activeRoles = rolesData.length > 0 ? rolesData : initialRoles;
          const activeUsers = usersData.length > 0 ? usersData : initialUsers;

          if (storedUser) {
            const u = JSON.parse(storedUser) as User;
            const liveUser = activeUsers.find((user) => user.id === u.id) || u;
            setCurrentUser(liveUser);
            const r = activeRoles.find((role: Role) => role.id === liveUser.roleId) || null;
            setCurrentRole(r);
          } else {
            const defaultSuperAdmin = activeUsers[0];
            setCurrentUser(defaultSuperAdmin);
            const defaultRole = activeRoles.find((role: Role) => role.id === defaultSuperAdmin.roleId) || null;
            setCurrentRole(defaultRole);
          }
        } catch (err) {
          console.error("Firestore loading error. Falling back to localStorage.", err);
          loadLocalStorage(storedUser, storedCart);
        }
      } else {
        loadLocalStorage(storedUser, storedCart);
      }
      setIsLoaded(true);
    };

    loadState();
  }, []);

  const loadLocalStorage = (storedUser: string | null, storedCart: string | null) => {
    const storedProducts = localStorage.getItem("cb_products");
    const storedOrders = localStorage.getItem("cb_orders");
    const storedRoles = localStorage.getItem("cb_roles");
    const storedUsers = localStorage.getItem("cb_users");
    const storedBlockedDates = localStorage.getItem("cb_blocked_dates");

    const localProducts = storedProducts ? JSON.parse(storedProducts) : initialProducts;
    const localRoles = storedRoles ? JSON.parse(storedRoles) : initialRoles;
    const localUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;

    setProducts(localProducts);
    setOrders(storedOrders ? JSON.parse(storedOrders) : initialOrders);
    setRoles(localRoles);
    setUsers(localUsers);
    setBlockedDates(storedBlockedDates ? JSON.parse(storedBlockedDates) : []);

    if (storedUser) {
      const u = JSON.parse(storedUser) as User;
      const liveUser = localUsers.find((user: User) => user.id === u.id) || u;
      setCurrentUser(liveUser);
      const r = localRoles.find((role: Role) => role.id === liveUser.roleId) || null;
      setCurrentRole(r);
    } else {
      const defaultSuperAdmin = localUsers[0];
      setCurrentUser(defaultSuperAdmin);
      const defaultRole = localRoles.find((role: Role) => role.id === defaultSuperAdmin.roleId) || null;
      setCurrentRole(defaultRole);
    }
  };

  // Save helper for local storage fallback
  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Cart actions
  const addToCart = (item: CartItem) => {
    const updated = [...cart];
    const existingIdx = updated.findIndex(
      (i) =>
        i.product.id === item.product.id &&
        i.selectedSize === item.selectedSize &&
        i.selectedFlavour === item.selectedFlavour &&
        i.customMessage === item.customMessage
    );

    if (existingIdx > -1) {
      updated[existingIdx].quantity += item.quantity;
    } else {
      updated.push(item);
    }
    setCart(updated);
    saveToLocalStorage("cb_cart", updated);
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    setCart(updated);
    saveToLocalStorage("cb_cart", updated);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    const updated = [...cart];
    updated[index].quantity = quantity;
    setCart(updated);
    saveToLocalStorage("cb_cart", updated);
  };

  const clearCart = () => {
    setCart([]);
    saveToLocalStorage("cb_cart", []);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Product actions
  const addProduct = async (pData: Omit<Product, "id">) => {
    const id = "p_" + Math.random().toString(36).substr(2, 6);
    const newProduct: Product = { ...pData, id };
    
    if (db) {
      try {
        await setDoc(doc(db, "products", id), { ...pData });
      } catch (err) {
        console.error("Firestore addProduct error:", err);
      }
    }

    const updated = [newProduct, ...products];
    setProducts(updated);
    saveToLocalStorage("cb_products", updated);
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    if (db) {
      try {
        await updateDoc(doc(db, "products", id), updatedFields);
      } catch (err) {
        console.error("Firestore updateProduct error:", err);
      }
    }

    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    saveToLocalStorage("cb_products", updated);
  };

  const deleteProduct = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        console.error("Firestore deleteProduct error:", err);
      }
    }

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveToLocalStorage("cb_products", updated);
  };

  // Order actions
  const placeOrder = async (orderData: Omit<Order, "id" | "status" | "createdAt">) => {
    const id = "CB-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, "orders", id), { ...newOrder, id: undefined });
      } catch (err) {
        console.error("Firestore placeOrder error:", err);
      }
    }

    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveToLocalStorage("cb_orders", updated);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => {
    const fieldsToUpdate = {
      status,
      ...(paymentStatus ? { paymentStatus } : {})
    };

    if (db) {
      try {
        await updateDoc(doc(db, "orders", id), fieldsToUpdate);
      } catch (err) {
        console.error("Firestore updateOrderStatus error:", err);
      }
    }

    const updated = orders.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          status,
          ...(paymentStatus ? { paymentStatus } : {}),
        };
      }
      return o;
    });
    setOrders(updated);
    saveToLocalStorage("cb_orders", updated);
  };

  // Helper count permissions
  const countPermissions = (perms: Role["permissions"]) => {
    let count = 0;
    Object.values(perms).forEach((list) => {
      count += list.length;
    });
    return count;
  };

  // Role actions
  const addRole = async (roleData: Omit<Role, "id" | "permissionCount">) => {
    const id = "r-" + roleData.name.toLowerCase().replace(/\s+/g, "");
    const newRole: Role = {
      ...roleData,
      id,
      permissionCount: countPermissions(roleData.permissions),
    };

    if (db) {
      try {
        await setDoc(doc(db, "roles", id), { ...roleData, id: undefined });
      } catch (err) {
        console.error("Firestore addRole error:", err);
      }
    }

    const updated = [...roles, newRole];
    setRoles(updated);
    saveToLocalStorage("cb_roles", updated);
  };

  const updateRole = async (id: string, updatedRole: Partial<Role>) => {
    if (db) {
      try {
        await updateDoc(doc(db, "roles", id), updatedRole);
      } catch (err) {
        console.error("Firestore updateRole error:", err);
      }
    }

    const updated = roles.map((r) => {
      if (r.id === id) {
        const merged = { ...r, ...updatedRole };
        if (updatedRole.permissions) {
          merged.permissionCount = countPermissions(merged.permissions);
        }
        return merged;
      }
      return r;
    });
    setRoles(updated);
    saveToLocalStorage("cb_roles", updated);

    if (currentUser && currentUser.roleId === id) {
      const activeRole = updated.find((r) => r.id === id) || null;
      setCurrentRole(activeRole);
    }
  };

  const deleteRole = async (id: string) => {
    const roleToDelete = roles.find((r) => r.id === id);
    if (roleToDelete?.isSystem) return;

    if (db) {
      try {
        await deleteDoc(doc(db, "roles", id));
      } catch (err) {
        console.error("Firestore deleteRole error:", err);
      }
    }

    const updated = roles.filter((r) => r.id !== id);
    setRoles(updated);
    saveToLocalStorage("cb_roles", updated);
  };

  // User actions
  const addUser = async (userData: Omit<User, "id" | "createdAt">) => {
    const id = "u-" + (users.length + 1) + "_" + Math.random().toString(36).substr(2, 4);
    const newUser: User = {
      ...userData,
      id,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, "users", id), { ...userData, createdAt: newUser.createdAt, id: undefined });
      } catch (err) {
        console.error("Firestore addUser error:", err);
      }
    }

    const updated = [...users, newUser];
    setUsers(updated);
    saveToLocalStorage("cb_users", updated);
  };

  const updateUser = async (id: string, updatedUser: Partial<User>) => {
    if (db) {
      try {
        await updateDoc(doc(db, "users", id), updatedUser);
      } catch (err) {
        console.error("Firestore updateUser error:", err);
      }
    }

    const updated = users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u));
    setUsers(updated);
    saveToLocalStorage("cb_users", updated);

    if (currentUser && currentUser.id === id) {
      const activeUser = updated.find((u) => u.id === id) || null;
      setCurrentUser(activeUser);
      if (updatedUser.roleId) {
        const activeRole = roles.find((r) => r.id === updatedUser.roleId) || null;
        setCurrentRole(activeRole);
      }
    }
  };

  const deleteUser = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (err) {
        console.error("Firestore deleteUser error:", err);
      }
    }

    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    saveToLocalStorage("cb_users", updated);
  };

  // Auth actions
  const login = (email: string, roleName: string) => {
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const matchedRole = roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase()) || roles[0];
      const newUser: User = {
        id: "u_temp_" + Math.random().toString(36).substr(2, 4),
        name: email.split("@")[0].toUpperCase(),
        email,
        roleId: matchedRole.id,
        status: "Active",
        createdAt: new Date().toISOString(),
      };
      
      if (db) {
        setDoc(doc(db, "users", newUser.id), {
          name: newUser.name,
          email: newUser.email,
          roleId: newUser.roleId,
          status: newUser.status,
          createdAt: newUser.createdAt
        }).catch(err => console.error("Firestore quickRegister error:", err));
      }

      setUsers([...users, newUser]);
      user = newUser;
    }

    setCurrentUser(user);
    const r = roles.find((role) => role.id === user!.roleId) || null;
    setCurrentRole(r);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("cb_currentUser", JSON.stringify(user));
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cb_currentUser");
    }
  };

  // Cloudinary settings
  const setCloudinaryConfig = (name: string, preset: string) => {
    setCloudinaryCloudName(name);
    setCloudinaryUploadPreset(preset);
    if (typeof window !== "undefined") {
      localStorage.setItem("cb_cloud_name", name);
      localStorage.setItem("cb_upload_preset", preset);
    }
  };

  // Block dates
  const toggleBlockedDate = async (date: string) => {
    const updated = blockedDates.includes(date)
      ? blockedDates.filter((d) => d !== date)
      : [...blockedDates, date];
    
    if (db) {
      try {
        await setDoc(doc(db, "settings", "blocked_dates"), { dates: updated });
      } catch (err) {
        console.error("Firestore toggleBlockedDate error:", err);
      }
    }

    setBlockedDates(updated);
    saveToLocalStorage("cb_blocked_dates", updated);
  };

  if (!isLoaded) {
    return null; // Prevent hydration mismatch
  }

  return (
    <StateContext.Provider
      value={{
        products,
        categories,
        orders,
        roles,
        users,
        cart,
        currentUser,
        currentRole,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        addRole,
        updateRole,
        deleteRole,
        addUser,
        updateUser,
        deleteUser,
        login,
        logout,
        cloudinaryCloudName,
        cloudinaryUploadPreset,
        setCloudinaryConfig,
        blockedDates,
        toggleBlockedDate,
        isFirebaseActive
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
};
