import { AuthForm } from "~/components/auth-form";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="w-96">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold mt-3">Typeournament.</h1>
          <p className="text-muted-foreground mt-1">
            The ultimate typing challenge
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
