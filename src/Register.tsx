import { useState } from "react";
import { Input, Card, CardBody, Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type RegisterFormInputs = {
  mail: string;
  name: string;
  surname: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  mail: Yup.string()
    .email("Nieprawidłowy adres mail")
    .required("Mail jest wymagany"),
  name: Yup.string().required("Imię jest wymagane"),
  surname: Yup.string().required("Nazwisko jest wymagane"),
  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
});

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const response = await registerUser(
        data.mail,
        data.name,
        data.surname,
        data.password
      );
    } catch (err) {
      console.error("Błąd rejestracji:", err);
      toast.error("Błąd serwera. Spróbuj ponownie później.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 to-slate-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <h2 className="text-left text-xl font-semibold mb-5">
            Zarejestruj się
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Input
                label="Imię"
                placeholder="Wprowadź imię"
                {...register("name")}
                className="max-w-xs"
              />
            </div>
            <div className="mb-4">
              <Input
                label="Nazwisko"
                placeholder="Wprowadź nazwisko"
                {...register("surname")}
                className="max-w-xs"
              />
            </div>
            <div className="mb-4">
              <Input
                label="Email"
                placeholder="Wprowadź mail"
                {...register("mail")}
                className="max-w-xs"
              />
            </div>
            <div className="mb-6">
              <Input
                label="Hasło"
                placeholder="Wprowadź hasło"
                type={isPasswordVisible ? "text" : "password"}
                {...register("password")}
                endContent={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none"
                    aria-label="toggle password visibility"
                  >
                    {isPasswordVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                className="max-w-xs"
              />
            </div>
            <Button
              color="primary"
              className="max-w-xs w-full font-semibold mb-5"
              type="submit"
            >
              Zarejestruj się
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
