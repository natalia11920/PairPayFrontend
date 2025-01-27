import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Button,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { User } from "../../types/User";
import { 
  getUserInfoAPI, 
  updateUser, 
 // deleteUser, 
  getUsers, 
  makeAdmin, 
  updateUsersByAdmin 
} from "../../services/UserServices";
import { SearchIcon } from "../../components/SearchIcon/SearchIcon";
import * as Yup from "yup";

type Props = {}; // kom probny6

const UserPage = (props: Props) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loggedUData, setLoggedUData] = useState<Partial<User>>({});
  const [accountError, setAccountError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    surname: Yup.string()
      .required("Surname is required")
      .min(2, "Surname must be at least 2 characters"),
  });

  const adminValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    surname: Yup.string()
      .required("Surname is required")
      .min(2, "Surname must be at least 2 characters"),
    mail: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
  });

  const fetchData = async () => {
    setLoading(true);
    setAccountError(null);
    setAdminError(null);
    try {
      const userInfo = await getUserInfoAPI();
      setLoggedUser(userInfo);
      setLoggedUData({
        id: userInfo.id,
        name: userInfo.name,
        surname: userInfo.surname,
        mail: userInfo.mail,
        admin: userInfo.admin,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setAccountError("Failed to fetch data for this user.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      await userValidationSchema.validate(loggedUData, { abortEarly: false });
      await updateUser(loggedUData);
      console.log("User updated!");
      fetchData();
      setAccountError(null);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setAccountError(error.errors.join(", "));
      } else {
        console.error("Error updating user:", error);
        setAccountError("Failed to update user.");
      }
    }
  };

  const handleAdminUpdateUser = async () => {

    try {
      await adminValidationSchema.validate(formData, { abortEarly: false });
      await updateUsersByAdmin(formData);
      console.log("User updated successfully by admin!");
      fetchData();
      setAdminError(null);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setAdminError(error.errors.join(", "));
      } else {
        console.error("Error updating user by admin:", error);
        setAdminError("Failed to update user. Please try again.");
      }
    }
  };

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin(formData);
      console.log("User is now an admin!");
      fetchData();
    } catch (error) {
      console.error("Error making user admin:", error);
      setError("Failed to assign admin role.");
    }
  };

  const handleCheckUser = async () => {
    setLoading(true);
    setUserNotFound(false); 
    setAdminError(null);
    try {
      const userInfo = await getUsers(searchEmail);
      if (!userInfo) {
        setUserNotFound(true); 
      } else {
        setUserNotFound(false); 
        setFormData({
          id: userInfo.id,
          name: userInfo.name,
          surname: userInfo.surname,
          mail: userInfo.mail,
          admin: userInfo.admin,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAdminError("Failed to fetch user data.");
      setUserNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (loggedUser) {
      setLoggedUData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /*const handleDeleteUser = async () => {
    try {
      if (!formData) {
        setError("User ID not available.");
        return;
      }
  
      await deleteUser(formData);
      console.log("User deleted!");
      setLoggedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };*/

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <Card className="w-full max-w-md p-2">
        <Tabs aria-label="Settings Tabs">
          <Tab key="account" title="Account">
            <CardHeader>
              <h2>Account settings</h2>
            </CardHeader>
            <CardBody>
              {loggedUser ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="gap-1 flex flex-col">
                      <Input
                        label="Name"
                        placeholder="Name"
                        value={loggedUData.name || ""}
                        onChange={handleAccountChange}
                        isInvalid={!!accountError?.includes("Name")}
                        color={accountError?.includes("Name") ? "danger" : "default"}
                        name="name"
                        variant="bordered"
                        className="max-w-xs"
                      />
                      {accountError?.includes("Name") && (
                        <p className="text-danger text-xs">
                          {accountError.split(", ").find((err) => err.includes("Name"))}
                        </p>
                      )}
                    </div>
  
                    <div className="gap-1 flex flex-col">
                      <Input
                        label="Surname"
                        placeholder="Surname"
                        value={loggedUData.surname || ""}
                        onChange={handleAccountChange}
                        isInvalid={!!accountError?.includes("Surname")}
                        color={accountError?.includes("Surname") ? "danger" : "default"}
                        name="surname"
                        variant="bordered"
                        className="max-w-xs"
                      />
                      {accountError?.includes("Surname") && (
                        <p className="text-danger text-xs">
                          {accountError.split(", ").find((err) => err.includes("Surname"))}
                        </p>
                      )}
                    </div>
  
                    <Input
                      label="Email"
                      placeholder="Email"
                      value={loggedUData.mail || ""}
                      disabled
                      variant="bordered"
                      className="max-w-xs"
                    />
                  </div>
  
                  <div className="flex gap-4 mt-4">
                    <Button color="primary" onPress={handleUpdateUser}>
                      Update
                    </Button>
                  {/* <Button color="secondary" onPress={handleDeleteUser}>
                      Delete
                    </Button> */}
                  </div>
                </div>
              ) : (
                <p>No user data available.</p>
              )}
            </CardBody>
  
            <CardFooter>
              <p className="text-sm text-gray-500">Manage your account settings here.</p>
            </CardFooter>
          </Tab>
  
          {loggedUser?.admin && (
            <Tab key="admin" title="Admin">
              <CardHeader>
                <h2>Manage users settings</h2>
              </CardHeader>
              <CardBody>
                {loggedUser ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                      <Input
                        isClearable
                        label="Search User"
                        placeholder="Type to search..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onClear={() => setSearchEmail("")} 
                        className="max-w-xs"
                        startContent={
                          <SearchIcon className="text-black/50 max-w-xs dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                        }
                      />
                      <Button color="secondary" onPress={handleCheckUser}>
                        Search
                      </Button>
                    </div>
                    
                    
                      {userNotFound && (
                        <p className="text-danger text-xs mt-2">
                          No results found.
                        </p>
                      )}

                    <div className="flex flex-col gap-4">
                      <div className="gap-1 flex flex-col">
                        <Input
                          label="Name"
                          placeholder="Name"
                          value={formData.name || ""}
                          onChange={handleAdminChange}
                          isInvalid={!!adminError?.includes("Name")}
                          color={adminError?.includes("Name") ? "danger" : "default"}
                          name="name"
                          variant="bordered"
                          className="max-w-xs"
                        />
                        {adminError?.includes("Name") && (
                          <p className="text-danger text-xs">
                            {adminError.split(", ").find((err) => err.includes("Name"))}
                          </p>
                        )}
                      </div>
  
                      <div className="gap-1 flex flex-col">
                        <Input
                          label="Surname"
                          placeholder="Surname"
                          value={formData.surname || ""}
                          onChange={handleAdminChange}
                          isInvalid={!!adminError?.includes("Surname")}
                          color={adminError?.includes("Surname") ? "danger" : "default"}
                          name="surname"
                          variant="bordered"
                          className="max-w-xs"
                        />
                        {adminError?.includes("Surname") && (
                          <p className="text-danger text-xs">
                            {adminError.split(", ").find((err) => err.includes("Surname"))}
                          </p>
                        )}
                      </div>
  
                      <div className="gap-1 flex flex-col">
                        <Input
                          label="Email"
                          placeholder="Email"
                          value={formData.mail || ""}
                          onChange={handleAdminChange}
                          isInvalid={!!adminError?.includes("Email")}
                          color={adminError?.includes("Email") ? "danger" : "default"}
                          name="mail"
                          variant="bordered"
                          className="max-w-xs"
                        />
                        {adminError?.includes("Email") && (
                          <p className="text-danger text-xs">
                            {adminError.split(", ").find((err) => err.includes("Email"))}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button color="primary" onPress={handleAdminUpdateUser}>
                        Update
                      </Button>
                      <Button color="secondary" onPress={handleMakeAdmin}>
                        Make Admin
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>No user data available.</p>
                )}
              </CardBody>
              <CardFooter>
                <p className="text-sm text-gray-500">Manage users and assign admin roles.</p>
              </CardFooter>
            </Tab>
          )}
        </Tabs>
      </Card>
    </div>
  );
};  

export default UserPage;
