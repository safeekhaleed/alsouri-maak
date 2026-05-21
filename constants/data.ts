export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  iconColor: string;
  url: string;
  order: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  contentType: "file" | "video" | "text";
  content: string;
  quantity: number;
  isActive: boolean;
}

export interface Course {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  lessonsCount: number;
  description: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  isActive: boolean;
}

export interface AppUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatarUrl: string;
  balance: number;
  vipLevel: number;
  vipTotalRecharge: number;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}

export interface RechargeRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  proofImageUrl: string;
  method: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productPrice: number;
  content: string;
  contentType: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  userId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "b1",
    imageUrl: "",
    link: "",
    order: 1,
    isActive: true,
  },
  {
    id: "b2",
    imageUrl: "",
    link: "",
    order: 2,
    isActive: true,
  },
  {
    id: "b3",
    imageUrl: "",
    link: "",
    order: 3,
    isActive: true,
  },
];

export const DEFAULT_TOOLS: Tool[] = [
  {
    id: "t1",
    name: "الحاسبة",
    description: "عمليات حسابية سريعة",
    iconName: "hash",
    iconColor: "#8B3DFF",
    url: "https://www.google.com/search?q=calculator",
    order: 1,
    isActive: true,
  },
  {
    id: "t2",
    name: "محول العملات",
    description: "تحويل بين العملات",
    iconName: "refresh-cw",
    iconColor: "#00BFFF",
    url: "https://www.xe.com",
    order: 2,
    isActive: true,
  },
  {
    id: "t3",
    name: "المفكرة",
    description: "تدوين ملاحظاتك",
    iconName: "edit-3",
    iconColor: "#00FF88",
    url: "https://notes.io",
    order: 3,
    isActive: true,
  },
  {
    id: "t4",
    name: "كاشف تسريبات GitHub",
    description: "تحقق من تسريبات حساباتك",
    iconName: "github",
    iconColor: "#8B3DFF",
    url: "https://haveibeenpwned.com",
    order: 4,
    isActive: true,
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "حزمة القوالب الاحترافية",
    imageUrl: "",
    price: 15,
    contentType: "file",
    content: "https://example.com/templates.zip",
    quantity: 50,
    isActive: true,
  },
  {
    id: "p2",
    name: "مجموعة أدوات التصميم",
    imageUrl: "",
    price: 25,
    contentType: "file",
    content: "https://example.com/design-tools.zip",
    quantity: 30,
    isActive: true,
  },
  {
    id: "p3",
    name: "دليل ريادة الأعمال",
    imageUrl: "",
    price: 10,
    contentType: "text",
    content: "هذا الدليل يحتوي على أهم نصائح ريادة الأعمال...",
    quantity: 100,
    isActive: true,
  },
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: "c1",
    name: "كورس البرمجة بالبايثون",
    imageUrl: "",
    price: 49,
    lessonsCount: 45,
    description: "تعلم البرمجة من الصفر إلى الاحتراف",
    isActive: true,
  },
  {
    id: "c2",
    name: "تطوير تطبيقات الموبايل",
    imageUrl: "",
    price: 79,
    lessonsCount: 60,
    description: "بناء تطبيقات احترافية لـ Android وiOS",
    isActive: true,
  },
  {
    id: "c3",
    name: "التسويق الرقمي الشامل",
    imageUrl: "",
    price: 39,
    lessonsCount: 35,
    description: "استراتيجيات التسويق في عصر الرقمنة",
    isActive: true,
  },
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "s1",
    name: "تصميم شعار احترافي",
    imageUrl: "",
    price: 30,
    description: "تصميم هوية بصرية مميزة لعلامتك التجارية",
    isActive: true,
  },
  {
    id: "s2",
    name: "إنشاء موقع إلكتروني",
    imageUrl: "",
    price: 150,
    description: "موقع احترافي متجاوب مع جميع الأجهزة",
    isActive: true,
  },
  {
    id: "s3",
    name: "كتابة محتوى إبداعي",
    imageUrl: "",
    price: 20,
    description: "محتوى مميز لمنصات التواصل الاجتماعي",
    isActive: true,
  },
];

export const ADMIN_PASSWORD = "admin2024";
