import { useState } from "react";
import { organisationApi } from "../../api/organisation";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";

export default function CreateOrganisationPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    try {
      await organisationApi.create({ name });
      nav("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create organisation");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-96 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center">Create Organisation</h1>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Input label="Organisation Name" name="name" required />

        <button
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
