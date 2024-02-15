import router from "@/router/routes";
import Notification from "./Notification";

const TokenValidity = (response) => {
  if (
    !response.success &&
    (response?.data == "invalid token" || response?.data == "jwt expired")
  ) {
    Notification("error", response.data + ": please login again");
    localStorage.removeItem("token");
    router.push("/authentication");
    return false;
  }
  else{
    return true
  }
};

export default TokenValidity;
