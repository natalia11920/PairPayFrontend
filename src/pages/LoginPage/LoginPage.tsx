"use client";

import { useState } from "react";
import { Button, Input, Divider, Spinner } from "@nextui-org/react";
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
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = (props: Props) => {
  const { loginUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(validationSchema) });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (form: LoginFormInputs) => {
    setLoading(true);
    try {
      await loginUser(form.mail, form.password);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-40">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="lg" color="secondary" />
        </div>
      )}
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
              isInvalid={!!errors.mail}
              color={errors.mail ? "danger" : "default"}
              errorMessage={errors.mail?.message}
              variant="bordered"
              {...register("mail", { required: "Email is required" })}
              className="max-w-xs"
            />
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
              isInvalid={!!errors.password}
              color={errors.password ? "danger" : "default"}
              errorMessage={errors.password?.message}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              {...register("password", { required: "Password is required" })}
            />
            <div className="flex items-center justify-start px-1 py-2">
              <Link className="text-default-500 text-sm" to="#">
                Forgot password?
              </Link>
            </div>
            <Button color="secondary" type="submit" disabled={loading}>
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
