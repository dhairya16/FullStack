import { useState } from "react";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const showWhenVisible = { display: visible ? "" : "none" };
  const hideWhenVisible = { display: visible ? "none" : "" };

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.btnLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  );
};

export default Togglable;
