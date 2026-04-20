import * as Yup from "yup";

export const ValiDateCheckLogin = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password cần tối thiếu 6 kí tự")
    .max(50, "Password tối đa 50 kí tự")
    .required("Password không được để trống"),

  email: Yup.string()
    .email("Định dạng Email không hợp lệ")
    .required("Email is required"),
});

export const ValiDateCheckSingUp = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Định dạng Email không hợp lệ")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password cần tối thiếu 6 kí tự")
    .max(50, "Password tối đa 50 kí tự")
    .required("Password không được để trống"),
});
