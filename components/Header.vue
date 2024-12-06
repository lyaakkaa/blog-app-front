<template>
  <header class="header">
    <div class="icon" @click="toggleMenu">
      <img src="/src/assets/menu-icon.png" alt="menu-icon" />
    </div>
    <div class="header-rectangle">
      <p>New trips on Fall season! Full details on our Instagram accounts.</p>
    </div>
    <button class="create-post-button" @click="goTo('create-post')">
      Create Post
    </button>
    <div class="profile icon" @click="toggleProfileMenu">
      <img src="/src/assets/profile-icon.png" alt="profile-icon" />
      <div v-if="isProfileMenuOpen" class="dropdown-menu">
        <ul>
          <li @click="goTo('home')">Home</li>
          <li @click="goTo('profile')">My Profile</li>
          <li @click="goTo('favorites')">Favorites</li>
          <li @click="signOut">Sign Out</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: ["toggleMenu"],
  data() {
    return {
      isProfileMenuOpen: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    goTo(page) {
      this.router.push({ path: `/${page}` }); // Navigate to the selected page
      this.isProfileMenuOpen = false; // Close the profile menu
    },
    signOut() {
      // Remove userId from localStorage
      localStorage.removeItem("userId");

      // Redirect to login page
      this.router.push("/login");

      // Close the profile menu
      this.isProfileMenuOpen = false;
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(255, 255, 255, 0.74);
  align-items: center;
  position: relative;
}

.header-rectangle {
  background: linear-gradient(
    90deg,
    #e5f67c 0%,
    #ecef64 33%,
    #d2e037 66%,
    #eaee3a 100%
  );
  width: 808px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin: 0 30px;
  flex: 1;
}

.header-rectangle p {
  font-family: "Inknut Antiqua", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 43.84px;
  color: #ff774c;
}

header .icon {
  cursor: pointer;
}

.create-post-button {
  background-color: #ff774c;
  color: #fff;
  font-family: "Inknut Antiqua", sans-serif;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 20px;
}

.create-post-button:hover {
  background-color: #ff5733;
}

.dropdown-menu {
  position: absolute;
  right: 10px;
  top: 50px;
  background: #00cc66;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 1000;
}

.dropdown-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: #f0f0f0;
}

@media (max-width: 1024px) {
  .header-rectangle {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-rectangle {
    display: none;
  }

  .header-rectangle p {
    font-size: 14px;
  }

  header {
    padding: 5px;
  }

  .create-post-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>
