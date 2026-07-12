import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* The marketing site is dark by design, so it opts out of the theme
       toggle and pins its own background. */
    <div className="relative bg-black">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
