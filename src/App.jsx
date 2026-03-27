import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [alertClassName, setAlertClassName] = useState('Error')

  const blogFormRef = useRef()

  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs
        .concat(returnedBlog)
        .sort((a, b) => b.likes - a.likes))
    })
  }

  const deleteBlog = async (id) => {
    if(window.confirm('Are you sure you want to delete this blog?')) {
      await blogService.deleteBlog(id)
    }
    setBlogs(blogs
      .filter(blog => blog.id !== id)
      .sort((a, b) => b.likes - a.likes))
  }

  const incrementLikes = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      await blogService.update(id, changedBlog)
      
      setBlogs(blogs
        .map(blog => blog.id !== id ? blog : changedBlog)
        .sort((a, b) => b.likes - a.likes))
    } catch (error) {
      setAlertMessage(`the blog '${blog.title}' was already removed from server. Error: ${error.message}`)
      setAlertClassName('error')
      setTimeout(() => {
        setAlertMessage(null)
      }, 5000)
      setBlogs(blogs.filter(b => b.id !== id))
    }
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

  const loginForm = () => (
    <div>
      <h3>Login</h3>
      <Togglable buttonShowLabel="login" buttonHideLabel="cancel">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={alertMessage} className={alertClassName} />
      {!user && loginForm()}
      {user && (
        <div>
          <h3>
            <p>{user.name} is logged in
              <button onClick={handleLogout}>log out</button>
            </p>
          </h3>
          <Togglable buttonShowLabel="new blog" buttonHideLabel="cancel" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <div>
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                incrementLikes={() => incrementLikes(blog.id)}
                deleteBlog={() => deleteBlog(blog.id)} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App