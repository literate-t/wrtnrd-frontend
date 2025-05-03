"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./SignInForm.module.scss";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { notify, setItemSessionStorage } from "@/utils/common";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  SIGN_IN_SUCCESS,
} from "@/utils/constants";

interface FormValue {
  username: string;
  password: string;
}

const initialValues: FormValue = {
  username: "",
  password: "",
};

const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const SignInForm = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const formik = useFormik<FormValue>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const resp = await axios("/api/auth/authenticate", {
          method: "POST",
          data: values,
        });

        if (resp.status == 200) {
          signIn(resp.data.id, resp.data.email);

          setItemSessionStorage(ACCESS_TOKEN, resp.data.accessToken);
          setItemSessionStorage(REFRESH_TOKEN, resp.data.refreshToken);

          router.replace("/");
          notify(SIGN_IN_SUCCESS);
        }
      } catch (e) {
        console.error("Error", e);
        notify("Login failed");
      }
    },
  });
  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          className={styles.input}
        />
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className={styles.input}
        />
        <button type="submit" className={styles.signin__button}>
          Sign in
        </button>
      </form>
      <div className={styles.signup}>
        <button
          onClick={() => router.push("/signup")}
          className={styles.signup__button}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
