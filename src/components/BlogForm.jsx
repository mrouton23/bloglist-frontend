import { useState } from 'react'

// const BlogForm = ({onSubmit, handleChange, value}) => {
const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')

  const addBlog = event => {
    event.preventDefault()
    // const blogObject = {
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    })
    setNewTitle('')
    setNewAuthor('')
    
    setNewUrl('')
    setNewLikes('')
    // onSubmit(blogObject)
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input
            // type="text"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            // onChange = {({ target }) => setNewTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            // type="text"
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            // onChange = {({ target }) => setNewAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            // type="url"
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            // onChange = {({ target }) => setNewUrl(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          likes
          <input
            // type="number"
            value={newLikes}
            onChange={event => setNewLikes(event.target.value)}
            // onChange = {({ target }) => setNewLikes(target.value)}
          />
        </label>
      </div>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm