export const FormCircle = ({
  form,
}: {
  form: "win" | "lost" | "draw" | "nan";
}) => {
  if (form === "win") {
    return (
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-xs border border-green-500">
        W
      </div>
    );
  } else if (form === "lost") {
    return (
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white text-xs border border-red-500">
        L
      </div>
    );
  } else if (form === "draw") {
    return (
      <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs bg-yellow-600 border-yellow-600 text-white">
        D
      </div>
    );
  } else if (form === "nan") {
    return (
      <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs bg-gray-700 text-white">
        -
      </div>
    );
  }
};
