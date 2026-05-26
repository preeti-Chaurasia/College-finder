
import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#f8fafc]">
      <body className="antialiased min-h-full flex flex-col m-0 p-0">
        
        <Navbar />
        
      
        <main className="flex-grow w-full bg-[#f8fafc]">
          {children}
        </main>
        
      </body>
    </html>
  );
}