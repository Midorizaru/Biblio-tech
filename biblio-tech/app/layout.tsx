import QuickSearch from "./components/QuickSearch";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html>
      <body>
        <QuickSearch />
        {children}
      </body>
    </html>
  );
}