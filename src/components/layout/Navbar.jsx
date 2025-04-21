import { Link } from "react-router-dom";
import { Leaf, Droplet, Battery, BarChart3 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Leaf className="mr-2 h-4 w-4" /> },
    { path: "/consumption", label: "Consumption", icon: <Droplet className="mr-2 h-4 w-4" /> },
    { path: "/carbon-footprint", label: "Carbon Footprint", icon: <Battery className="mr-2 h-4 w-4" /> },
    { path: "/reports", label: "Reports", icon: <BarChart3 className="mr-2 h-4 w-4" /> }
  ];

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-bold">SustainHome</span>
        </Link>

        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-primary-foreground"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </Button>
            
            {isMenuOpen && (
              <div className="absolute top-16 right-0 left-0 bg-primary z-50 py-2 px-4 shadow-lg">
                <ul className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center py-2 px-3 rounded-md hover:bg-primary-foreground/10"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md hover:bg-primary-foreground/10",
                    "transition duration-200"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};
