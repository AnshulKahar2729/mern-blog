import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState(null);
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleContentChange = ((newContent) => {
    setContent(newContent);
  });

  const createNewPost = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <form onSubmit={createNewPost}>
        <input
          type="text"
          placeholder={"Title"}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
          }}
        />
        <input type="file" onChange={(event) => setFiles(event.target.files)} />
        <Editor value={content} onChange={handleContentChange} />
        <button
          type="submit"
          style={{
            marginTop: "5px",
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
