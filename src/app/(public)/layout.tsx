import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
