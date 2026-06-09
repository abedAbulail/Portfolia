export type Locale = "en" | "ar";

export const LOCALES: { id: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "en", label: "English", dir: "ltr" },
  { id: "ar", label: "العربية", dir: "rtl" },
];

type Dict = Record<string, string>;

const en: Dict = {
  // Dashboard sidebar
  "nav.overview": "Overview",
  "nav.profile": "Profile",
  "nav.projects": "Projects",
  "nav.skills": "Skills",
  "nav.editor": "Page Editor",
  "nav.messages": "Messages",
  "nav.reports": "Overview",
  "nav.account": "Account",
  "nav.viewPortfolio": "View portfolio",
  "nav.signOut": "Sign out",

  // Dashboard overview
  "dash.welcome": "Welcome",
  "dash.portfolioUrl": "Your portfolio URL",
  "dash.completion": "Portfolio completion",
  "dash.customize": "Customize page",

  // Messages
  "msg.title": "Messages",
  "msg.subtitle": "Contact form submissions from your portfolio",
  "msg.empty": "No messages yet. Enable the Contact Form section on your portfolio.",
  "msg.from": "From",
  "msg.subject": "Subject",
  "msg.markRead": "Mark read",
  "msg.unread": "Unread",
  "msg.read": "Read",

  // Reports
  "rep.title": "Reports",
  "rep.subtitle": "Overview of your portfolio activity",
  "rep.messages": "Total messages",
  "rep.unread": "Unread messages",
  "rep.projects": "Projects",
  "rep.skills": "Skills",
  "rep.completion": "Profile completion",
  "rep.visitors": "Portfolio visitors",
  "rep.cvDownloads": "CV downloads",
  "rep.chartVisitors": "Visitors (14 days)",
  "rep.chartDownloads": "CV downloads (14 days)",
  "rep.chartMessages": "Messages (14 days)",
  "rep.loading": "Loading...",
  "rep.complete": "complete",

  // Account
  "acc.title": "Account settings",
  "acc.subtitle": "Manage your login email and password",
  "acc.email": "Email address",
  "acc.currentPassword": "Current password",
  "acc.newPassword": "New password",
  "acc.changePassword": "Change password",
  "acc.createdAt": "Account created",
  "acc.save": "Save changes",
  "acc.saving": "Saving...",
  "acc.updated": "Account updated successfully.",
  "acc.error": "Failed to update account.",
  "acc.noChanges": "No changes to save.",
  "acc.loading": "Loading...",

  // Portfolio UI
  "pf.lang": "Language",
  "pf.downloadCv": "Download CV",
  "pf.downloadResume": "Download Resume",
  "pf.contactMe": "Contact Me",
  "pf.name": "Name",
  "pf.email": "Email",
  "pf.subject": "Subject",
  "pf.message": "Message",
  "pf.send": "Send message",
  "pf.sending": "Sending...",
  "pf.sent": "Message sent! I'll get back to you soon.",
  "pf.error": "Failed to send. Please try again.",
  "pf.builtWith": "Built with",

  // Sections
  "sec.about": "About",
  "sec.experience": "Experience",
  "sec.stats": "Highlights",
  "sec.skills": "Skills",
  "sec.projects": "Projects",
  "sec.contact": "Contact",
  "sec.contactform": "Contact Me",
  "sec.resume": "Resume",
  "sec.cta": "Let's Connect",

  // Editor
  "ed.themes": "Themes",
  "ed.sections": "Sections",
  "ed.addSection": "Add section",
  "ed.removeSection": "Remove",
  "ed.mainSections": "Main sections (default)",
  "ed.optionalSections": "Optional sections",
  "ed.back": "Back to dashboard",
  "ed.backSections": "Back to sections",
  "ed.title": "Page Editor",
  "ed.save": "Save changes",
  "ed.saving": "Saving...",
  "ed.livePreview": "Live preview",
  "ed.editPanel": "Edit",
  "ed.previewPanel": "Preview",
  "ed.lightMode": "Light mode",
  "ed.darkMode": "Dark mode",
  "ed.loading": "Loading editor...",
  "ed.failed": "Failed to load.",
};

