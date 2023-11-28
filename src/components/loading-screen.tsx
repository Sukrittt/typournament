import { Loader } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader className="w-10 h-10 text-zinc-600 animate-spin" />
    </div>
  );
};
