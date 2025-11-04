export default function UIButton({ children, onClick, type="button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
    >
      {children}
    </button>
  );
}
