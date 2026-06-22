function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="danger-button" onClick={onConfirm}>
            Delete
          </button>

          <button className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;