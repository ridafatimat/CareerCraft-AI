function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;