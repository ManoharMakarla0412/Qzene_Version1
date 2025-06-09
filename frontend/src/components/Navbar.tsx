import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onSearch?: (query: string) => void;  // Make onSearch optional with '?'
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);  // Use optional chaining here
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/24708f27-bbd0-4ca9-aafb-64a3f0d94ba8.png" 
              alt="Qzene Logo" 
              className="h-10"
            />
          </Link> 
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-qzene-purple-dark">
              Home
            </Link>
            <Link to="/all-recipes" className="text-sm font-medium transition-colors hover:text-qzene-purple-dark">
              All Recipes
            </Link>
            <Link to="/cuisines" className="text-sm font-medium transition-colors hover:text-qzene-purple-dark">
              Cuisines
            </Link>
            <Link to="/devices" className="text-sm font-medium transition-colors hover:text-qzene-purple-dark">
              Devices
            </Link>
            <a href="#meal-planner" className="text-sm font-medium transition-colors hover:text-qzene-purple-dark">
              Meal Planner
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Helper function to get initials from name
const getInitials = (firstName?: string | null, lastName?: string | null): string => {
  const first = firstName && firstName.length > 0 ? firstName[0].toUpperCase() : '';
  const last = lastName && lastName.length > 0 ? lastName[0].toUpperCase() : '';
  
  if (first && last) return `${first}${last}`;
  if (first) return first;
  if (last) return last;
  return 'U';
};

export default Navbar;
