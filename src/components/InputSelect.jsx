export default function InputSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-medium">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="border rounded p-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
