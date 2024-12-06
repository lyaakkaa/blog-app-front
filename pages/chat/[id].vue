<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="chat-container">
      <div class="messages" ref="messageContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'message',
            message.sender.id === senderId
              ? 'user-message'
              : 'receiver-message',
          ]"
        >
          <p class="message-sender">
            {{
              message.sender.id === senderId
                ? "You"
                : message.sender.person_name
            }}
          </p>
          <div class="message-content">
            <p class="message-text">{{ message.text }}</p>
            <small class="message-timestamp">
              {{ new Date(message.timestamp).toLocaleString() }}
            </small>
          </div>
        </div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type a message"
          class="message-input"
        />
        <button @click="sendMessage" class="send-button">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";

export default {
  components: {
    Header,
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      senderId: null, 
      receiverId: null, 
    };
  },
  async mounted() {
    this.senderId = parseInt(localStorage.getItem("userId"));
    this.receiverId = parseInt(this.$route.params.id);

    if (!this.senderId || !this.receiverId) {
      console.error("Sender or Receiver ID is missing.");
      return;
    }

    await this.loadMessages();
    this.scrollToBottom(); 
  },
  methods: {
    async loadMessages() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/messages/history?sender_id=${this.senderId}&receiver_id=${this.receiverId}`
        );
        if (response.ok) {
          this.messages = await response.json();
        } else {
          console.error("Failed to load messages.");
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/messages/send/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender_id: this.senderId,
              receiver_id: this.receiverId,
              text: this.newMessage.trim(),
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          this.messages.push(data.user_message, data.bot_message);
          this.newMessage = "";
          this.$nextTick(() => this.scrollToBottom()); 
        } else {
          console.error("Failed to send message.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px; 
  margin: 0 auto;
  height: 100vh;
  background-color: #f9f9f9;
  border: 1px solid #ddd; 
  border-radius: 10px; 
  overflow: hidden; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto; 
  background: #fff;
  scroll-behavior: smooth; 
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%; 
  margin-bottom: 10px; 
  animation: fadeIn 0.3s ease-in-out; 
}

.user-message {
  align-self: flex-end;
  background-color: #e1f5fe;
  border-radius: 10px 10px 0 10px; /* Углы сообщения отправителя */
  padding: 10px;
  text-align: right;
  margin-left: auto; /* Выравнивание по правой стороне */
}

.receiver-message {
  align-self: flex-start;
  background-color: #f0f0f0;
  border-radius: 10px 10px 10px 0; /* Углы сообщения получателя */
  padding: 10px;
  text-align: left;
  margin-right: auto; /* Выравнивание по левой стороне */
}

.message-sender {
  font-size: 12px;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px; /* Отступ между именем и текстом сообщения */
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.message-timestamp {
  font-size: 10px;
  color: #777;
  margin-top: 5px; /* Отступ между текстом и временем */
  text-align: right;
}

.input-container {
  display: flex;
  gap: 10px; /* Отступ между полем ввода и кнопкой */
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc; /* Разделительная линия сверху */
}

.message-input {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px; /* Сглаженные углы */
  outline: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Внутренняя тень */
}

.message-input:focus {
  border-color: #007bff; /* Цвет рамки при фокусе */
}

.send-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px; /* Сглаженные углы */
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease; /* Плавный переход цвета */
}

.send-button:hover {
  background-color: #0056b3; /* Цвет кнопки при наведении */
}

/* Анимация появления сообщений */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
