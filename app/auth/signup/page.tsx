import SignupForm from "@/components/auth/signup-form"

export const metadata = {
  title: "Sign Up - Amass Tech Hub",
  description: "Create your Amass Tech Hub account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-900 mb-2">Join Amass Tech Hub</h1>
        <p className="text-gray-600 mb-6">Create your account to get started</p>
        <SignupForm />
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-purple-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
