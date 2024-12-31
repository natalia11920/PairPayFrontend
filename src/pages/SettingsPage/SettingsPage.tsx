import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
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
  deleteUser,
  getUsers,
  makeAdmin,
  updateUsersByAdmin,
} from "../../services/UserServices";
import { SearchIcon } from "../../components/SearchIcon/SearchIcon";
import { toast } from "react-toastify";

type Props = {};

const UserPage = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loggedUData, setLoggedUData] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
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
      toast.error("Error fetching data");
      setError("Failed to fetch data for this user.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!formData.name || !formData.surname) {
      setError("Name and surname are required.");
      return;
    }

    try {
      await updateUser(formData);
      toast.info("User updated!");
      fetchData();
    } catch (error) {
      toast.error("Error updating user");
      setError("Failed to update user.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      toast.info("User deleted!");
      setLoggedUser(null);
    } catch (error) {
      toast.error("Error deleting user");
      setError("Failed to delete user.");
    }
  };

  const handleCheckUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = await getUsers(searchEmail);
      setFormData({
        id: userInfo.id,
        name: userInfo.name,
        surname: userInfo.surname,
        mail: userInfo.mail,
        admin: userInfo.admin,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminUpdateUser = async () => {
    if (!formData.name || !formData.surname || !formData.mail || !formData.id) {
      setError("Name, surname, and email are required.");
      return;
    }

    try {
      await updateUsersByAdmin(formData);
      console.log("User updated successfully by admin!");
      fetchData();
      setError(null);
    } catch (error) {
      console.error("Error updating user by admin:", error);
      setError("Failed to update user. Please try again.");
    }
  };

  const handleMakeAdmin = async () => {
    if (!formData.name || !formData.surname || !formData.mail) {
      setError("Name, surname, and email are required.");
      return;
    }

    try {
      await makeAdmin(formData);
      console.log("User is now an admin!");
      fetchData();
    } catch (error) {
      console.error("Error making user admin:", error);
      setError("Failed to assign admin role.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <Card className="w-full max-w-md p-2">
        <Tabs
          aria-label="Settings Tabs"
          disabledKeys={loggedUser && !loggedUser.admin ? ["admin"] : []}
        >
          <Tab key="account" title="Account">
            <CardHeader>
              <h2>Account settings</h2>
            </CardHeader>
            <CardBody>
              {loggedUser ? (
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Name"
                    value={loggedUData.name || ""}
                    onChange={handleChange}
                    name="name"
                    variant="bordered"
                    className="max-w-xs"
                  />
                  <Input
                    label="Surname"
                    placeholder="Surname"
                    value={loggedUData.surname || ""}
                    onChange={handleChange}
                    name="surname"
                    variant="bordered"
                    className="max-w-xs"
                  />
                  <Input
                    label="Email"
                    placeholder="Email"
                    value={loggedUData.mail || ""}
                    disabled
                    variant="bordered"
                    className="max-w-xs"
                  />
                  {error && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <p className="text-red-500">{error}</p>
                    </div>
                  )}
                  <div className="flex gap-4 mt-4">
                    <Button color="primary" onPress={handleUpdateUser}>
                      Update
                    </Button>
                    <Button color="secondary" onPress={handleDeleteUser}>
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <p>No user data available.</p>
              )}
            </CardBody>
            <CardFooter>
              <p className="text-sm text-gray-300">
                Manage your account settings here.
              </p>
            </CardFooter>
          </Tab>

          <Tab key="admin" title="Admin">
            <CardHeader>
              <h2>Manage users settings</h2>
            </CardHeader>
            <CardBody>
              {loggedUser ? (
                <div className="flex flex-col gap-4 ">
                  <div className="flex flex-row gap-4">
                    <Input
                      isClearable
                      label="Search User"
                      placeholder="Type to search..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="max-w-xs"
                      startContent={
                        <SearchIcon className="text-black/50 max-w-xs dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                      }
                    />
                    <Button color="secondary" onPress={handleCheckUser}>
                      Search
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Name"
                      placeholder="Name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      name="name"
                      variant="bordered"
                      className="max-w-xs"
                    />
                    <Input
                      label="Surname"
                      placeholder="Surname"
                      value={formData.surname || ""}
                      onChange={handleChange}
                      name="surname"
                      variant="bordered"
                      className="max-w-xs"
                    />
                    <Input
                      label="Email"
                      placeholder="Email"
                      value={formData.mail || ""}
                      disabled
                      variant="bordered"
                      className="max-w-xs"
                    />
                  </div>
                  {error && (
                    <div className="relative mt-4">
                      <p className="text-red-500 text-s">{error}</p>
                    </div>
                  )}
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
              <p className="text-sm text-gray-300">
                Manage users and assign admin roles.
              </p>
            </CardFooter>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserPage;
