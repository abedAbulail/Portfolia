import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AppIcon } from "@/components/icons/AppIcons";

export default function HomePage() {
  return (
    <div className="marketing-page min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative marketing-hero overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm mb-8"
              style={{ borderColor: "#e4deef", background: "#ffffff", color: "#6d28d9" }}
            >
              <AppIcon name="sparkles" size={16} />
              Your portfolio, live in minutes
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{ color: "#1a1523" }}>
              Turn your work into a{" "}
              <span className="gradient-text">stunning portfolio</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg mb-10 leading-relaxed" style={{ color: "#6b6478" }}>
              Create an account, fill in your profile, projects, and skills — and get a
              shareable portfolio page instantly. No coding required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/signup" className="btn-primary text-base px-6 sm:px-8 py-3">
                Create your portfolio — free
              </Link>
              <Link href="/login" className="btn-secondary text-base px-6 sm:px-8 py-3">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12" style={{ color: "#1a1523" }}>
            Everything you need
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "user" as const, title: "Personal profile", desc: "Add your bio, photo, contact info, and professional summary." },
              { icon: "rocket" as const, title: "Showcase projects", desc: "Highlight your best work with descriptions, tech stack, and links." },
              { icon: "bolt" as const, title: "Skills & certs", desc: "Display your skills, proficiency levels, and certifications." },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border p-6 transition-shadow hover:shadow-md"
                style={{ borderColor: "#e4deef", background: "#ffffff", boxShadow: "0 1px 3px rgba(26,21,35,0.06)" }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: "#f0eaff", color: "#6d28d9" }}
                >
                  <AppIcon name={feature.icon} size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#1a1523" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b6478" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderTop: "1px solid #e4deef", background: "#ffffff" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12" style={{ color: "#1a1523" }}>
              How it works
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: "1", title: "Sign up", desc: "Create your free account in seconds." },
                { step: "2", title: "Build", desc: "Fill in your profile, projects, and skills from the dashboard." },
                { step: "3", title: "Share", desc: "Get a unique link like portfolia.app/portfolio/your-name." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-lg"
                    style={{ background: "#6d28d9" }}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: "#1a1523" }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: "#6b6478" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#1a1523" }}>
            Ready to stand out?
          </h2>
          <p className="mb-8" style={{ color: "#6b6478" }}>
            Join Portfolia and launch your professional portfolio today.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Get started for free
          </Link>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: "#e4deef", color: "#6b6478" }}>
        © {new Date().getFullYear()} Portfolia. Built with Next.js & Airtable.
      </footer>
    </div>
  );
}
