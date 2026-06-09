import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="marketing-page min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
          P
        </span>
        <span className="font-display text-xl font-semibold text-slate-900">Portfolia</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Create your account
          </h1>
          <p className="text-slate-600 text-sm">
            Start building your portfolio in minutes
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
