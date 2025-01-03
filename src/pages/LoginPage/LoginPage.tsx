"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Divider,
  Spinner,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

const LoginPage = () => {
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
      toast.error("Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="lg" color="secondary" />
        </div>
      )}
      <Card className="w-full max-w-md max-h-[calc(100vh-96px)] overflow-y-auto">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-default-500">Log in to your account</p>
        </CardHeader>
        <CardBody>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Input
              label="Email Address"
              placeholder="Enter your email"
              autoComplete="curent-email"
              type="email"
              variant="bordered"
              isInvalid={!!errors.mail}
              color={errors.mail ? "danger" : "default"}
              errorMessage={errors.mail?.message}
              startContent={
                <Icon icon="mdi:email" className="text-default-400" />
              }
              {...register("mail")}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              autoComplete="current-password"
              isInvalid={!!errors.password}
              color={errors.password ? "danger" : "default"}
              errorMessage={errors.password?.message}
              type={isVisible ? "text" : "password"}
              startContent={
                <Icon icon="mdi:lock" className="text-default-400" />
              }
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      icon="mdi:eye-off"
                      className="text-2xl text-default-400"
                    />
                  ) : (
                    <Icon
                      icon="mdi:eye"
                      className="text-2xl text-default-400"
                    />
                  )}
                </button>
              }
              {...register("password")}
            />
            <div className="flex justify-between items-center">
              <Link to="#" className="text-sm text-secondary">
                Forgot password?
              </Link>
            </div>
            <Button color="secondary" type="submit" disabled={loading}>
              Log In
            </Button>
          </form>
          <Divider className="my-4" />
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            className="w-full"
          >
            Continue with Google
          </Button>
          <p className="text-center text-sm mt-4">
            Need to create an account?{" "}
            <Link to="/register" className="text-secondary font-medium">
              Sign Up
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
