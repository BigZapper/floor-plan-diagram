import './modal.css';

function Modal({ open, onClose, title, children }) {
  if (!open) {
    return null;
  }
  return (
    <>
      <div className="background modal-container" onClick={onClose} />
      <div className="modal-con">
        <div className="modal-head">
          <div className="modal-tit">{title}</div>
          <div className="modal-close">
            <i className="fa fa-times-circle btn-icon" onClick={onClose}></i>
          </div>
        </div>
        <div className="modal-body-c">{children}</div>
      </div>
    </>
  );
}

export default Modal;
