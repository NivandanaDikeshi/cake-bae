"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db as firebaseDb, auth } from "@/lib/firebase";
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
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // LKR - base/default price
  category: string;
  image: string;
  sizes: string[];
  flavours: string[];
  leadTime: string;
  rating: number;
  // Optional per-size absolute pricing. If a selected size has no entry
  // here, the base `price` above is used as the fallback.
  sizePrices?: Record<string, number>;
  // Optional per-flavour add-on pricing (added on top of the size price).
  // If a selected flavour has no entry here, the add-on defaults to 0.
  flavourPrices?: Record<string, number>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedFlavour: string;
  customMessage: string;
  // Unit price at the time the item was added, accounting for the
  // selected size/flavour. Optional for backwards-compatibility with
  // cart items saved before this field existed (see getCartTotal below).
  unitPrice?: number;
}

export interface Order {
  id: string;
  userId?: string | null;
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
  phone?: string;
  address?: string;
  photoURL?: string;
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
  refreshOrders: () => Promise<void>;
  // Role Actions
  addRole: (role: Omit<Role, "id" | "permissionCount">) => Promise<void>;
  updateRole: (id: string, updatedRole: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  // User Actions
  addUser: (user: Omit<User, "id" | "createdAt">, password?: string) => Promise<void>;
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  // Auth
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
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
const initialProducts: Product[] = [];

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
  }
];

