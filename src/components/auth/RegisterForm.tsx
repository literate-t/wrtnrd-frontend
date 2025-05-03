"use client";

import styles from "./RegisterForm.module.scss";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/common";

interface FormValue {
  username: string;
  password: string;
  confirmPassword: string;
  author: string;
  description: string;
}

const initialValues: FormValue = {
  username: "",
  password: "",
  confirmPassword: "",
  author: "",
  description: "",
};

const signupSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Not matched")
    .required("Required"),
  author: Yup.string().min(4, "At leat 4 characters").required("Required"),
  description: Yup.string()
    .min(8, "At least 8 characters")
    .required("Required"),
});

const RegisterForm = () => {
  const router = useRouter();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signupSchema}
      onSubmit={async (values: FormValue) => {
        try {
          const resp = await axios("/api/auth/register", {
            method: "POST",
            data: {
              username: values.username,
              password: values.password,
              author: values.author,
              description: values.description,
            },
          });

          if (resp.status == 200) {
            router.push("/");
          }
        } catch (e) {
          console.error("Error", e);
          notify("Register failed");
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className={styles.form}>
          <label htmlFor="username" className={styles.label}>
            Email
          </label>
          <Field id="username" name="username" className={styles.input} />
          {errors.username && touched.username ? (
            <div className={styles.error}>{errors.username}</div>
          ) : null}
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <Field
            type="password"
            id="password"
            name="password"
            className={styles.input}
          />
          {errors.password && touched.password ? (
            <div className={styles.error}>{errors.password}</div>
          ) : null}
          <label htmlFor="confirmPassword" className={styles.label}>
            Password confirm
          </label>
          <Field
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={styles.input}
          />
          {errors.confirmPassword && touched.confirmPassword ? (
            <div className={styles.error}>{errors.confirmPassword}</div>
          ) : null}
          <label htmlFor="author" className={styles.label}>
            author
          </label>
          <Field id="author" name="author" className={styles.input} />
          {errors.author && touched.author ? (
            <div className={styles.error}>{errors.author}</div>
          ) : null}
          <label htmlFor="description" className={styles.label}>
            description
          </label>
          <Field id="description" name="description" className={styles.input} />
          {errors.description && touched.description ? (
            <div className={styles.error}>{errors.description}</div>
          ) : null}
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
