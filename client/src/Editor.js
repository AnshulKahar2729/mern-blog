import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const Editor = React.memo((props) => {
  const editor = useRef(null);

  const config = {
    placeholder: "Start writing your post here...",
  };

  return (
    <JoditEditor
      config={config}
      ref={editor}
      value={props.value}
      tabIndex={1} // tabIndex of textarea
      onChange={props.onChange}
    />
  );
});

export default Editor;
