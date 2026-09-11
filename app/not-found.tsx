import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium text-fnj">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        This page doesn&apos;t exist.
      </h1>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-foreground hover:text-fnj"
      >
        Back to FNJ Marketplace
      </Link>
    </div>
  );
}
