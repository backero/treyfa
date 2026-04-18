import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="space-y-4">
        <p className="text-8xl font-bold text-muted-foreground/20">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
