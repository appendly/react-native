import axios from "axios";
import { mapObjectToFormData } from "../wiloke-elements";

export const submitReview = results => dispatch => {
  const formData = mapObjectToFormData(results);
  console.log(formData);
  return axios
    .post("", formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    })
    .then(({ data }) => {
      if (data.status === "success") {
      } else if (data.status === "error") {
      }
    })
    .catch(console.log);
};
