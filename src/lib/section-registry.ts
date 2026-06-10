import type { SectionId } from "./portfolio-theme";

export interface SectionDefinition {
  id: SectionId;
  label: string;
  labelAr: string;
  category: "core" | "content" | "media" | "action" | "interactive";
  description: string;
}

export const SECTION_REGISTRY: SectionDefinition[] = [
  { id: "about", label: "About", labelAr: "نبذة", category: "core", description: "Bio and professional summary" },
  { id: "experience", label: "Experience", labelAr: "الخبرة", category: "content", description: "Work history" },
  { id: "timeline", label: "Timeline", labelAr: "التايم لاين", category: "content", description: "Interactive experience + education" },
  { id: "stats", label: "Stats", labelAr: "إحصائيات", category: "content", description: "Key numbers" },
  { id: "skills", label: "Skills", labelAr: "المهارات", category: "core", description: "Skills grid" },
  { id: "techStack", label: "Tech Stack", labelAr: "التقنيات", category: "content", description: "Animated tech icons" },
  { id: "projects", label: "Projects", labelAr: "المشاريع", category: "core", description: "Portfolio projects" },
  { id: "caseStudy", label: "Case Study", labelAr: "دراسة حالة", category: "content", description: "Detailed project breakdown" },
  { id: "services", label: "Services", labelAr: "الخدمات", category: "content", description: "Service cards with pricing" },
  { id: "blog", label: "Blog", labelAr: "مقالات", category: "content", description: "Articles and writing" },
  { id: "openSource", label: "Open Source", labelAr: "م开源", category: "content", description: "GitHub repos with stars" },
  { id: "awards", label: "Awards", labelAr: "الجوائز", category: "content", description: "Certifications and awards" },
  { id: "languages", label: "Languages", labelAr: "اللغات", category: "content", description: "Language proficiency bars" },
  { id: "testimonials", label: "Testimonials", labelAr: "آراء العملاء", category: "content", description: "Client reviews" },
  { id: "gallery", label: "Gallery", labelAr: "معرض", category: "media", description: "Image gallery" },
  { id: "video", label: "Video", labelAr: "فيديو", category: "media", description: "Embedded video" },
  { id: "contact", label: "Contact", labelAr: "التواصل", category: "action", description: "Contact info cards" },
  { id: "contactform", label: "Contact Form", labelAr: "نموذج", category: "action", description: "Message form" },
  { id: "resume", label: "Resume", labelAr: "السيرة", category: "action", description: "CV download" },
  { id: "cta", label: "Call to Action", labelAr: "دعوة", category: "action", description: "Action banner" },
  { id: "location", label: "Location", labelAr: "الموقع", category: "action", description: "Location and map" },
  { id: "customHtml", label: "Custom HTML", labelAr: "HTML", category: "media", description: "Custom block" },
];

export function getSectionDef(id: SectionId): SectionDefinition | undefined {
  return SECTION_REGISTRY.find((s) => s.id === id);
}
