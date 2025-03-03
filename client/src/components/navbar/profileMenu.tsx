"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/lib/auth";

type User = {
  name: string;
  avatar?: string;
};

const ProfileMenu = ({ user }: { user: User }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    try {
      removeToken();
      window.location.reload();
    } catch (error) {
      console.error("logout error:", error);
    }
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
      {/* Avatar Trigger */}
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-lg p-2">
        <div className="px-3 py-2 border-b text-sm text-gray-700">
          <strong>{user.name}</strong>
        </div>
        <DropdownMenuItem>
          <Button variant="ghost" className="w-full text-left">
            Saved Recipes
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant="destructive" className="w-full text-left" onClick={handleLogout}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
