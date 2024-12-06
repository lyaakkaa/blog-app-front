<template>
  <div class="sidebarMenu">
    <div v-if="menuVisible" @click="toggleMenu" class="bgOverlay"></div>
    <div v-if="menuVisible" class="menu-overlay">
      <div class="close-button">
        <i @click="toggleMenu" class="fa-solid fa-circle-left"></i>
      </div>
      <div class="menu-title">MENU</div>
      <div class="menu-buttons">
        <button @click="filterByTopic('Adventure')">Adventure Blog</button>
        <button @click="filterByTopic('Nature')">Nature Blog</button>
        <button @click="filterByTopic('Fashion')">Fashion Blog</button>
        <button @click="filterByTopic('Modern')">Modern</button>
      </div>
      <div class="menu-contacts">
        <div class="contact-title">CONTACTS</div>
        <p><strong>PHONE:</strong> +1(234)-23-45-22</p>
        <p><strong>ADDRESS:</strong> Green st., Yalow park</p>
        <p>
          <strong>EMAIL:</strong>
          <a href="mailto:Yallow@park.info">Yallow@park.info</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["menuVisible", "toggleMenu", "filterByTopic"],
};
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 30%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.menu-title {
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
  background-color: #00cc66;
}

.menu-overlay button {
  background-color: transparent;
  color: white;
  font-size: 18px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.menu-overlay button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-contacts {
  margin-top: 80px;
  color: #ddd;
  text-align: center;
}

.menu-contacts .contact-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #fff;
}

.menu-contacts p {
  margin: 5px 0;
  font-size: 1.2rem;
}

.menu-contacts a {
  color: #ff6347;
  text-decoration: none;
  transition: color 0.3s;
}

.menu-contacts a:hover {
  color: #ff4500;
}

.bgOverlay {
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 70%;
  z-index: 10;
}

.close-button {
  font-size: 32px;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .menu-overlay {
    width: 70%; /* Increase width on smaller screens */
  }

  .menu-title {
    font-size: 20px; /* Slightly reduce title font size */
  }

  .menu-overlay button {
    font-size: 16px; /* Adjust button font size */
  }

  .menu-contacts p {
    font-size: 1rem; /* Adjust contact information font size */
  }

  .menu-contacts .contact-title {
    font-size: 1.2rem; /* Adjust contact title font size */
  }
}

@media (max-width: 480px) {
  .menu-overlay {
    width: 100%; /* Full width for very small screens */
  }

  .menu-title {
    font-size: 18px; /* Further reduce title font size */
  }

  .menu-overlay button {
    font-size: 14px; /* Further reduce button font size */
    padding: 8px; /* Reduce button padding */
  }

  .menu-contacts p {
    font-size: 0.9rem; /* Further adjust contact information font size */
  }
}
</style>
