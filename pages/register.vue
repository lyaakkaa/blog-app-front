<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Register</h2>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <label for="person_name">Name</label>
          <input
            type="text"
            v-model="person_name"
            id="person_name"
            placeholder="Enter your name"
            required
          />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            v-model="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>
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
        <button type="submit" class="btn-submit">Sign Up</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      person_name: "",
      email: "",
      login: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            person_name: this.person_name,
            email: this.email,
            login: this.login,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("userId", data.id); // Store userId in localStorage
          this.$router.push("/home"); // Redirect to home page
        } else {
          this.errorMessage =
            data.error || "Registration failed. Please try again.";
        }
      } catch (error) {
        this.errorMessage = "Failed to connect to the server.";
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e9f5e9; /* Light green background */
  padding: 1rem; /* Padding for small devices */
}

.register-box {
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
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #c8e6c9;
  border-radius: 5px;
  margin-top: 0.5rem;
  outline: none;
  font-size: 1rem;
}

input[type="text"]:focus,
input[type="email"]:focus,
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

/* Адаптивность */
@media (max-width: 768px) {
  .register-box {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .btn-submit {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .register-box {
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.2rem;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .btn-submit {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
