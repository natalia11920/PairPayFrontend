import React, { useState, useEffect } from "react";
import NavbarComponent from "./NavbarComponent"; 
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import im from './backimage.jpg';

interface ModalItem {
  name: string;
  title: string;
  content: string;
}

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<'opaque' | 'blur'>('opaque');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const modals: ModalItem[] = [
    { name: "bills", title: "Rachunki", content: "Stwórz nowy rachunek, dodaj wydatki oraz uczestników. Podział kosztów zrobimy za Ciebie." },
    { name: "groups", title: "Grupy", content: "Stwórz grupy znajomych i uprość sobie tworzenie rachunków." },
    { name: "account", title: "Moje konto", content: "Zobacz informacje o swoim koncie." },
  ];

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("access_token");
    setIsLoggedIn(isAuthenticated);  
  }, []);

  const handleOpen = (modalName: string) => {
    setActiveModal(modalName);
    setBackdrop("blur");
    onOpen();
  };

  const handleClose = () => {
    setActiveModal(null);
    onClose();
  };

  const handleLogout = async (): Promise<void> => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Brak tokena autoryzacyjnego");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsLoggedIn(false); 
        alert("Wylogowano pomyślnie!");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Logout failed");
      }
    } catch (error) {
      setErrorMessage("Błąd podczas wylogowania. Sprawdź swoje połączenie internetowe.");
    }
  };


if (isLoggedIn === null) {
  return <div>Loading...</div>; 
}

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} onLogout={handleLogout} />  {/* Wstawiamy nasz NavbarComponent */}

      <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${im})` }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black z-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center pt-24">
          <h2 className="text-8xl font-bold text-light-100 mb-4 font-serif">PairPay</h2>
          <h3 className="text-2xl font-bold text-light-100 mb-8 font-serif">Nie martw się o podział kosztów</h3>

          <div className="flex flex-col items-center justify-start min-h-[50vh] pt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modals.map((modal) => (
                <div
                  key={modal.name}
                  onClick={() => handleOpen(modal.name)}
                  className="cursor-pointer bg-primary-100 hover:bg-gradient-to-r from-cyan-600 to-blue-600 w-100 h-60 shadow-lg p-6 rounded-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-primary-800 mb-2">{modal.title}</h3>
                  <p className="text-sm text-primary-600">{modal.content.substring(0, 60)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 mt-4 font-bold">
            {errorMessage}
          </div>
        )}

        <div className="mt-16 w-full">
          {modals.map(
            (modal) =>
              activeModal === modal.name && (
                <Modal
                  key={modal.name}
                  backdrop={backdrop}
                  isOpen={isOpen}
                  onClose={handleClose}
                  className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 mb-10"
                >
                  <ModalContent className="bg-gradient-to-r from-cyan-600 to-blue-600">
                    <ModalHeader className="flex flex-col gap-1">PairPay</ModalHeader>
                    <ModalBody>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">{modal.title}</h3>
                        <p>{modal.content}</p>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button className="cursor-pointer bg-primary-600 hover:bg-primary-300 text-white" onClick={handleClose}>
                        Zamknij
                      </Button>
                      <Button className="cursor-pointer bg-primary-600 hover:bg-primary-300 text-white" onClick={handleClose}>
                        Dowiedz się więcej
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )
          )}
        </div>
      </div>
    </>
  );
}
