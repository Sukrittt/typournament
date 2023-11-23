"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";

export const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    signOut({
      callbackUrl: `${window.location.origin}`,
    });
  };

  return (
    <Button
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "rounded-xl shadow-xl w-fit absolute top-4 right-4"
      )}
      disabled={loading}
      onClick={handleLogout}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4 mr-2" />
      )}
      {loading ? "Logging out" : "Log out"}
    </Button>
  );
};
