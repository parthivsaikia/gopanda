import { type } from "arktype";

//password validation:
export const Password = type("string").narrow((password, ctx) => {
  if (password.length < 8) {
    return ctx.reject({
      expected: "longer than 8 characters",
      actual: "",
      path: ["password"],
    });
  }
  if (!/[A-Z]/.test(password)) {
    return ctx.reject({
      expected: "contain an uppercase letter.",
      actual: "",
      path: ["password"],
    });
  }
  if (!/[a-z]/.test(password)) {
    return ctx.reject({
      expected: "contain a lowercase letter",
      actual: "",
      path: ["password"],
    });
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    // Corrected regex for special characters
    return ctx.reject({
      expected: "contain a special character",
      actual: "",
      path: ["password"],
    });
  }
  if (!/\d/.test(password)) {
    return ctx.reject({
      expected: "contain a digit",
      actual: "",
      path: ["password"],
    });
  }
  return true;
});
export const UserInputUserDTOSchema = type({
  name: "string > 3",
  username: "string > 5",
  password: Password,
  email: "string.email",
  state: "string",
  country: "string",
  mobileNumber: "string",
  role: type.enumerated("Customer", "TravelAgent"),
});

export const LoginInputUserDTOSchema = type({
  username: "string",
  password: "string",
});
