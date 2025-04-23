import { SignUpForm } from "@/components/auth/signup-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up for Simple Evaluation
          </p>
        </div>
        <div className="mt-8 bg-white p-8 shadow rounded-lg">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
} 