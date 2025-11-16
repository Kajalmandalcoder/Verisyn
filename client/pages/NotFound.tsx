import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-white">404</h1>
            <p className="text-xl text-slate-400">
              Oops! Page not found
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
