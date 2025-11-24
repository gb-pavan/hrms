interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-medium text-sm">{label}</label>
      <input
        {...props}
        className="border rounded-md p-2 focus:outline-blue-500"
      />
    </div>
  );
}
