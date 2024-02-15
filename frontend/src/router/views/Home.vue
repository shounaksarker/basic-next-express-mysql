<template>
  <!-- if user not login -->
  <div
    v-if="!userIsLoggedIn"
    class="w-screen h-screen flex flex-col justify-center items-center gap-y-2"
  >
    <h1 class="text-red-400 font-bold text-2xl">You are not logged in.</h1>
    <button
      @click.prevent="gotoLogin"
      class="text-white bg-indigo-500 px-4 py-1 rounded-lg"
    >
      Login Here
    </button>
  </div>
  <!-- for logged in user  -->
  <div v-else class="container mx-auto w-full">
    <div class="w-full h-screen bg-gray-100 px-4">
      <div class="flex items-center justify-end py-4">
        <button
          class="px-3 py-1 bg-red-400 hover:bg-red-600 rounded"
          @click.prevent="handleLogout"
        >
          Logout
        </button>
      </div>
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="flex flex-col">
          <div class="mb-4 flex justify-center items-center gap-x-1">
            <h3 class="text-center font-bold text-xl underline">Book List</h3>
            <span class="text-sm font-light">({{ totalBook }})</span>
          </div>
          <div class="-mb-2 py-4 flex flex-wrap flex-grow justify-between">
            <!-- top bar start -->
            <div class="flex items-center py-2">
              <button
                :class="[
                  'inline-block px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none focus:shadow-outline',
                  bookInsertFormShow
                    ? 'hover:bg-red-600 bg-red-400'
                    : 'bg-indigo-600 hover:bg-indigo-800',
                ]"
                @click.prevent="toggleBookView"
              >
                {{ bookInsertFormShow ? "Cancel" : "New Book" }}
              </button>
            </div>

            <div v-if="!bookInsertFormShow" class="flex items-center py-2">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-searcg"
                type="text"
                placeholder="Search"
                v-model="searchInput"
              />
            </div>
          </div>
          <!-- top bar end -->

          <!-- insert new book start -->
          <div
            v-if="bookInsertFormShow"
            class="flex justify-center items-ceter my-4"
          >
            <NewBookForm :toggleBookView="this.toggleBookView" />
          </div>
          <!-- insert new book end -->

          <div
            v-if="!bookInsertFormShow"
            class="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <!-- table start  -->
            <div
              class="align-middle inline-block w-full shadow sm:rounded-lg border-b border-gray-200"
            >
              <div class="overflow-x-auto bg-white">
                <!-- HEAD start -->
                <div
                  class="border-b border-gray-200 text-xs leading-4 text-gray-500 uppercase tracking-wider flex"
                >
                  <div class="px-6 py-3 text-center font-medium w-1/3 lg:w-1/6">
                    SL
                  </div>
                  <div class="px-6 py-3 text-center font-medium w-1/3 lg:w-1/6">
                    Name
                  </div>
                  <div class="px-6 py-3 text-center font-medium w-1/3 lg:w-1/6">
                    Author
                  </div>
                  <div class="px-6 py-3 text-center font-medium w-1/3 lg:w-1/6">
                    Description
                  </div>
                  <div class="px-6 py-3 text-center font-medium w-1/3 lg:w-1/6">
                    Created
                  </div>
                  <div class="px-6 py-3 text-center font-medium w-1/3 lg:w-1/6">
                    Actions
                  </div>
                </div>

                <!-- BODY start -->
                <div class="w-full" v-if="filteredBooks.length > 0">
                  <div
                    class="hover:bg-slate-100 flex flex-row pt-3"
                    v-for="(book, index) in filteredBooks"
                    :key="index"
                    ref="dropdown"
                  >
                    <!-- sl no  -->
                    <div
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500 capitalize break-words w-1/3 lg:w-1/6"
                    >
                      <div class="text-gray-900">
                        {{ index + 1 }}
                      </div>
                    </div>
                    <!-- name / title  -->
                    <div
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500 capitalize break-words w-1/3 lg:w-1/6"
                    >
                      <span v-if="book.bookID !== editIndex">{{
                        book.title
                      }}</span>
                      <input
                        v-if="book.bookID === editIndex"
                        class="appearance-none border-2 py-2 border-gray-200 rounded px-4 text-gray-700 text-center leading-tight focus:outline-none focus:border-purple-500"
                        v-model="editedInfo.title"
                        type="text"
                        placeholder="Name of new book"
                        @keyup.enter="submitEdit(book)"
                      />
                    </div>
                    <!-- author  -->
                    <div
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500 capitalize break-words w-1/3 lg:w-1/6"
                    >
                      <span v-if="book.bookID !== editIndex">{{
                        book.author
                      }}</span>
                      <input
                        v-if="book.bookID === editIndex"
                        class="appearance-none border-2 py-2 border-gray-200 rounded px-4 text-gray-700 text-center leading-tight focus:outline-none focus:border-purple-500"
                        v-model="editedInfo.author"
                        type="text"
                        placeholder="Name of new book"
                        @keyup.enter="submitEdit(book)"
                      />
                    </div>
                    <!-- Description -->
                    <div
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500 w-1/3 lg:w-1/6"
                    >
                      <span v-if="book.bookID !== editIndex">{{
                        book?.description
                      }}</span>
                      <input
                        v-if="book.bookID === editIndex"
                        class="appearance-none border-2 py-2 border-gray-200 rounded px-4 text-gray-700 text-center leading-tight focus:outline-none focus:border-purple-500"
                        v-model="editedInfo.description"
                        type="text"
                        placeholder="Name of new book"
                        @keyup.enter="submitEdit(book)"
                      />
                    </div>
                    <!-- created  -->
                    <div
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500 w-1/3 lg:w-1/6"
                    >
                      <span>{{
                        new Date(book?.created_at).toLocaleString()
                      }}</span>
                    </div>
                    <!-- actions -->
                    <div
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500 w-1/3 lg:w-1/6 flex justify-center gap-x-2"
                    >
                      <button
                        class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                        @click="handleEdit(book)"
                      >
                        Edit
                      </button>
                      <button
                        @click="handleDelete(book.bookID)"
                        class="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- if no books found  -->
              <div
                class="bg-white w-full text-center py-6"
                v-if="filteredBooks.length <= 0"
              >
                No book in shelf
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Notification from "@/utils/Notification";
import NewBookForm from "../../components/Home/NewBookForm.vue";
import router from "../routes";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Home ",
  components: { NewBookForm },
  data() {
    return {
      bookInsertFormShow: false,
      bookName: "",
      editedInfo: {
        title: "",
        author: "",
        description: "",
      },
      editIndex: null,
      searchInput: "",
      userIsLoggedIn: false,
    };
  },
  created() {
    this.getAllBooks();
  },
  computed: {
    ...mapGetters({
      totalBook: "bookStore/totalBook",
      bookList: "bookStore/bookList",
    }),
    filteredBooks() {
      const searchQuery = this?.searchInput.toLowerCase();
      let fb = this.bookList.filter((book) =>
        book.title.toLowerCase()?.includes(searchQuery)
      );
      return fb.length > 0 ? fb : this.bookList;
    },
  },
  mounted() {
    return {};
  },
  methods: {
    // <----- actions for store ----->
    ...mapActions({
      remove: "bookStore/removeBookAction",
      edit: "bookStore/editBookAction",
      add: "bookStore/addBookAction",
      allBooks: "bookStore/getAllBooksAction",
    }),

    // <----- Functions for add, edit, remove and others ----->
    toggleBookView() {
      this.bookInsertFormShow = !this.bookInsertFormShow;
    },
    handleDelete(id) {
      if (confirm("Are you sure!!")) {
        this.remove({ id: id, token: this.getToken() }); // for store
      } else {
        console.log("Delete Canceled");
      }
    },

    handleEdit(book) {
      this.editedInfo = {
        title: book.title,
        author: book.author,
        description: book.description,
      };
      this.editIndex = book.bookID;
    },
    submitEdit(book) {
      this.edit({
        book: book,
        id: this.editIndex,
        editedInfo: this.editedInfo,
        token: this.getToken(),
      }); // for store
      this.editIndex = null;
    },

    getAllBooks() {
      if (this.getToken()) {
        this.userIsLoggedIn = true;
        this.allBooks(this.getToken());
      }
    },

    gotoLogin() {
      router.push("/authentication");
    },
    getToken() {
      return localStorage.getItem("token");
    },
    handleLogout() {
      localStorage.removeItem("token");
      Notification("success", "Logout successful");
      this.gotoLogin();
    },

    handleClickOutside(event) {
      const dropdownElement = this.$refs.dropdown;
      if (dropdownElement && !dropdownElement.contains(event.target)) {
        // Clicked outside the dropdown, close it
        this.showDropdown = false;
        document.removeEventListener('click', this.handleClickOutside);
      }
    },
  },
};
</script>
