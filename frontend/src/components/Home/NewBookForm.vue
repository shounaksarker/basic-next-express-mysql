<script>
import { mapActions } from "vuex";
export default {
  props: ["toggleBookView"],
  data() {
    return {
      bookDetails: {
        title: "",
        author: "",
        description: "",
      },
    };
  },
  methods: {
    // <----- store's funtion ----->
    ...mapActions({
      add: "bookStore/addBookAction",
    }),

    // <----- others functions ----->
    submitAdd() {
      const token = localStorage.getItem("token");
      this.add({
        bookDetails: this.bookDetails,
        token: token,
      });
      this.bookDetails = {
        title: "",
        author: "",
        description: "",
      };
      this.toggleBookView();
    },
  },
};
</script>

<template>
  <form
    class="p-5 border rounded-lg bg-white w-full lg:w-2/3"
    @submit.prevent="submitAdd"
  >
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
        Title
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="title"
        type="text"
        placeholder="Book's Name"
        required
        v-model="bookDetails.title"
      />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="author">
        Author
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="author"
        type="text"
        placeholder="Author's Name"
        required
        v-model="bookDetails.author"
      />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-semibold mb-2">
        Description
        <textarea
          class="shadow mt-1 block border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="5"
          placeholder="About the book"
          v-model="bookDetails.description"
        ></textarea>
      </label>
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-70"
        type="submit"
        :disabled="
          this.bookDetails.title.trim() == '' ||
          this.bookDetails.author.trim() == ''
        "
      >
        Submit
      </button>
    </div>
  </form>
</template>
