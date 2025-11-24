import { useState } from "react";
import { authApi } from "../api/auth";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await authApi.register({ name, email, password });
      nav("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-80 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center">Register</h1>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Input label="Name" name="name" required />
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />

        <button
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p
          className="text-sm text-center text-blue-600 cursor-pointer"
          onClick={() => nav("/")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}
