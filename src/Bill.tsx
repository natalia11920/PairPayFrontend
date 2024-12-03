// import { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Divider,
//   CardBody,
//   CardHeader,
//   Spacer,
//   Link,
//   Spinner,
// } from "@nextui-org/react";
// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   cn,
// } from "@nextui-org/react";
// import { AddNoteIcon } from "./AddNoteIcon.jsx";
// import { CopyDocumentIcon } from "./CopyDocumentIcon.jsx";
// import { EditDocumentIcon } from "./EditDocumentIcon.jsx";
// import { DeleteDocumentIcon } from "./DeleteDocumentIcon.jsx";

// type Bill = {
//   id: number;
//   name: string;
//   label: string;
//   status: string;
//   total_sum: number;
// };

// export default function Bill() {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const iconClasses =
//     "text-xl text-default-500 pointer-events-none flex-shrink-0";

//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("access_token"));
//   }, []);

//   const handleLogout = async (): Promise<void> => {
//     try {
//       const response = await fetch("http://localhost:5000/api/logout", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       });

//       if (response.ok) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         setIsLoggedIn(false);
//         alert("Wylogowano pomyślnie!");
//       } else {
//         const data = await response.json();
//         setErrorMessage(data.message || "Logout failed");
//       }
//     } catch (error) {
//       setErrorMessage(
//         "Błąd podczas wylogowania. Sprawdź swoje połączenie internetowe."
//       );
//     }
//   };

//   async function fetchAssignedBills(): Promise<{ bills: Bill[] }> {
//     const token = localStorage.getItem("access_token");
//     if (!token) throw new Error("Brak tokena autoryzacyjnego");

//     const response = await fetch("http://localhost:5000/api/bills/assigned", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       if (response.status === 401) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//       }
//       throw new Error(errorData.message || "Błąd przy pobieraniu danych");
//     }

//     return response.json();
//   }

//   async function fetchCreatedBills(): Promise<{ bills: Bill[] }> {
//     const token = localStorage.getItem("access_token");
//     if (!token) throw new Error("Brak tokena autoryzacyjnego");

//     const responseCr = await fetch("http://localhost:5000/api/bills/created", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!responseCr.ok) {
//       const errorData = await responseCr.json();
//       if (responseCr.status === 401) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//       }
//       throw new Error(errorData.message || "Błąd przy pobieraniu danych");
//     }

//     return responseCr.json();
//   }

//   useEffect(() => {
//     const loadBills = async () => {
//       try {
//         const data = await fetchAssignedBills();
//         setBills(data.bills);
//         const data1 = await fetchCreatedBills();
//         setBills(data1.bills);
//       } catch (err: unknown) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBills();
//   }, []);

