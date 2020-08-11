import React from 'react';
import ReactContentEditable from 'react-contenteditable';

const ContentEditable = ({
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  onKeyDown,
  ...props
}) => {
  const onChangeRef = React.useRef(onChange);
  const onFocusRef = React.useRef(onFocus);
  const onBlurRef = React.useRef(onBlur);
  const onKeyPressRef = React.useRef(onKeyPress);
  const onKeyDownRef = React.useRef(onKeyDown);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React.useEffect(() => {
    onFocusRef.current = onFocus;
  }, [onFocus]);
  React.useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);
  React.useEffect(() => {
    onKeyPressRef.current = onKeyPress;
  }, [onKeyPress]);
  React.useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);

  return (
    <ReactContentEditable
      {...props}
      onChange={
        onChange
          ? (...args) => {
            if (onChangeRef.current) {
              onChangeRef.current(...args);
            }
          }
          : undefined
      }
      onFocus={
        onFocus
          ? (...args) => {
            if (onFocusRef.current) {
              onFocusRef.current(...args);
            }
          }
          : undefined
      }
      onBlur={
        onBlur
          ? (...args) => {
            if (onBlurRef.current) {
              onBlurRef.current(...args);
            }
          }
          : undefined
      }
      onKeyPress={
        onKeyPress
          ? (...args) => {
            if (onKeyPressRef.current) {
              onKeyPressRef.current(...args);
            }
          }
          : undefined
      }
      onKeyDown={
        onKeyDown
          ? (...args) => {
            if (onKeyDownRef.current) {
              onKeyDownRef.current(...args);
            }
          }
          : undefined
      }
    />
  );
}

export default ContentEditable;
