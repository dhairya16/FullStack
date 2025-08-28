import { useState } from "react";

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => setVisible(!visible);

  const showWhenVisible = { display: visible ? "" : "none" };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    updateBlog(updatedBlog);
  };

  const handleDelete = () => {
    if (!window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }
    deleteBlog(blog.id);
  };

  const showWhenUserMatchesWithBlog = {
    display: blog.user.username === user.username ? "" : "none",
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "show"}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button style={showWhenUserMatchesWithBlog} onClick={handleDelete}>
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
