import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState({}); // [state, setState]
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) =>
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      })
    );
  }, []);

  if (!postInfo) return "Loading...";
  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{postInfo.createdAt}</time>
      <div className="author">{/* by @{postInfo.author.username} */}</div>
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
        className="content"
      />
    </div>
  );
};

export default PostPage;
