<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <label for="login">Login</label>
          <input
            type="text"
            v-model="login"
            id="login"
            placeholder="Enter your login"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="btn-submit">Sign In</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="signup-link">
        Don't have an account?
        <router-link to="/register" class="link">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/signin/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: this.login,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("userId", data.id);
          this.$router.push("/home");
        } else {
          this.errorMessage = "Invalid login credentials.";
        }
      } catch (error) {
        this.errorMessage = "Failed to connect to the server.";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e9f5e9; /* Light green background */
}

.login-box {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h2 {
  color: #2f7d32; /* Dark green for the heading */
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  color: #2f7d32;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #c8e6c9;
  border-radius: 5px;
  margin-top: 0.5rem;
  outline: none;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #4caf50; /* Focus border green */
}

.btn-submit {
  background-color: #4caf50; /* Button green */
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
}

.btn-submit:hover {
  background-color: #388e3c; /* Hover button green */
}

.error-message {
  color: #d32f2f; /* Error message red */
  margin-top: 1rem;
}

.signup-link {
  margin-top: 1rem;
  color: #333;
}

.signup-link .link {
  color: #4caf50; /* Link color */
  text-decoration: none;
  font-weight: bold;
}

.signup-link .link:hover {
  text-decoration: underline;
}
</style>
