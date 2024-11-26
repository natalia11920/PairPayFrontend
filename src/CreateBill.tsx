import { useState } from "react";
import { Input, Card, CardBody, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function CreateBill() {
  const [name, setName] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [total_sum, setTotal_sum] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleAdd = async (): Promise<void> => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setErrorMessage("Brak tokenu, nie możesz dodać rachunku");
      return;
    }

    if (!name || !label || !status || total_sum <= 0) {
      setErrorMessage("Wszystkie pola muszą być wypełnione, a suma musi być większa niż 0!");
      return;
    }

    
    const response = await fetch("http://localhost:5000/api/create-bill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        label,
        status,
        total_sum,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Rachunek został stworzony pomyślnie!");
      navigate("/bill");
    } else {
      setErrorMessage(data.message || "Błąd podczas tworzenia rachunku.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 to-slate-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <h2 className="text-left text-xl font-semibold mb-5">Stwórz rachunek</h2>

          <Input
            type="text"
            label="Nazwa"
            variant="bordered"
            placeholder="Wprowadź nazwę rachunku"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="max-w-xs mb-4"
          />

          <Input
            type="text"
            label="Etykieta"
            variant="bordered"
            placeholder="Wprowadź etykietę"
            value={label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
            className="max-w-xs mb-6"
          />

          <Input
            type="text"
            label="Status"
            variant="bordered"
            placeholder="Wprowadź status"
            value={status}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
            className="max-w-xs mb-6"
          />

          <Input
            type="number"
            label="Suma"
            variant="bordered"
            placeholder="Wprowadź sumę"
            value={total_sum.toString()} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotal_sum(Number(e.target.value))}
            className="max-w-xs mb-6"
          />

          {errorMessage && (
            <div className="text-red-500 text-xs mb-4">{errorMessage}</div>
          )}

          <Button
            color="primary"
            className="max-w-xs w-full font-semibold mb-5"
            onClick={handleAdd}
          >
            Dodaj rachunek
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
