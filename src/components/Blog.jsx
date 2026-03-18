import Togglable from './Toggleable'

const Blog = ({ blog, incrementLikes, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <div>{blog.title}</div> <div>{blog.author} </div>
        <Togglable buttonShowLabel="view" buttonHideLabel="hide">
          <div>{blog.url}</div>
          <div>likes: {blog.likes}</div>
          <button onClick={incrementLikes}>like</button>
          <div>added by {blog.user.name}</div>
          <button onClick={deleteBlog}>delete</button>
        </Togglable>
      </div>
    </div>
  )}

export default Blog