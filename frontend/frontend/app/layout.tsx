import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { OfflineSyncBanner } from "@/components/offline/OfflineSyncBanner";
import { AuthProvider } from "@/components/auth/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LanguageProvider } from "@/components/providers/LanguageContext";
import { StationProvider } from "@/components/providers/StationContext";
import { GovAccessibilityBar } from "@/components/accessibility/GovAccessibilityBar";

export const metadata: Metadata = {
  title: "POLARLINK-BHARAT | Indian Antarctic Digital Twin Platform (MoES/NCPOR)",
  description: "Mission Operations & Digital Twin Platform for Indian Antarctic Research Stations (Bharati & Maitri)",
  icons: {
    icon: "/logo.webp",
    shortcut: "/favicon.ico",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#020B14] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
        <LanguageProvider>
          <AuthProvider>
            <StationProvider>
              <AuthGuard>
                <GovAccessibilityBar />
                <Header />
                <OfflineSyncBanner />
                <div className="flex-1 max-w-[1920px] w-full mx-auto p-3 flex gap-3 min-h-[calc(100vh-140px)]">
                  <Sidebar />
                  <main id="main-content" className="flex-1 min-w-0">
                    {children}
                  </main>
                </div>
                <Footer />
              </AuthGuard>
            </StationProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
