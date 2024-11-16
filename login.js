const users = []; // Array to simulate a user database

const registerForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');
const goToLogin = document.getElementById('go-to-login');
const goToRegister = document.getElementById('go-to-register');

const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const registerEmail = document.getElementById('register-email');

const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');

// Switch between forms
goToLogin.addEventListener('click', () => {
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
});

goToRegister.addEventListener('click', () => {
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
});

// Register user
registerForm.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = registerUsername.value.trim();
  const password = registerPassword.value.trim();
  const email = registerEmail.value.trim();

  if (users.some(user => user.username === username)) {
    alert('Username already taken. Please choose another.');
    return;
  }
   if (username && password && email) {
    users.push({ username, password, email });
    alert('Registration successful! You can now log in.');
    registerForm.querySelector('form').reset();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
  } else {
    alert('Please fill in all fields.');
  }
});

// Login user
loginForm.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    alert(`Welcome back, ${username}!`);
    loginForm.querySelector('form').reset();
    // Add your post-login logic here
  } else {
    alert('Invalid username or password.');
  }
});