const ar: Dict = {
  "nav.overview": "نظرة عامة",
  "nav.profile": "الملف الشخصي",
  "nav.projects": "المشاريع",
  "nav.skills": "المهارات",
  "nav.editor": "محرر الصفحة",
  "nav.messages": "الرسائل",
  "nav.reports": "نظرة عامة",
  "nav.account": "الحساب",
  "nav.viewPortfolio": "عرض Portfolio",
  "nav.signOut": "تسجيل الخروج",

  "dash.welcome": "مرحباً",
  "dash.portfolioUrl": "رابط portfolio الخاص بك",
  "dash.completion": "اكتمال Portfolio",
  "dash.customize": "تخصيص الصفحة",

  "msg.title": "الرسائل",
  "msg.subtitle": "رسائل نموذج الاتصال من portfolio",
  "msg.empty": "لا توجد رسائل بعد. فعّل قسم نموذج الاتصال في portfolio.",
  "msg.from": "من",
  "msg.subject": "الموضوع",
  "msg.markRead": "تعليم كمقروء",
  "msg.unread": "غير مقروء",
  "msg.read": "مقروء",

  "rep.title": "التقارير",
  "rep.subtitle": "نظرة عامة على نشاط portfolio",
  "rep.messages": "إجمالي الرسائل",
  "rep.unread": "رسائل غير مقروءة",
  "rep.projects": "المشاريع",
  "rep.skills": "المهارات",
  "rep.completion": "اكتمال الملف",
  "rep.visitors": "زوار Portfolio",
  "rep.cvDownloads": "تحميلات السيرة",
  "rep.chartVisitors": "الزوار (14 يوم)",
  "rep.chartDownloads": "تحميلات CV (14 يوم)",
  "rep.chartMessages": "الرسائل (14 يوم)",
  "rep.loading": "جاري التحميل...",
  "rep.complete": "مكتمل",

  "acc.title": "إعدادات الحساب",
  "acc.subtitle": "إدارة البريد الإلكتروني وكلمة المرور",
  "acc.email": "البريد الإلكتروني",
  "acc.currentPassword": "كلمة المرور الحالية",
  "acc.newPassword": "كلمة المرور الجديدة",
  "acc.changePassword": "تغيير كلمة المرور",
  "acc.createdAt": "تاريخ إنشاء الحساب",
  "acc.save": "حفظ التغييرات",
  "acc.saving": "جاري الحفظ...",
  "acc.updated": "تم تحديث الحساب بنجاح.",
  "acc.error": "فشل تحديث الحساب.",
  "acc.noChanges": "لا توجد تغييرات للحفظ.",
  "acc.loading": "جاري التحميل...",

  "pf.lang": "اللغة",
  "pf.downloadCv": "تحميل السيرة",
  "pf.downloadResume": "تحميل CV",
  "pf.contactMe": "تواصل معي",
  "pf.name": "الاسم",
  "pf.email": "البريد الإلكتروني",
  "pf.subject": "الموضوع",
  "pf.message": "الرسالة",
  "pf.send": "إرسال الرسالة",
  "pf.sending": "جاري الإرسال...",
  "pf.sent": "تم إرسال الرسالة! سأتواصل معك قريباً.",
  "pf.error": "فشل الإرسال. حاول مرة أخرى.",
  "pf.builtWith": "صُنع بواسطة",

  "sec.about": "نبذة عني",
  "sec.experience": "الخبرات",
  "sec.stats": "أبرز الإنجازات",
  "sec.skills": "المهارات",
  "sec.projects": "المشاريع",
  "sec.contact": "معلومات التواصل",
  "sec.contactform": "تواصل معي",
  "sec.resume": "السيرة الذاتية",
  "sec.cta": "لنتواصل",

  "ed.themes": "السمات",
  "ed.sections": "الأقسام",
  "ed.addSection": "إضافة قسم",
  "ed.removeSection": "إزالة",
  "ed.mainSections": "الأقسام الرئيسية",
  "ed.optionalSections": "أقسام اختيارية",
  "ed.back": "العودة للوحة التحكم",
  "ed.backSections": "العودة للأقسام",
  "ed.title": "محرر الصفحة",
  "ed.save": "حفظ التغييرات",
  "ed.saving": "جاري الحفظ...",
  "ed.livePreview": "معاينة مباشرة",
  "ed.editPanel": "تعديل",
  "ed.previewPanel": "معاينة",
  "ed.lightMode": "الوضع الفاتح",
  "ed.darkMode": "الوضع الداكن",
  "ed.loading": "جاري تحميل المحرر...",
  "ed.failed": "فشل التحميل.",
};

const dictionaries: Record<Locale, Dict> = { en, ar };

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}

export function sectionLabel(locale: Locale, sectionId: string): string {
  return t(locale, `sec.${sectionId}`);
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
