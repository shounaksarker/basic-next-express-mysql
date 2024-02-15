import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

// $toast.info("Book has been updated", {
//   position: "top-right",
//   duration: 4000,
// });

const option = {
  position: "top-right",
  duration: 4000,
};

const $toast = useToast();

const Notification = (type = "default", message, style = option ) => {
  try {
    if ((type == 'success') || (type == 'info') || (type == 'warning') || (type == 'error') || (type == 'default')) {
      return $toast[type](message, style);
    }
    else{
        return $toast.info(message, style);
    }
  } catch (err) {
    console.log("notification error", err);
  }
};

export default Notification;
