import "./globals.css";
import ClerkClientProvider from "@/components/ClerkClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#05070A] text-white">
        <ClerkClientProvider>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
