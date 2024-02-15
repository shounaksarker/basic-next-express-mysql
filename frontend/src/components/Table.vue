<template>
  <div class="container mx-auto w-full">
    <div class="w-full h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="flex flex-col">
          <div class="mb-4 flex justify-center items-center gap-x-1">
            <h3 class="text-center font-bold text-xl underline">Book List</h3>
            <span class="text-sm font-light">({{ totalBook }})</span>
          </div>
          <div class="-mb-2 py-4 flex flex-wrap flex-grow justify-between">
            <!-- top bar start -->
            <div class="flex items-center py-2">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-searcg" type="text" placeholder="Search" v-model="searchInput">
            </div>
            <div class="flex items-center py-2">
              <button
                class="inline-block px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline"
                @click.prevent="toggleInput">
                {{ newBookShowInput ? "Close" : "New Book" }}
              </button>
            </div>
          </div>
          <!-- top bar end -->

          <!-- insert new book start -->
          <div v-if="newBookShowInput" class="flex gap-x-4 my-4">
            <input
              class="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
              v-model="bookName" type="text" placeholder="Name of new book">
            <button
              class="inline-block border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-slate-600 hover:bg-slate-500 focus:outline-none focus:shadow-outline px-2 py-0"
              @click="addBook()">
              Insert
            </button>
          </div>
          <!-- insert new book end -->

          <div class="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div class="align-middle inline-block w-full shadow overflow-x-auto sm:rounded-lg border-b border-gray-200">
              <table class="min-w-full">
                <!-- HEAD start -->
                <thead>
                  <tr
                    class="bg-gray-50 border-b border-gray-200 text-xs leading-4 text-gray-500 uppercase tracking-wider">
                    <th class="px-6 py-3 text-center font-medium">
                      SL
                    </th>
                    <th class="px-6 py-3 text-center font-medium">
                      Name
                    </th>
                    <th class="px-6 py-3 text-center font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <!-- HEAD end -->
                <!-- BODY start -->
                <tbody class="bg-white">
                  <tr v-for="(book, index) in filteredBooks" :key="index" class="hover:bg-slate-100">
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center">
                      <div class="text-sm leading-5 text-gray-900">
                        {{ index + 1 }}
                      </div>
                    </td>
                    <td
                      class="px-6 py-1 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 text-gray-500">
                      <span v-if="index !== editIndex">{{ book }}</span>
                      <input v-if="index === editIndex"
                        class="appearance-none border-2 py-2 border-gray-200 rounded px-4 text-gray-700 text-center leading-tight focus:outline-none focus:border-purple-500"
                        v-model="editBookName" type="text" placeholder="Name of new book"
                        @keyup.enter="handleEdit(index)">
                    </td>
                    <td
                      class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center text-sm leading-5 font-medium flex justify-center gap-x-4">
                      <button class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                        @click="editBook(index, book)">
                        Edit
                      </button>
                      <button @click="deleteBook(index)"
                        class="text-red-600 hover:text-red-900 focus:outline-none focus:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
                <!-- BODY end -->
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Notification from '@/utils/Notification';
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      newBookShowInput: false,
      bookName: "",
      editBookName: '',
      editIndex: null,
      searchInput:"",
    };
  },
  computed: {
    ...mapState({
      bookList: "bookList"
    }),
    ...mapGetters({
      totalBook: "totalBook",
    }),
    filteredBooks() {
      const searchQuery = this?.searchInput.toLowerCase();
      let fb = this.bookList.filter((book) =>
        book.toLowerCase()?.includes(searchQuery)
      );
      return fb.length>0 ? fb : this.bookList
    },
  },

  methods: {
    // <----- actions for store ----->
    ...mapActions({
      remove: "removeBookAction",
      edit: "editBookAction",
      add: "addBookAction"
    }),

    // <----- Functions for add, edit, remove and others ----->
    toggleInput() {
      this.newBookShowInput = !this.newBookShowInput;
    },
    addBook() {
      this.add(this.bookName);
      this.bookName = "";
      this.toggleInput();
    },
    deleteBook(index) {
      if (confirm("Are you sure!!")) {
        this.remove(index) // for store
      }
      else {
        Notification('info',"Delete Canceled");
      }
    },

    editBook(index, book) {
      this.editBookName = book;
      this.editIndex = index;
    },
    handleEdit(index) {
      this.edit({ index: index, name: this.editBookName }); // for store
      this.editIndex = null;

    },
  },
}
</script>