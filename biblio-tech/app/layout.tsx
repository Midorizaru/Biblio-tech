import QuickSearch from "./components/QuickSearch";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html>
      <body suppressHydrationWarning>
        <QuickSearch />
        {children}
      </body>
    </html>
  );
}