import type { SectionId } from "./portfolio-theme";

export type JobApplicationStatus = "saved" | "applied" | "waiting" | "rejected" | "accepted";
export type PageColorMode = "inherit" | "light" | "dark";

export interface PortfolioPage {
  id: string;
  slug: string;
  title: string;
  visible: boolean;
  sectionOrder: string[];
  colorMode: PageColorMode;
  isHome?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  rating?: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: "image" | "video";
  size?: number;
  createdAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  source: "jobs.ps" | "remotive" | "adzuna" | "telegram";
  description?: string;
  publishedAt?: string;
  tags?: string[];
}

export interface JobApplication {
  jobId: string;
  status: JobApplicationStatus;
  notes?: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: "message" | "job" | "booking" | "review" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface BookingSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface BookingSettings {
  enabled: boolean;
  durationMinutes: number;
  slots: BookingSlot[];
  requests: BookingRequest[];
}

export interface DirectorySettings {
  visible: boolean;
  headline?: string;
  featured: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OnboardingState {
  complete: boolean;
  step?: number;
  completedAt?: string;
}

/** Per-section-instance content for duplicate sections (gallery, HTML, etc.) */
export interface SectionInstanceContent {
  customHtml?: string;
  gallery?: GalleryItem[];
  testimonials?: Testimonial[];
  videoUrl?: string;
}

export interface PlatformData {
  pages: PortfolioPage[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  videoUrl: string;
  customHtml: string;
  /** Content keyed by section instance id */
  sectionContent: Record<string, SectionInstanceContent>;
  mediaLibrary: MediaItem[];
  jobFavorites: string[];
  jobApplications: JobApplication[];
  notifications: Notification[];
  booking: BookingSettings;
  directory: DirectorySettings;
  reviews: Review[];
  skillBadges: string[];
  subdomain?: string;
  onboarding: OnboardingState;
}

export const DEFAULT_PAGES: PortfolioPage[] = [
  {
    id: "page-home",
    slug: "",
    title: "Home",
    visible: true,
    sectionOrder: ["about", "skills", "projects"],
    colorMode: "inherit",
    isHome: true,
  },
];

export const DEFAULT_PLATFORM: PlatformData = {
  pages: DEFAULT_PAGES,
  testimonials: [],
  gallery: [],
  videoUrl: "",
  customHtml: "",
  sectionContent: {},
  mediaLibrary: [],
  jobFavorites: [],
  jobApplications: [],
  notifications: [],
  booking: {
    enabled: false,
    durationMinutes: 30,
    slots: [
      { id: "slot-1", day: "monday", startTime: "09:00", endTime: "17:00", enabled: true },
      { id: "slot-2", day: "tuesday", startTime: "09:00", endTime: "17:00", enabled: true },
      { id: "slot-3", day: "wednesday", startTime: "09:00", endTime: "17:00", enabled: true },
    ],
    requests: [],
  },
  directory: { visible: true, featured: false },
  reviews: [],
  skillBadges: [],
  onboarding: { complete: false, step: 1 },
};

export function parsePlatformData(raw?: Partial<PlatformData> | null): PlatformData {
  if (!raw) return structuredClone(DEFAULT_PLATFORM);
  return {
    ...structuredClone(DEFAULT_PLATFORM),
    ...raw,
    pages: raw.pages?.length ? raw.pages : DEFAULT_PAGES,
    sectionContent: raw.sectionContent ?? {},
    booking: { ...DEFAULT_PLATFORM.booking, ...raw.booking },
    directory: { ...DEFAULT_PLATFORM.directory, ...raw.directory },
    onboarding: raw.onboarding ?? { complete: true, step: 6 },
  };
}

export function getInstanceCustomHtml(
  platform: PlatformData,
  instanceId: string,
  type: SectionId,
  themeOrder: import("./portfolio-theme").SectionInstance[]
): string {
  const stored = platform.sectionContent?.[instanceId]?.customHtml;
  if (stored !== undefined) return stored;
  if (type === "customHtml" && platform.customHtml) {
    const first = themeOrder.find((item) => item.type === "customHtml");
    if (first?.id === instanceId) return platform.customHtml;
  }
  return "";
}

export function getInstanceGallery(
  platform: PlatformData,
  instanceId: string,
  type: SectionId,
  themeOrder: import("./portfolio-theme").SectionInstance[]
): GalleryItem[] {
  const stored = platform.sectionContent?.[instanceId]?.gallery;
  if (stored !== undefined) return stored;
  if (type === "gallery" && platform.gallery.length) {
    const first = themeOrder.find((item) => item.type === "gallery");
    if (first?.id === instanceId) return platform.gallery;
  }
  return [];
}

export function getInstanceTestimonials(
  platform: PlatformData,
  instanceId: string,
  type: SectionId,
  themeOrder: import("./portfolio-theme").SectionInstance[]
): Testimonial[] {
  const stored = platform.sectionContent?.[instanceId]?.testimonials;
  if (stored !== undefined) return stored;
  if (type === "testimonials" && platform.testimonials.length) {
    const first = themeOrder.find((item) => item.type === "testimonials");
    if (first?.id === instanceId) return platform.testimonials;
  }
  return [];
}

export function getInstanceVideoUrl(
  platform: PlatformData,
  instanceId: string,
  type: SectionId,
  themeOrder: import("./portfolio-theme").SectionInstance[]
): string {
  const stored = platform.sectionContent?.[instanceId]?.videoUrl;
  if (stored !== undefined) return stored;
  if (type === "video" && platform.videoUrl) {
    const first = themeOrder.find((item) => item.type === "video");
    if (first?.id === instanceId) return platform.videoUrl;
  }
  return "";
}

export function getPageBySlug(pages: PortfolioPage[], slug: string): PortfolioPage | null {
  if (!slug) return pages.find((p) => p.isHome) || pages[0] || null;
  return pages.find((p) => p.slug === slug) || null;
}

export function getVisiblePages(pages: PortfolioPage[]): PortfolioPage[] {
  return pages.filter((p) => p.visible);
}
