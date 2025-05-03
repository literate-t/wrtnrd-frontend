import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import axios from "@/utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ChangeEvent, useCallback, useState } from "react";
import { debounce } from "@/utils/common";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { authAtoms } from "@/atoms/authAtoms";
import { useRecoilValue } from "recoil";

interface FormValue {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const initValues: FormValue = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const validationScheme = Yup.object({
  oldPassword: Yup.string(),
  newPassword: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Not matched"
  ),
});

const notify = (message: string) => toast(message);

const Password = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
  const { signOut } = useAuth();
  const authState = useRecoilValue(authAtoms);
  const router = useRouter();

  const checkPassword = async (value: string) => {
    try {
      await axios("/api/user/check-password", {
        method: "POST",
        data: {
          password: value,
        },
      });
      setIsPasswordCorrect(true);
    } catch (e) {
      setIsPasswordCorrect(false);
    }
  };

  const handleSubmit = async (values: FormValue) => {
    let result;
    if (authState == null) return;

    try {
      result = await axios("/api/user/change-password", {
        method: "POST",
        data: {
          newPassword: values.newPassword,
        },
      });

      notify(result.data);
      signOut(authState.id);
      router.replace("/signin");
    } catch (e: any) {
      const {
        response: { data },
      } = e;
      notify(data);
    }

    setOldPassword("");
    values.confirmNewPassword = "";
    values.newPassword = "";
  };

  const debounceCheckPassword = useCallback(
    debounce((value) => {
      checkPassword(value);
    }, 1200),
    []
  );
  const handleOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
    debounceCheckPassword(event.target.value);
  };

  return (
    <Formik
      initialValues={initValues}
      onSubmit={handleSubmit}
      validationSchema={validationScheme}
    >
      {({ errors, touched }) => (
        <Form className="mypage-home">
          <label htmlFor="old-password" className="mypage-home__label">
            Old password
          </label>
          <Field
            type="password"
            id="old-password"
            name="oldPassword"
            className="mypage-home__input"
            onChange={handleOldPassword}
            value={oldPassword}
          />
          {errors.oldPassword && touched.oldPassword ? (
            <div className="mypage-home__error">{errors.oldPassword}</div>
          ) : null}
          {isPasswordCorrect ? (
            <div className="mypage-home__correct-password">
              Correct password
            </div>
          ) : oldPassword ? (
            <div className="mypage-home__wrong-password">
              Check again password
            </div>
          ) : null}
          <label htmlFor="new-password" className="mypage-home__label">
            New password
          </label>
          <Field
            type="password"
            id="new-password"
            name="newPassword"
            className="mypage-home__input"
          />
          {errors.newPassword && touched.newPassword ? (
            <div className="mypage-home__error">{errors.newPassword}</div>
          ) : null}
          <label htmlFor="confirm-new-password" className="mypage-home__label">
            Confirm new password
          </label>
          <Field
            type="password"
            id="confirm-new-password"
            name="confirmNewPassword"
            className="mypage-home__input"
          />
          {errors.confirmNewPassword && touched.confirmNewPassword ? (
            <div className="mypage-home__error">
              {errors.confirmNewPassword}
            </div>
          ) : null}
          <button
            type="submit"
            className={`mypage-home__submit ${isPasswordCorrect ? null : "mypage-home__submit--disabled"}`}
            disabled={!isPasswordCorrect}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Password;
