import React from "react";
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type RegisterFormInputs = {
  name: string;
  surname: string;
  mail: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  mail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "The password must be at least 6 characters long")
    .required("Password is required"),
});

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({ resolver: yupResolver(validationSchema) });
  const [isVisible, setIsVisible] = React.useState(false);

  const handleRegistration = (form: RegisterFormInputs) => {
    try {
      registerUser(form.name, form.surname, form.mail, form.password);
      toast.success(
        "Account created successfully! Verify your email to login."
      );
    } catch (error) {
      toast.error("Failed to create account.");
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sm text-default-500">Sign up to get started</p>
        </CardHeader>
        <CardBody>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleRegistration)}
          >
            <Input
              label="Name"
              placeholder="Enter your name"
              variant="bordered"
              isInvalid={!!errors.name}
              color={errors.name ? "danger" : "default"}
              errorMessage={errors.name?.message}
              startContent={
                <Icon icon="mdi:account" className="text-default-400" />
              }
              {...register("name")}
            />
            <Input
              label="Surname"
              placeholder="Enter your surname"
              variant="bordered"
              isInvalid={!!errors.surname}
              color={errors.surname ? "danger" : "default"}
              errorMessage={errors.surname?.message}
              startContent={
                <Icon icon="mdi:account" className="text-default-400" />
              }
              {...register("surname")}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
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
            <Button color="secondary" type="submit">
              Sign Up
            </Button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-medium">
              Log In
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;
