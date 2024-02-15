import Notification from "@/utils/Notification";
import { USER_ENDPOINT } from "../../utils/apiEndPoints";
import router from "@/router/routes";

export default {
  namespaced: true,
  state() {
    return {
      user: {},
    };
  },
  getters: {
    totalBook(state) {
      return state.bookList.length;
    },
  },
  mutations: {
    USER_LOGIN(state, data) {
      state.user = data;
    },
  },
  actions: {
    async userLoginAction({ commit }, payload) {
      const result = await fetch(`${USER_ENDPOINT}/login`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success === false) {
            Notification('error',response.data);
            return
          }
          if (response?.success && response?.status === 200) {
            Notification('success',response.data);
            localStorage.setItem("token", response.token);
            router.push("/");
            return
          } else {
            console.log("alert", response?.data);
          }
        });
      return result;
    },

    async userSignupAction({ commit }, payload) {
      const result = await fetch(`${USER_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success === false && response?.status === 500) {
            Notification('error',response.error.msg || "Error Occured");
            return
          }
          if (response.success === false && response?.status === 400) {
            Notification('error',response.data || "Error Occured");
            return
          }
          if (response?.success && response?.status === 201) {
            Notification('success',"Sign up successfull.");
            localStorage.setItem("token", response.token);
            router.push("/");
            return
          } else {
            console.log("alert", response?.data);
          }
        });
      return result;
    },
  },
};
