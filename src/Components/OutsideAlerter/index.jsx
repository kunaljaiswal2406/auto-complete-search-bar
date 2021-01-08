import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that handles action clicks outside of the passed ref
 */
function useOutsideAlerter(ref, actionHandler) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        actionHandler();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, actionHandler]);
}

/**
 * Component that handles action if you click outside of it
 */
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.actionHandler);

  return <div ref={wrapperRef}>{props.children}</div>;
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
  actionHandler: PropTypes.func.isRequired,
};

export default OutsideAlerter;
