import Notification from "@/utils/Notification";
import { BOOKS_ENDPOINT } from "../../utils/apiEndPoints";
import router from "@/router/routes";
import TokenValidity from "@/utils/TokenValidity";

export default {
  namespaced: true,

  // <-------------------------- State ------------------------>

  state() {
    return {
      bookList: [],
    };
  },
  getters: {
    totalBook(state) {
      return state.bookList?.length;
    },
    bookList(state) {
      return state.bookList;
    },
  },

  // <-------------------------- mutations ------------------------>

  mutations: {
    ADD_BOOK(state, data) {
      state.bookList.push({ ...data, created_at: new Date() });
    },

    REMOVE_BOOK(state, data) {
      state.bookList = state.bookList.filter((book) => book.bookID != data.id);
    },

    EDIT_BOOK(state, data) {
      state.bookList = state.bookList.map((book) => {
        if (book.bookID === data.book.bookID) {
          return {
            ...book,
            ...data.editedInfo,
          };
        }
        return book;
      });
    },

    GET_ALL_BOOKS(state, payload) {
      state.bookList = payload.data;
    },
  },

  // <-------------------------- Actions ------------------------>

  actions: {
    // ----------- insert book ---------
    async addBookAction({ commit }, payload) {
      try {
        await fetch(`${BOOKS_ENDPOINT}/insertBook`, {
          method: "POST",
          body: JSON.stringify(payload.bookDetails),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            token: payload.token,
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (!TokenValidity(response)) {
              return;
            }
            if (response.success) {
              Notification("success", "Book has been created");
              commit("ADD_BOOK", payload.bookDetails);
            } else {
              Notification("warning", response.data);
            }
          });
      } catch (error) {
        console.log("catch err", error);
      }
    },

    // ------------ delete / remove book -------------
    async removeBookAction({ commit }, payload) {
      try {
        await fetch(`${BOOKS_ENDPOINT}/${payload.id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            token: payload.token,
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (!TokenValidity(response)) {
              return;
            }
            if (response.success) {
              Notification("warning", "Book has been deleted");
              commit("REMOVE_BOOK", payload);
            } else {
              Notification("warning", response.data);
            }
          });
      } catch (error) {
        console.log("catch err", error);
      }
    },

    // -------------- edit book ----------------
    async editBookAction({ commit }, payload) {
      try {
        await fetch(`${BOOKS_ENDPOINT}/${payload.id}`, {
          method: "PUT",
          body: JSON.stringify(payload.editedInfo),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            token: payload.token,
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (!TokenValidity(response)) {
              return;
            }
            if (response.success) {
              Notification("info", "Book has been updated");
              commit("EDIT_BOOK", payload);
            } else {
              Notification("warning", response.data);
            }
          });
      } catch (error) {
        console.log("catch err", error);
      }
    },

    // --------- get book list / all books -----------
    async getAllBooksAction({ commit }, payload) {
      await fetch(`${BOOKS_ENDPOINT}/allbooks`, {
        method: "GET",
        headers: {
          token: payload,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (!TokenValidity(response)) {
            return;
          }
          if (response.success) {
            commit("GET_ALL_BOOKS", response);
            return;
          } else {
            Notification("error", response.data);
            return;
          }
        })
        .catch((err) => console.error(err));
    },
  },
};
