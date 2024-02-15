import { createStore } from "vuex";
import bookStore from "./modules/bookStore";
import userStore from "./modules/userStore";

const store = createStore({
  modules: {
    bookStore,
    userStore,
  }
});

export default store;
