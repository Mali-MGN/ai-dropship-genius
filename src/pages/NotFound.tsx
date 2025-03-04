
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-lg text-center space-y-5 px-6">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-soft"></div>
          <div className="absolute inset-2.5 bg-background rounded-full flex items-center justify-center">
            <p className="text-3xl font-bold text-primary">404</p>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="pt-4">
          <Link to="/">
            <Button className="min-w-[160px]">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
