import React from "react";
import {
  Button,
  Input,
  Checkbox,
  Link as NextUILink,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {};

type RegisterFormInputs = {
  name: string;
  surname: string;
  mail: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Imię jest wymagane"),
  surname: Yup.string().required("Nazwisko jest wymagane"),
  mail: Yup.string()
    .email("Nieprawidłowy adres mail")
    .required("Mail jest wymagany"),
  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
});

const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({ resolver: yupResolver(validationSchema) });
  const [isVisible, setIsVisible] = React.useState(false);

  const handleRegistration = (form: RegisterFormInputs) => {
    registerUser(form.name, form.surname, form.mail, form.password);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex items-center justify-center min-h-screen from-sky-900 to-slate-800">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Sign Up</p>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(handleRegistration)}
          >
            <Input
              label="Name"
              placeholder="Enter your name"
              variant="bordered"
              {...register("name")}
              className="max-w-xs"
            />
            <Input
              label="Surname"
              placeholder="Enter your surname"
              variant="bordered"
              {...register("surname")}
              className="max-w-xs"
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              {...register("mail")}
              className="max-w-xs"
            />
            {errors.mail ? (
              <p className="text-red-500 text-sm mt-1">{errors.mail.message}</p>
            ) : (
              ""
            )}
            <Input
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password ? (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            ) : (
              ""
            )}
            <Button color="primary" type="submit">
              Sign Up
            </Button>
          </form>
          <p className="text-center text-small">
            Want to Login?&nbsp;
            <Link to="/login" className="text-sm">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
