import { useState } from "react";
import Input from "./Input";

interface TeamFormProps {
  initial?: {
    name?: string;
    description?: string;
  };
  loading: boolean;
  onSubmit: (data: any) => void;
}

export default function TeamForm({
  initial = {},
  loading,
  onSubmit,
}: TeamFormProps) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    if (!name.trim()) return setError("Team name is required");

    onSubmit({ name, description });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-600">{error}</div>}

      <Input
        label="Team Name"
        name="name"
        defaultValue={initial.name}
        required
      />

      <Input
        label="Description"
        name="description"
        defaultValue={initial.description}
        placeholder="Team purpose, domain, etc."
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? "Saving..." : "Save Team"}
      </button>
    </form>
  );
}
