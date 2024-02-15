<template>
  <div class="signup-1 flex items-center relative h-screen">
    <div class="container px-4 mx-auto relative z-10">
      <div class="sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 mx-auto">
        <div
          class="box bg-white p-6 md:px-12 md:pt-12 border-t-10 border-solid border-indigo-600"
        >
          <h2 class="text-3xl text-gray-800 text-center">
            Create Your Account
          </h2>

          <div class="signup-form mt-6 md:mt-12">

            <div class="border-2 border-solid rounded flex items-center mb-4">
              <div
                class="w-10 h-10 flex justify-center items-center flex-shrink-0"
              >
              <img class="w-6" :src="nameSvg" alt=""/>
              </div>
              <div class="flex-1">
                <input
                  type="text"
                  placeholder="Name"
                  class="h-10 py-1 px-3 w-full"
                  required
                  v-model="userDetails.name"
                />
              </div>
            </div>

            <div class="border-2 border-solid rounded flex items-center mb-4">
              <div
                class="w-10 h-10 flex justify-center items-center flex-shrink-0"
              >
                <img class="w-4" :src="userSvg" alt=""/>
              </div>
              <div class="flex-1">
                <input
                  type="text"
                  placeholder="Username"
                  class="h-10 py-1 px-3 w-full"
                  required
                  v-model="userDetails.username"
                />
              </div>
            </div>

            <div class="border-2 border-solid rounded flex items-center mb-4">
              <div
                class="w-10 h-10 flex justify-center items-center flex-shrink-0"
              >
              <img class="w-4" :src="envelopeSvg" alt=""/>
              </div>
              <div class="flex-1">
                <input
                  type="email"
                  placeholder="E-mail"
                  class="h-10 py-1 px-3 w-full"
                  required
                  v-model="userDetails.email"
                />
              </div>
            </div>

            <div class="border-2 border-solid rounded flex items-center mb-4">
              <div
                class="w-10 h-10 flex justify-center items-center flex-shrink-0"
              >
              <img class="w-4" :src="asteriskSvg" alt=""/>
              </div>
              <div class="flex-1">
                <input
                  type="password"
                  placeholder="Password"
                  class="h-10 py-1 px-3 w-full"
                  required
                  v-model="userDetails.password"
                />
              </div>
            </div>

            <div class="text-center mt-6 md:mt-12">
              <button
                class="bg-indigo-600 hover:bg-indigo-700 text-white text-xl py-2 px-4 md:px-6 rounded transition-colors duration-300"
                @click.prevent="userSignup()"
              >
                Sign Up <span class="far fa-paper-plane ml-2"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nameSvg from '../../assets/signature-solid.svg'
import asteriskSvg from '../../assets/asterisk-solid.svg'
import envelopeSvg from '../../assets/envelope-solid.svg'
import userSvg from '../../assets/user-solid.svg'
import { mapActions } from "vuex";
export default {
  data(){
    return{
      nameSvg: nameSvg,
      asteriskSvg: asteriskSvg,
      envelopeSvg: envelopeSvg,
      userSvg: userSvg,
      userDetails: {
        name: "",
        username:"",
        email:"",
        password: "",
      },
    }
  },
  methods: {
    // <----- actions for store ----->
    ...mapActions({
      signup: "userStore/userSignupAction",
    }),
    userSignup() {
      this.signup(this.userDetails)
    },
  },
};
</script>
