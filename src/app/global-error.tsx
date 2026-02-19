"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <div className="text-[8rem] font-bold leading-none tracking-tighter sm:text-[10rem]">
            500
          </div>
          <div className="mt-2 h-0.5 w-16 bg-red-600" />
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Something went wrong
          </p>
          <p className="mt-3 max-w-md text-center text-neutral-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-8 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
