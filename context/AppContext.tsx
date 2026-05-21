import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AppNotification,
  AppUser,
  Banner,
  Course,
  DEFAULT_BANNERS,
  DEFAULT_COURSES,
  DEFAULT_PRODUCTS,
  DEFAULT_SERVICES,
  DEFAULT_TOOLS,
  Product,
  Purchase,
  RechargeRequest,
  Service,
  Tool,
} from "@/constants/data";

const STORAGE_KEYS = {
  USERS: "@app_users",
  CURRENT_USER: "@current_user",
  BANNERS: "@banners",
  TOOLS: "@tools",
  PRODUCTS: "@products",
  COURSES: "@courses",
  SERVICES: "@services",
  RECHARGE_REQUESTS: "@recharge_requests",
  PURCHASES: "@purchases",
  NOTIFICATIONS: "@notifications",
};

const HASH_SALT = "alsouri_maak_2024_secure_salt";
const HASH_MARKER = "hsh:";

export function hashPassword(password: string): string {
  const input = HASH_SALT + password + HASH_SALT.split("").reverse().join("");
  let h1 = 5381;
  let h2 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = (Math.imul(31, h1) + c) | 0;
    h2 = (Math.imul(h2 ^ c, 0x01000193)) | 0;
  }
  const a = (h1 >>> 0).toString(16).padStart(8, "0");
  const b = (h2 >>> 0).toString(16).padStart(8, "0");
  const c2 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
  const d = ((h1 + h2) >>> 0).toString(16).padStart(8, "0");
  return HASH_MARKER + a + b + c2 + d;
}

function isHashed(pwd: string): boolean {
  return pwd.startsWith(HASH_MARKER);
}

function verifyPassword(plain: string, stored: string): boolean {
  if (isHashed(stored)) return hashPassword(plain) === stored;
  return plain === stored;
}

interface AppContextType {
  currentUser: AppUser | null;
  users: AppUser[];
  banners: Banner[];
  tools: Tool[];
  products: Product[];
  courses: Course[];
  services: Service[];
  rechargeRequests: RechargeRequest[];
  purchases: Purchase[];
  notifications: AppNotification[];
  drawerOpen: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  requestRecharge: (amount: number, proofImageUrl: string, method: string) => Promise<void>;
  buyProduct: (product: Product) => Promise<boolean>;
  buyCourse: (course: Course) => Promise<boolean>;
  buyService: (service: Service) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<void>;
  setDrawerOpen: (open: boolean) => void;

  adminApproveRecharge: (requestId: string) => Promise<void>;
  adminRejectRecharge: (requestId: string) => Promise<void>;
  adminUpdateUser: (userId: string, updates: Partial<AppUser>) => Promise<void>;
  adminAddBanner: (banner: Banner) => Promise<void>;
  adminUpdateBanner: (bannerId: string, updates: Partial<Banner>) => Promise<void>;
  adminDeleteBanner: (bannerId: string) => Promise<void>;
  adminAddTool: (tool: Tool) => Promise<void>;
  adminUpdateTool: (toolId: string, updates: Partial<Tool>) => Promise<void>;
  adminDeleteTool: (toolId: string) => Promise<void>;
  adminAddProduct: (product: Product) => Promise<void>;
  adminUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;
  adminAddCourse: (course: Course) => Promise<void>;
  adminUpdateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
  adminDeleteCourse: (courseId: string) => Promise<void>;
  adminAddService: (service: Service) => Promise<void>;
  adminUpdateService: (serviceId: string, updates: Partial<Service>) => Promise<void>;
  adminDeleteService: (serviceId: string) => Promise<void>;
  adminSendNotification: (title: string, body: string, userId?: string | null) => Promise<void>;

