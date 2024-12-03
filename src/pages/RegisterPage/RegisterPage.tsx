import React from "react";
import { Button, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
type Props = {};

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
    .required("Passoword is required"),
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
              isInvalid={!!errors.name}
              color={errors.name ? "danger" : "default"}
              errorMessage={errors.name?.message}
              {...register("name")}
              className="max-w-xs"
            />
            <Input
              label="Surname"
              placeholder="Enter your surname"
              isInvalid={!!errors.surname}
              color={errors.surname ? "danger" : "default"}
              errorMessage={errors.surname?.message}
              variant="bordered"
              {...register("surname")}
              className="max-w-xs"
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              isInvalid={!!errors.mail}
              color={errors.mail ? "danger" : "default"}
              errorMessage={errors.mail?.message}
              variant="bordered"
              {...register("mail")}
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
            <Button color="secondary" type="submit">
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
