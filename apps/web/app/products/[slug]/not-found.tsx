import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-9xl font-bold font-heading text-muted/20">404</h1>
          <h2 className="text-3xl font-bold mt-4 mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button size="lg" asChild className="w-full">
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
