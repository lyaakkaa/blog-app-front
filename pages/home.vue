<template>
  <div>
    <Hero />
  </div>
</template>

<script>
import Hero from "~/components/Hero.vue"; 

export default {
  components: {
    Hero,
  },
  beforeMount() {
    // Check if 'userId' is in localStorage
    if (!localStorage.getItem('userId')) {
      // Redirect to the login page if 'userId' is not found
      this.$router.push('/login');
    }
  },
};
</script>

<style>
</style>
