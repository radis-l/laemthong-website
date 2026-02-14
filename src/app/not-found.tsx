import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "#1a1a1a",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              fontSize: "8rem",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            404
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              height: 2,
              width: 64,
              backgroundColor: "oklch(0.50 0.20 25)",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#666",
            }}
          >
            Page Not Found
          </p>
          <p style={{ marginTop: "0.75rem", color: "#888", maxWidth: 400 }}>
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