const initialUsers: User[] = [];
const initialOrders: Order[] = [];

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

  // Re-fetch orders from Firestore (or localStorage fallback) on demand.
  // This is critical to call right after login/auth-state resolves, because
  // the initial page-load fetch can run before auth is ready (and can be
  // blocked by Firestore rules that require auth to read "orders"), and it
  // never re-runs on its own when a different user logs in.
  const refreshOrders = async () => {
    if (db) {
      try {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const ordersData: Order[] = [];
        ordersSnap.forEach((docSnap) => {
          ordersData.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        setOrders(ordersData);
        saveToLocalStorage("cb_orders", ordersData);
        return;
      } catch (err) {
        console.error("Firestore refreshOrders error. Falling back to localStorage.", err);
      }
    }

    if (typeof window !== "undefined") {
      const storedOrders = localStorage.getItem("cb_orders");
      setOrders(storedOrders ? JSON.parse(storedOrders) : initialOrders);
    }
  };

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
              const { id, ...pData } = p;
              const pRef = doc(collection(db, "products"), id);
              batch.set(pRef, pData);
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
              const { id, ...rData } = r;
              const rRef = doc(collection(db, "roles"), id);
              batch.set(rRef, rData);
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
              const { id, ...uData } = u;
              const uRef = doc(collection(db, "users"), id);
              batch.set(uRef, uData);
            });
            await batch.commit();
            setUsers(initialUsers);
          } else {
            setUsers(usersData);
          }

          // 4. Load Orders from Firestore
          // NOTE: this may run before Firebase Auth has resolved, and may be
          // blocked entirely by security rules that require auth to read
          // "orders". We deliberately do NOT treat this as the single source
          // of truth for orders — refreshOrders() is called again once auth
          // state is known (see the onAuthStateChanged effect below and login()).
          const ordersSnap = await getDocs(collection(db, "orders"));
          const ordersData: Order[] = [];
          ordersSnap.forEach((doc) => {
            ordersData.push({ id: doc.id, ...doc.data() } as Order);
          });

          if (ordersData.length === 0) {
            const batch = writeBatch(db);
            initialOrders.forEach((o) => {
              const { id, ...oData } = o;
              const oRef = doc(collection(db, "orders"), id);
              batch.set(oRef, oData);
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
            setCurrentUser(null);
            setCurrentRole(null);
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

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const u: User = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0].toUpperCase() || "",
              email: firebaseUser.email || "",
              roleId: userData.roleId || userData.role || "customer",
              status: userData.status || "Active",
              createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              phone: userData.phone || "",
              address: userData.address || "",
            };

            if (u.status === "Inactive") {
              await signOut(auth);
              setCurrentUser(null);
              setCurrentRole(null);
              localStorage.removeItem("cb_currentUser");
              return;
            }

            setCurrentUser(u);
            const r = roles.find((role) => role.id === u.roleId) || null;
            setCurrentRole(r);
            localStorage.setItem("cb_currentUser", JSON.stringify(u));
          } else {
            // Fallback for user without firestore doc
            const u: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0].toUpperCase() || "",
              email: firebaseUser.email || "",
              roleId: "customer",
              status: "Active",
              createdAt: new Date().toISOString(),
            };
            setCurrentUser(u);
            setCurrentRole(null);
            localStorage.setItem("cb_currentUser", JSON.stringify(u));
          }

          // IMPORTANT: re-fetch orders now that we know who's logged in.
          // Fixes orders not appearing after switching accounts, and cases
          // where the initial load ran before auth (or was blocked by rules).
          await refreshOrders();
        } catch (err) {
          console.error("Error syncing auth state changes:", err);
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
        localStorage.removeItem("cb_currentUser");
        // Also refresh on logout, in case rules allow public read of some orders
        // (e.g. guest checkout lookups) — keeps state consistent either way.
        await refreshOrders();
      }
    });

    return () => unsubscribe();
  }, [roles]);

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
      setCurrentUser(null);
      setCurrentRole(null);
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
      // Keep the unit price in sync in case pricing changed since the
      // existing line was added (e.g. admin updated sizePrices).
      if (item.unitPrice !== undefined) {
        updated[existingIdx].unitPrice = item.unitPrice;
      }
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

  // Uses the size/flavour-aware unitPrice when available, and falls back to
  // the product's base price for any older cart items saved before unitPrice
  // existed (e.g. still sitting in a customer's localStorage).
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.unitPrice !== undefined ? item.unitPrice : item.product.price;
      return total + price * item.quantity;
    }, 0);
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
      // Firestore's setDoc() rejects any field whose value is `undefined`
      // (it's fine with `null`). currentUser is null during guest checkout,
      // so currentUser?.id would otherwise resolve to undefined here and
      // throw "Unsupported field value: undefined (found in field userId)".
      userId: currentUser?.id ?? null,
    };

    if (db) {
      try {
        const { id: _, ...orderDataToSave } = newOrder;
        // Belt-and-suspenders: strip any other undefined fields (e.g. an
        // optional orderNotes left blank) before writing, so a future
        // optional field can't reintroduce this same Firestore error.
        const cleanOrderData = Object.fromEntries(
          Object.entries(orderDataToSave).filter(([, v]) => v !== undefined)
        );
        await setDoc(doc(db, "orders", id), cleanOrderData);
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
        await setDoc(doc(db, "roles", id), { ...roleData });
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
  const addUser = async (userData: Omit<User, "id" | "createdAt">, password?: string) => {
    let finalId = "u-" + (users.length + 1) + "_" + Math.random().toString(36).substr(2, 4);

    if (password && auth) {
      try {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
        };
        const { initializeApp, deleteApp } = await import("firebase/app");
        const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
        
        const secondaryAppName = "secondary_auth_app_" + Math.random().toString(36).substr(2, 6);
        const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        const secondaryAuth = getAuth(secondaryApp);
        
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          userData.email.trim(),
          password
        );
        
        finalId = userCredential.user.uid;
        await deleteApp(secondaryApp);
      } catch (err) {
        console.error("Firebase Auth staff creation error:", err);
        throw err;
      }
    }

    const newUser: User = {
      ...userData,
      id: finalId,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, "users", finalId), {
          name: newUser.name,
          email: newUser.email,
          roleId: newUser.roleId,
          status: newUser.status,
          createdAt: newUser.createdAt,
          phone: newUser.phone || "",
          address: newUser.address || "",
        });
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
  //
  // NOTE: this function ONLY signs in against an existing Firebase Auth
  // account. It must never silently create accounts on a failed sign-in —
  // a previous version of this function did that (auto-provisioning a new
  // Firebase Auth user, and even granting Super Admin, whenever sign-in
  // failed and certain email/role conditions were met). That was a serious
  // privilege-escalation and account-hijacking risk and has been removed.
  // Use addUser() (admin-initiated) or the forgot-password flow to create
  // or recover accounts instead.
  const login = async (email: string, password: string) => {
    if (!auth) {
      // Offline fallback: check in local state
      let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return null;
      setCurrentUser(user);
      const r = roles.find((role) => role.id === user.roleId) || null;
      setCurrentRole(r);
      if (typeof window !== "undefined") {
        localStorage.setItem("cb_currentUser", JSON.stringify(user));
      }
      await refreshOrders();
      return user;
    }

    try {
      // 1. Sign in with Firebase Auth — no fallback account creation.
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      // 2. Fetch user profile from Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const loggedInUser: User = {
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName || email.split("@")[0].toUpperCase(),
          email: firebaseUser.email || email,
          roleId: userData.roleId || userData.role || "customer",
          status: userData.status || "Active",
          createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          phone: userData.phone || "",
          address: userData.address || "",
        };

        if (loggedInUser.status === "Inactive") {
          await signOut(auth);
          throw new Error("Your account is inactive. Please contact support.");
        }

        setCurrentUser(loggedInUser);
        const r = roles.find((role) => role.id === loggedInUser.roleId) || null;
        setCurrentRole(r);

        if (typeof window !== "undefined") {
          localStorage.setItem("cb_currentUser", JSON.stringify(loggedInUser));
        }

        // Re-fetch orders now that we know who's logged in, so their order
        // history shows up immediately instead of waiting on a stale list.
        await refreshOrders();

        return loggedInUser;
      } else {
        // Firebase Auth user exists but has no matching Firestore profile.
        // Create a minimal customer profile so the app has something to
        // work with — this does NOT grant any elevated role.
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || email.split("@")[0].toUpperCase(),
          email: firebaseUser.email || email,
          roleId: "customer",
          status: "Active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, {
          name: newUser.name,
          email: newUser.email,
          roleId: newUser.roleId,
          status: newUser.status,
          createdAt: new Date(),
        });

        setCurrentUser(newUser);
        setCurrentRole(null);

        if (typeof window !== "undefined") {
          localStorage.setItem("cb_currentUser", JSON.stringify(newUser));
        }

        await refreshOrders();

        return newUser;
      }
    } catch (err) {
      console.error("Firebase Login Error:", err);
      throw err;
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Firebase SignOut Error:", err);
      }
    }
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
        refreshOrders,
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