//   if (loading) {
//     return (
//       <>
//         <NavbarComponent isLoggedIn={isLoggedIn} onLogout={handleLogout} />
//         <div className="flex gap-4 items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 to-slate-800">
//           <Spinner color="secondary" />
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <NavbarComponent isLoggedIn={isLoggedIn} onLogout={handleLogout} />
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 to-slate-800">
//           <h2>Zaloguj się aby zobaczyć rachunki.</h2>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <NavbarComponent isLoggedIn={isLoggedIn} onLogout={() => {}} />
//       <div className="flex min-h-screen bg-gradient-to-b from-sky-900 to-slate-800">
//         {isLoggedIn ? (
//           <>
//             <div className="w-1/3 p-4">
//               <h2>Przypisane rachunki</h2>
//               <Spacer y={1} />
//               {bills.length === 0 ? (
//                 <h2>Nie masz przypisanych żadnych rachunków.</h2>
//               ) : (
//                 <div style={styles}>
//                   {bills.map((bill) => (
//                     <Card key={bill.id} style={cardStyle}>
//                       <CardHeader>
//                         <h2>{bill.name}</h2>
//                       </CardHeader>
//                       <CardBody>
//                         <Dropdown>
//                           <DropdownTrigger>
//                             <Button variant="bordered">Open Menu</Button>
//                           </DropdownTrigger>
//                           <DropdownMenu
//                             variant="faded"
//                             aria-label="Dropdown menu with icons"
//                           >
//                             <DropdownItem
//                               key="new"
//                               shortcut="⌘N"
//                               startContent={
//                                 <AddNoteIcon className={iconClasses} />
//                               }
//                             >
//                               Nowy wydatek
//                             </DropdownItem>
//                             <DropdownItem
//                               key="copy"
//                               shortcut="⌘C"
//                               startContent={
//                                 <CopyDocumentIcon className={iconClasses} />
//                               }
//                             >
//                               Zaproś znajomego
//                             </DropdownItem>
//                             <DropdownItem
//                               key="edit"
//                               shortcut="⌘⇧E"
//                               startContent={
//                                 <EditDocumentIcon className={iconClasses} />
//                               }
//                             >
//                               {" "}
//                               Edytuj rachunek
//                             </DropdownItem>
//                             <DropdownItem
//                               key="delete"
//                               className="text-danger"
//                               color="danger"
//                               shortcut="⌘⇧D"
//                               startContent={
//                                 <DeleteDocumentIcon
//                                   className={cn(iconClasses, "text-danger")}
//                                 />
//                               }
//                             >
//                               Usuń rachunek
//                             </DropdownItem>
//                           </DropdownMenu>
//                         </Dropdown>
//                         <h3>Kwota: {bill.total_sum} PLN</h3>
//                         <h4>Etykieta: {bill.label}</h4>
//                         <h5>Status: {bill.status}</h5>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="w-1/3 p-4">
//               <h2>Twoje rachunki</h2>
//               <Spacer y={1} />
//               {bills.length === 0 ? (
//                 <h2>Nie stworzyłeś jeszcze żadnych rachunków.</h2>
//               ) : (
//                 <div style={styles}>
//                   {bills.map((bill) => (
//                     <Card key={bill.id} style={cardStyle}>
//                       <CardHeader>
//                         <h2>{bill.name}</h2>
//                       </CardHeader>
//                       <CardBody>
//                         <Dropdown>
//                           <DropdownTrigger>
//                             <Button variant="bordered">Open Menu</Button>
//                           </DropdownTrigger>
//                           <DropdownMenu
//                             variant="faded"
//                             aria-label="Dropdown menu with icons"
//                           >
//                             <DropdownItem
//                               key="new"
//                               shortcut="⌘N"
//                               startContent={
//                                 <AddNoteIcon className={iconClasses} />
//                               }
//                             >
//                               Nowy wydatek
//                             </DropdownItem>
//                             <DropdownItem
//                               key="copy"
//                               shortcut="⌘C"
//                               startContent={
//                                 <CopyDocumentIcon className={iconClasses} />
//                               }
//                             >
//                               Zaproś znajomego
//                             </DropdownItem>
//                             <DropdownItem
//                               key="edit"
//                               shortcut="⌘⇧E"
//                               startContent={
//                                 <EditDocumentIcon className={iconClasses} />
//                               }
//                             >
//                               {" "}
//                               Edytuj rachunek
//                             </DropdownItem>
//                             <DropdownItem
//                               key="delete"
//                               className="text-danger"
//                               color="danger"
//                               shortcut="⌘⇧D"
//                               startContent={
//                                 <DeleteDocumentIcon
//                                   className={cn(iconClasses, "text-danger")}
//                                 />
//                               }
//                             >
//                               Usuń rachunek
//                             </DropdownItem>
//                           </DropdownMenu>
//                         </Dropdown>

//                         <h3>Kwota: {bill.total_sum} PLN</h3>
//                         <h4>Etykieta: {bill.label}</h4>
//                         <h5>Status: {bill.status}</h5>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="w-1/3 p-4">
//               <Button
//                 as={Link}
//                 color="secondary"
//                 href="/createBill"
//                 variant="flat"
//               >
//                 {" "}
//                 Dodaj rachunek
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center min-h-screen">
//             <h2>Zaloguj się, aby zobaczyć rachunki</h2>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// const styles: React.CSSProperties = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "16px",
//   justifyContent: "center",
// };

// const cardStyle: React.CSSProperties = {
//   width: "300px",
//   padding: "16px",
//   border: "1px solid #eaeaea",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// };
