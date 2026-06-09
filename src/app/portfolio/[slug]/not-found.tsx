import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl font-bold text-white mb-4">Portfolio not found</h1>
      <p className="text-slate-400 mb-8">
        This portfolio doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <Link href="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
}