  getVipDiscount: (level: number) => number;
  getDiscountedPrice: (price: number, level?: number) => number;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_ADMINS: AppUser[] = [
  {
    id: "admin_001",
    email: "admin@alsouri.com",
    password: hashPassword("admin2024"),
    name: "المدير",
    avatarUrl: "",
    balance: 1000,
    vipLevel: 6,
    vipTotalRecharge: 300,
    isAdmin: true,
    isBanned: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "admin_002",
    email: "safee12221222@gmail.com",
    password: hashPassword("blak1998877"),
    name: "سيف الأدمن",
    avatarUrl: "",
    balance: 9999,
    vipLevel: 6,
    vipTotalRecharge: 9999,
    isAdmin: true,
    isBanned: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [tools, setTools] = useState<Tool[]>(DEFAULT_TOOLS);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        usersData,
        currentUserData,
        bannersData,
        toolsData,
        productsData,
        coursesData,
        servicesData,
        rechargeData,
        purchasesData,
        notificationsData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USERS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER),
        AsyncStorage.getItem(STORAGE_KEYS.BANNERS),
        AsyncStorage.getItem(STORAGE_KEYS.TOOLS),
        AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS),
        AsyncStorage.getItem(STORAGE_KEYS.COURSES),
        AsyncStorage.getItem(STORAGE_KEYS.SERVICES),
        AsyncStorage.getItem(STORAGE_KEYS.RECHARGE_REQUESTS),
        AsyncStorage.getItem(STORAGE_KEYS.PURCHASES),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
      ]);

      let parsedUsers: AppUser[] = usersData ? JSON.parse(usersData) : [];

      // Ensure both admin accounts always exist with correct hashed passwords
      for (const adminTemplate of DEFAULT_ADMINS) {
        const idx = parsedUsers.findIndex((u) => u.id === adminTemplate.id);
        if (idx === -1) {
          parsedUsers = [adminTemplate, ...parsedUsers];
        } else {
          // Always update admin password hash and isAdmin flag
          parsedUsers[idx] = {
            ...parsedUsers[idx],
            password: adminTemplate.password,
            isAdmin: true,
            vipLevel: 6,
          };
        }
      }

      // Migrate plaintext passwords for non-admin users
      let migrated = false;
      parsedUsers = parsedUsers.map((u) => {
        if (!isHashed(u.password)) {
          migrated = true;
          return { ...u, password: hashPassword(u.password) };
        }
        return u;
      });

      if (parsedUsers.length > 0 || migrated) {
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
      }

      setUsers(parsedUsers);
      if (currentUserData) {
        const saved = JSON.parse(currentUserData) as AppUser;
        const fresh = parsedUsers.find((u) => u.id === saved.id);
        if (fresh && !fresh.isBanned) setCurrentUser(fresh);
      }
      if (bannersData) setBanners(JSON.parse(bannersData));
      if (toolsData) setTools(JSON.parse(toolsData));
      if (productsData) setProducts(JSON.parse(productsData));
      if (coursesData) setCourses(JSON.parse(coursesData));
      if (servicesData) setServices(JSON.parse(servicesData));
      if (rechargeData) setRechargeRequests(JSON.parse(rechargeData));
      if (purchasesData) setPurchases(JSON.parse(purchasesData));
      if (notificationsData) setNotifications(JSON.parse(notificationsData));
    } catch (e) {
      console.warn("loadData error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUsers = async (updated: AppUser[]) => {
    setUsers(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.isBanned) return false;
    if (!verifyPassword(password, user.password)) return false;
    setCurrentUser(user);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return true;
  }, [users]);

  const logout = useCallback(async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) return false;
    const newUser: AppUser = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      email,
      password: hashPassword(password),
      name,
      avatarUrl: "",
      balance: 0,
      vipLevel: 0,
      vipTotalRecharge: 0,
      isAdmin: false,
      isBanned: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    await saveUsers(updated);
    setCurrentUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return true;
  }, [users]);

  const updateProfile = useCallback(async (updates: Partial<AppUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
    await saveUsers(updatedUsers);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
  }, [currentUser, users]);

  const requestRecharge = useCallback(async (amount: number, proofImageUrl: string, method: string) => {
    if (!currentUser) return;
    const req: RechargeRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      proofImageUrl,
      method,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [...rechargeRequests, req];
    setRechargeRequests(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.RECHARGE_REQUESTS, JSON.stringify(updated));
  }, [currentUser, rechargeRequests]);

  const buyItem = useCallback(async (
    itemId: string,
    itemName: string,
    itemPrice: number,
    itemContent: string,
    itemContentType: string,
    itemQuantity: number,
    updateItem: (id: string) => void
  ): Promise<boolean> => {
    if (!currentUser) return false;
    const discount = getVipDiscount(currentUser.vipLevel);
    const finalPrice = itemPrice * (1 - discount / 100);
    if (currentUser.balance < finalPrice) return false;

    const purchase: Purchase = {
      id: Date.now().toString(),
      userId: currentUser.id,
      productId: itemId,
      productName: itemName,
      productPrice: finalPrice,
      content: itemContent,
      contentType: itemContentType,
      createdAt: new Date().toISOString(),
    };

    const updatedPurchases = [...purchases, purchase];
    setPurchases(updatedPurchases);
    await AsyncStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(updatedPurchases));

    await updateProfile({ balance: currentUser.balance - finalPrice });
    updateItem(itemId);
    return true;
  }, [currentUser, purchases]);

  const buyProduct = useCallback(async (product: Product): Promise<boolean> => {
    const result = await buyItem(
      product.id, product.name, product.price, product.content,
      product.contentType, product.quantity,
      (id) => {
        const updated = products.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        );
        setProducts(updated);
        AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      }
    );
    return result;
  }, [products, buyItem]);

  const buyCourse = useCallback(async (course: Course): Promise<boolean> => {
    return await buyItem(
      course.id, course.name, course.price, course.description,
      "text", 999, () => {}
    );
  }, [buyItem]);

  const buyService = useCallback(async (service: Service): Promise<boolean> => {
    return await buyItem(
      service.id, service.name, service.price, service.description,
      "text", 999, () => {}
    );
  }, [buyItem]);

  const markNotificationRead = useCallback(async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }, [notifications]);

  const adminSendNotification = useCallback(async (title: string, body: string, userId: string | null = null) => {
    const notif: AppNotification = {
      id: Date.now().toString(),
      title,
      body,
      userId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [notif, ...notifications];
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }, [notifications]);

  const adminApproveRecharge = useCallback(async (requestId: string) => {
    const req = rechargeRequests.find((r) => r.id === requestId);
    if (!req) return;
    const updated = rechargeRequests.map((r) =>
      r.id === requestId ? { ...r, status: "approved" as const } : r
    );
    setRechargeRequests(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.RECHARGE_REQUESTS, JSON.stringify(updated));

    const targetUser = users.find((u) => u.id === req.userId);
    if (!targetUser) return;
    const newVipLevel = Math.min(6, Math.floor((targetUser.vipTotalRecharge + req.amount) / 50));
    const updatedUser = {
      ...targetUser,
      balance: targetUser.balance + req.amount,
      vipTotalRecharge: targetUser.vipTotalRecharge + req.amount,
      vipLevel: newVipLevel,
    };
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    await saveUsers(updatedUsers);

    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }

    await adminSendNotification(
      "✅ تمت الموافقة على طلب الشحن",
      `تمت إضافة $${req.amount} إلى رصيدك بنجاح. مستوى VIP الحالي: ${newVipLevel}`,
      req.userId
    );
  }, [rechargeRequests, users, currentUser, adminSendNotification]);

  const adminRejectRecharge = useCallback(async (requestId: string) => {
    const req = rechargeRequests.find((r) => r.id === requestId);
    const updated = rechargeRequests.map((r) =>
      r.id === requestId ? { ...r, status: "rejected" as const } : r
    );
    setRechargeRequests(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.RECHARGE_REQUESTS, JSON.stringify(updated));

    if (req) {
      await adminSendNotification(
        "❌ تم رفض طلب الشحن",
        `تم رفض طلب شحن $${req.amount}. تواصل مع الدعم للاستفسار.`,
        req.userId
      );
    }
  }, [rechargeRequests, adminSendNotification]);

  const adminUpdateUser = useCallback(async (userId: string, updates: Partial<AppUser>) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    await saveUsers(updatedUsers);
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  }, [users, currentUser]);

  const adminAddBanner = useCallback(async (banner: Banner) => {
    const updated = [...banners, banner];
    setBanners(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(updated));
  }, [banners]);

  const adminUpdateBanner = useCallback(async (bannerId: string, updates: Partial<Banner>) => {
    const updated = banners.map((b) => (b.id === bannerId ? { ...b, ...updates } : b));
    setBanners(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(updated));
  }, [banners]);

  const adminDeleteBanner = useCallback(async (bannerId: string) => {
    const updated = banners.filter((b) => b.id !== bannerId);
    setBanners(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(updated));
  }, [banners]);

  const adminAddTool = useCallback(async (tool: Tool) => {
    const updated = [...tools, tool];
    setTools(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated));
  }, [tools]);

  const adminUpdateTool = useCallback(async (toolId: string, updates: Partial<Tool>) => {
    const updated = tools.map((t) => (t.id === toolId ? { ...t, ...updates } : t));
    setTools(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated));
  }, [tools]);

  const adminDeleteTool = useCallback(async (toolId: string) => {
    const updated = tools.filter((t) => t.id !== toolId);
    setTools(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated));
  }, [tools]);

  const adminAddProduct = useCallback(async (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  }, [products]);

  const adminUpdateProduct = useCallback(async (productId: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, ...updates } : p));
    setProducts(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  }, [products]);

  const adminDeleteProduct = useCallback(async (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  }, [products]);

  const adminAddCourse = useCallback(async (course: Course) => {
    const updated = [...courses, course];
    setCourses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  }, [courses]);

  const adminUpdateCourse = useCallback(async (courseId: string, updates: Partial<Course>) => {
    const updated = courses.map((c) => (c.id === courseId ? { ...c, ...updates } : c));
    setCourses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  }, [courses]);

  const adminDeleteCourse = useCallback(async (courseId: string) => {
    const updated = courses.filter((c) => c.id !== courseId);
    setCourses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  }, [courses]);

  const adminAddService = useCallback(async (service: Service) => {
    const updated = [...services, service];
    setServices(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  }, [services]);

  const adminUpdateService = useCallback(async (serviceId: string, updates: Partial<Service>) => {
    const updated = services.map((s) => (s.id === serviceId ? { ...s, ...updates } : s));
    setServices(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  }, [services]);

  const adminDeleteService = useCallback(async (serviceId: string) => {
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  }, [services]);

  const getVipDiscount = (level: number): number => level * 5;
  const getDiscountedPrice = (price: number, level?: number): number => {
    const vip = level ?? currentUser?.vipLevel ?? 0;
    const discount = getVipDiscount(vip);
    return price * (1 - discount / 100);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser, users, banners, tools, products, courses, services,
        rechargeRequests, purchases, notifications, drawerOpen, isLoading,
        login, logout, register, updateProfile, requestRecharge,
        buyProduct, buyCourse, buyService, markNotificationRead,
        setDrawerOpen,
        adminApproveRecharge, adminRejectRecharge, adminUpdateUser,
        adminAddBanner, adminUpdateBanner, adminDeleteBanner,
        adminAddTool, adminUpdateTool, adminDeleteTool,
        adminAddProduct, adminUpdateProduct, adminDeleteProduct,
        adminAddCourse, adminUpdateCourse, adminDeleteCourse,
        adminAddService, adminUpdateService, adminDeleteService,
        adminSendNotification,
        getVipDiscount, getDiscountedPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
