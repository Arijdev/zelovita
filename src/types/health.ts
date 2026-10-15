export type UserRole = 'guest' | 'customer' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  phone?: string;
}

export interface DownloadHistoryItem {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceCategory: string;
  coverImage: string;
  downloadedAt: string;
  fileFormat: string;
  isFree: boolean;
}

export interface PurchaseHistoryItem {
  orderId: string;
  items: {
    resourceId: string;
    title: string;
    price: number;
    coverImage: string;
    appointmentDate?: string;
    appointmentTime?: string;
  }[];
  totalPaid: number;
  paymentMethod: string;
  purchasedAt: string;
  receiptUrl?: string;
}

export interface HealthResource {
  id: string;
  title: string;
  subtitle: string;
  category: 'nutrition' | 'longevity' | 'heart' | 'fasting' | 'detox' | 'mental' | 'biohacking' | 'sleep';
  isFree: boolean;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  pages: number;
  readingTime: string;
  coverImage: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  highlights: string[];
  tableOfContents: string[];
  fullContent: {
    introduction: string;
    chapters: {
      title: string;
      content: string;
      keyTakeaways: string[];
      doctorTip?: string;
    }[];
    conclusion: string;
    protocolSummary: string[];
  };
  pdfFileName?: string;
  uploadedBy?: string;
  publishedAt?: string;
}

export interface CartItem {
  resource: HealthResource;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  author: string;
  publishedDate: string;
  image: string;
  content: string;
  keyPoints: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    icon: string;
    points: {
      category: 'nutrition' | 'longevity' | 'heart' | 'fasting' | 'detox';
      score: number;
    };
  }[];
}

export interface ConsultationPackage {
  id: string;
  title: string;
  duration: string;
  durationMinutes: 15 | 30 | 60;
  price: number;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  condition: string;
  result: string;
  quote: string;
  rating: number;
  verified: boolean;
}

export interface PatientAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  packageTitle: string;
  price: number;
  date: string;
  timeSlot: string;
  primaryConcern: string;
  status: 'confirmed' | 'completed' | 'rescheduled';
}
