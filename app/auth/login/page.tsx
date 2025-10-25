import LoginForm from "@/components/auth/login-form"

export const metadata = {
  title: "Login - Amass Tech Hub",
  description: "Login to your Amass Tech Hub account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Login to your Amass Tech Hub account</p>
        <LoginForm />
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-purple-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
