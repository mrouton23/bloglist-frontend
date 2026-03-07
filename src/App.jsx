import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
 
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [alertClassName, setAlertClassName] = useState('Error')
  // const [successMessage, setSuccessMessage] = useState('some success happened...')  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setNewLikes('')
      setAlertMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setAlertClassName('success')
      setTimeout(() => {
        setAlertMessage(null)
      }, 5000)
    })
  }


  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setAlertMessage('wrong credentials')
      setAlertClassName('error')
      setTimeout(() => {
        setAlertMessage(null)
      }, 5000)
      console.log('Error: wrong credentials')
    }
  }

  const handleLogout = event => {
    console.log('logging user out')
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const getUserFromLocal = () => {
    return JSON.parse(window.localStorage.getItem('loggedBlogappUser')).username
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input
            type="text"
            value={newTitle}
            onChange = {({ target }) => setNewTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={newAuthor}
            onChange = {({ target }) => setNewAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="url"
            value={newUrl}
            onChange = {({ target }) => setNewUrl(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          likes
          <input
            type="number"
            value={newLikes}
            onChange = {({ target }) => setNewLikes(target.value)}
          />
        </label>
      </div>
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <Notification message={alertMessage} className={alertClassName} />
      {!user && (
        <div>
          <h2>Log in to application</h2>
            {loginForm()}
        </div>
      )}
      {user && (
        <div>
          <h3>
            User {getUserFromLocal()} is logged in
            <button onClick={handleLogout}>log out</button>
          </h3> 
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
          <h2>create new</h2>
          <div>
            { blogForm() }
          </div>
        </div>
      )}
    </div>
  )
}

export default App