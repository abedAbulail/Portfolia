import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AppIcon } from "@/components/icons/AppIcons";

export default function HomePage() {
  return (
    <div className="marketing-page min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative marketing-hero overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pt-20 pb-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700 mb-8">
              <AppIcon name="sparkles" size={16} />
              Your portfolio, live in minutes
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Turn your work into a{" "}
              <span className="gradient-text">stunning portfolio</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed">
              Create an account, fill in your profile, projects, and skills — and get a
              shareable portfolio page instantly. No coding required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary text-base px-8 py-3">
                Create your portfolio — free
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-3">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display text-3xl font-bold text-center text-slate-900 mb-12">
            Everything you need
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "user" as const,
                title: "Personal profile",
                desc: "Add your bio, photo, contact info, and professional summary.",
              },
              {
                icon: "rocket" as const,
                title: "Showcase projects",
                desc: "Highlight your best work with descriptions, tech stack, and links.",
              },
              {
                icon: "bolt" as const,
                title: "Skills & certs",
                desc: "Display your skills, proficiency levels, and certifications.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <AppIcon name={feature.icon} size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-violet-100 bg-violet-50/50">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="font-display text-3xl font-bold text-center text-slate-900 mb-12">
              How it works
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: "1", title: "Sign up", desc: "Create your free account in seconds." },
                { step: "2", title: "Build", desc: "Fill in your profile, projects, and skills from the dashboard." },
                { step: "3", title: "Share", desc: "Get a unique link like portfolia.app/portfolio/your-name." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
            Ready to stand out?
          </h2>
          <p className="text-slate-600 mb-8">
            Join Portfolia and launch your professional portfolio today.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Get started for free
          </Link>
        </section>
      </main>

      <footer className="border-t border-violet-100 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Portfolia. Built with Next.js & Airtable.
      </footer>
    </div>
  );
}
