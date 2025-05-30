const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        type="text"
        data-testid='username'
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        />
    </div>
    <div>
      password
      <input
        type="password"
        data-testid='password'
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
        />
    </div>
    <button type="submit">Log In</button>
  </form>
)

export default LoginForm