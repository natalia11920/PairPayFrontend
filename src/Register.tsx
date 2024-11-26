import { useState, ChangeEvent } from "react";
import { Input, Card, CardBody, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { useNavigate } from "react-router-dom";

type RegisterState = {
  name: string;
  surname: string;
  mail: string;
  password: string;
  errorMessage: string;
};

export default function Register() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          mail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        alert("Utworzono konto!");
        navigate("/#");
      } else {
        setErrorMessage(data.message || "Rejestracja nie powiodła się");
      }
    } catch (error) {
      console.error("Błąd podczas rejestracji:", error);
      setErrorMessage("Wystąpił problem z połączeniem");
    }
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 to-slate-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <h2 className="text-left text-xl font-semibold mb-5">Stwórz konto</h2>

          <Input
            type="name"
            label="Imię"
            variant="bordered"
            placeholder="Wprowadź imię"
            value={name}
            onChange={handleChange(setName)}
            className="max-w-xs mb-4"
          />

          <Input
            type="surname"
            label="Nazwisko"
            variant="bordered"
            placeholder="Wprowadź nazwisko"
            value={surname}
            onChange={handleChange(setSurname)}
            className="max-w-xs mb-4"
          />

          <Input
            type="mail"
            label="Email"
            variant="bordered"
            placeholder="Wprowadź email"
            value={mail}
            onChange={handleChange(setMail)}
            className="max-w-xs mb-4"
          />

          <Input
            label="Hasło"
            variant="bordered"
            placeholder="Wprowadź hasło"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handleChange(setPassword)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            className="max-w-xs mb-6"
          />

          {errorMessage && (
            <div className="text-red-500 text-xs mb-4">{errorMessage}</div>
          )}

          <Button
            color="primary"
            className="max-w-xs w-full font-semibold mb-5"
            onClick={handleRegister}
          >
            Zarejestruj się
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
