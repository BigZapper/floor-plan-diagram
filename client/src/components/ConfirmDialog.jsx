import './form.css';

function ConfirmDialog({ content, onHandle }) {
  const handleYes = () => {
    onHandle(true);
  };
  const handleCancel = () => {
    onHandle(false);
  };
  return (
    <div className="dialog-con">
      <div className="dialog-title">{content}</div>
      <div className="btn-form-group">
        <div className="btn yes" onClick={handleYes}>
          Yes
        </div>
        <div className="btn btnCancel" onClick={handleCancel}>
          No
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
