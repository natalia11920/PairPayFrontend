"use client";

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
import { Link } from "react-router-dom";

type Props = {};

type LoginFormInputs = {
  mail: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  mail: Yup.string()
    .email("Nieprawidłowy adres mail")
    .required("Mail jest wymagany"),
  password: Yup.string().required("Hasło jest wymagane"),
});

const LoginPage = (props: Props) => {
  const { loginUser, isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(validationSchema) });

  const handleLogin = (form: LoginFormInputs) => {
    loginUser(form.mail, form.password);
  };
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex items-center justify-center min-h-screen from-sky-900 to-slate-800">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Log In</p>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              {...register("mail", { required: "Email is required" })}
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
              {...register("password", { required: "Hasło jest wymagane" })}
            />
            {errors.password ? (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            ) : (
              ""
            )}
            <div className="flex items-center justify-start px-1 py-2">
              {/* <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox> */}
              <Link className="text-default-500 text-sm " to="#">
                Forgot password?
              </Link>
            </div>
            <Button color="primary" type="submit">
              Log In
            </Button>
          </form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
            >
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link to="/register" className="text-sm">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
