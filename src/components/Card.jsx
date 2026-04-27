export default function Card({ children, className = "", onClick, id }) {
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      id={id}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}
