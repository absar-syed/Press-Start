import React from 'react';

function LoginForm() {
  return (
    <div className="login-page">
      <h2>Login</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input 
          type="text" 
          name="username" 
          id="username" 
          required 
        />

        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          required 
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
