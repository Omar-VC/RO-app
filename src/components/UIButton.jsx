export default function UIButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const base =
    "font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md focus:outline-none";

  const styles = {
    gold: {
      backgroundColor: "var(--color-dorado)",
      color: "var(--color-fondo)",
      boxShadow: "0 0 5px var(--color-dorado)",
    },
    primary: {
      backgroundColor: "var(--color-secundario)",
      color: "var(--color-texto)",
    },
    secondary: {
      backgroundColor: "var(--color-card)",
      color: "var(--color-texto)",
    },
    success: {
      backgroundColor: "green",
      color: "#fff",
    },
    danger: {
      backgroundColor: "darkred",
      color: "#fff",
    },
  };

  const hoverStyles = {
    gold: {
      backgroundColor: "var(--color-dorado-claro)",
      boxShadow: "0 0 10px var(--color-dorado-claro)",
    },
    primary: {
      backgroundColor: "var(--color-acento)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={base}
      style={styles[variant]}
      onMouseEnter={(e) =>
        Object.assign(e.target.style, hoverStyles[variant] || {})
      }
      onMouseLeave={(e) =>
        Object.assign(e.target.style, styles[variant] || {})
      }
    >
      {children}
    </button>
  );
}
