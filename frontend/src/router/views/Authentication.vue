<template>
  <div>
    <div class="overlay absolute inset-0 z-0 bg-black opacity-75"></div>
    <div class="flex justify-center items-center">
      <div
        class="sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-[38%] mx-auto flex flex-row justify-center items-center absolute top-[20%] gap-x-1 bg-white rounded-lg z-10"
      >
        <button
          :class="['px-4 py-2 text-white rounded-s-lg w-full cursor-pointer', loginPage ? 'bg-indigo-600' : 'bg-indigo-400']"
          @click.prevent="togglePage(true)"
        >
          Login
        </button>
        <button
          :class="['px-4 py-2 text-white rounded-e-lg w-full cursor-pointer', loginPage ? 'bg-indigo-400' : 'bg-indigo-600']"
          @click.prevent="togglePage(false)"
        >
          Signup
        </button>
      </div>
    </div>
    <div v-if="loginPage">
      <Login />
    </div>
    <div v-if="!loginPage">
      <Signup />
    </div>
  </div>
</template>
<script>
import Login from "../../components/Authentication/Login.vue";
import Signup from "../../components/Authentication/Signup.vue";
export default {
  name: "Authentication",
  components: {
    Login,
    Signup,
  },
  data() {
    return {
      loginPage: true,
    };
  },
  methods: {
    togglePage(e) {
      this.loginPage = e;
    },
  },
};
</script>
