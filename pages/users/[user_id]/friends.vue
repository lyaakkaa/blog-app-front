<template>
  <div>
    <Header />
    <div class="friends-container">
      <h1 class="title">Friends of User {{ userId }}</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-else-if="friends.length > 0" class="friends-list">
        <div
          v-for="friend in friends"
          :key="friend.friend.id"
          class="friend-card"
        >
          <div class="friend-info">
            <img
              :src="friend.friend.avatar || defaultAvatar"
              alt="Friend Avatar"
              class="friend-avatar"
            />
            <h2 class="friend-name">
              {{ friend.friend_name || friend.friend.person_name }}
            </h2>
          </div>
          <router-link :to="`/users/${friend.friend.id}`">
            <button class="view-profile-button">View Profile</button>
          </router-link>
        </div>
      </div>
      <p v-else class="no-friends">This user has no friends.</p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";

export default {
  components: {
    Header,
  },
  setup() {
    const route = useRoute();
    const userId = ref(null);
    const friends = ref([]);
    const errorMessage = ref("");
    const defaultAvatar =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    onMounted(async () => {
      try {
        userId.value = route.params.user_id;
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId.value}/friends`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        friends.value = await response.json();
      } catch (error) {
        console.error("Error fetching friends:", error);
        errorMessage.value = "Error fetching friends. Please try again.";
      }
    });

    return {
      userId,
      friends,
      errorMessage,
      defaultAvatar,
    };
  },
};
</script>

<style scoped>
/* Контейнер страницы */
.friends-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  background-color: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Заголовок */
.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* Карточка друга */
.friend-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  transition: box-shadow 0.3s, transform 0.2s;
}

.friend-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* Информация о друге */
.friend-info {
  display: flex;
  align-items: center;
}

/* Аватар друга */
.friend-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid #ddd;
}

/* Имя друга */
.friend-name {
  font-size: 16px;
  font-weight: 500;
  color: #444;
  margin: 0;
}

/* Кнопка просмотра профиля */
.view-profile-button {
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-profile-button:hover {
  background-color: #0056b3;
}

/* Сообщение об ошибке */
.error-message {
  color: #d9534f;
  font-size: 16px;
  margin: 20px 0;
}

/* Сообщение об отсутствии друзей */
.no-friends {
  font-size: 16px;
  color: #666;
}

/* Адаптивность */
@media (max-width: 768px) {
  .friends-container {
    padding: 15px;
    max-width: 90%;
  }

  .title {
    font-size: 20px;
  }

  .friend-card {
    flex-direction: column;
    align-items: center;
    padding: 15px;
  }

  .friend-info {
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }

  .friend-avatar {
    width: 40px;
    height: 40px;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .friend-name {
    font-size: 14px;
    text-align: center;
  }

  .view-profile-button {
    font-size: 12px;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 18px;
  }

  .friend-avatar {
    width: 30px;
    height: 30px;
  }

  .friend-name {
    font-size: 12px;
  }

  .view-profile-button {
    font-size: 10px;
    padding: 4px 8px;
  }
}
</style>
