"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search as LucideSearch, Menu as LucideMenu, X as LucideX } from "lucide-react";
import SearchModal from "./SearchModal";
import ProfileMenu from "./profileMenu";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { fetchUserDataById } from "@/graphQlQueries/method";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const token = getToken();
    setToken(token);
    if (token) {
      fetchUserDataById(token, null).then((userData) => {
        console.log("userData------:", userData);
        setUser(userData.user);
        setSavedRecipes(userData.savedRecipes);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  console.log("user:", user);
  console.log("savedRecipes:", savedRecipes);

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Left Section: Site Name & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
        </button>
        <h1 className="text-xl font-bold">MySite</h1>
      </div>

      {/* Center: Search Bar (Triggers Modal) - Hidden on Small Screens */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer w-1/3 bg-gray-100 hover:bg-gray-200" onClick={() => setIsSearchOpen(true)}>
        <LucideSearch className="text-gray-500" size={18} />
        <span className="text-gray-500">Search recipes...</span>
      </div>

      {/* Right Section: Conditional Rendering based on Token */}
      <div className="hidden lg:flex items-center gap-4">
        {loading ? (
          ""
        ) : token ? (
          <ProfileMenu user={{ name: "John Doe", avatar: "https://via.placeholder.com/150" }} />
        ) : (
          <Button variant="default">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>

      {/* Mobile Menu (Opens when toggled) */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col items-center gap-4 lg:hidden z-50">
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-gray-200" onClick={() => setIsSearchOpen(true)}>
            <LucideSearch className="text-gray-500" size={18} />
            <span className="text-gray-500">Search recipes...</span>
          </div>
          {loading ? (
            ""
          ) : token ? (
            <ProfileMenu user={{ name: "John Doe", avatar: "https://via.placeholder.com/150" }} />
          ) : (
            <Button variant="default" className="w-full">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      )}

      {/* Search Modal */}
      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
