import { useState } from "react";
import Input from "./Input";

interface EmployeeFormProps {
  initial?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  loading: boolean;
  onSubmit: (data: any) => void;
}

export default function EmployeeForm({
  initial = {},
  loading,
  onSubmit,
}: EmployeeFormProps) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const form = e.target as HTMLFormElement;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLInputElement).value;

    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");

    onSubmit({ name, email, phone, role });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-600">{error}</div>}

      <Input label="Name" name="name" defaultValue={initial.name} required />
      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={initial.email}
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="text"
        defaultValue={initial.phone}
      />
      <Input
        label="Role"
        name="role"
        type="text"
        defaultValue={initial.role}
        placeholder="Manager / Developer / Designer"
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? "Saving..." : "Save Employee"}
      </button>
    </form>
  );
}
