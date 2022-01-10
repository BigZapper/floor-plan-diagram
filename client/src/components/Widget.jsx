import React, { useState } from 'react';

function Widget({ collapsed, title, children, onClick }) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className={'widget-con'}>
      <div className="type-block" style={{ padding: 5 }}>
        <div className="inline-block" onClick={handleClick}>
          <i
            className={
              isCollapsed
                ? 'fa fa-caret-right btn-icon'
                : 'fa fa-caret-down btn-icon'
            }
          ></i>
          <h6 className="ml-4">{title}</h6>
        </div>
      </div>
      <div
        className="widget"
        style={{
          maxHeight: isCollapsed ? 0 : 300,
          transition: 'max-height 0.2s ease-out',
          overflow: 'hidden',
        }}
      >
        {!isCollapsed && children}
      </div>
    </div>
  );
}

export default Widget;
