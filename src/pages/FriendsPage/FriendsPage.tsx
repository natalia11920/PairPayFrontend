import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Modal,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  ModalContent,
  Avatar,
  Chip,
} from "@nextui-org/react";
import {
  getFriendsAPI,
  sendFriendRequestAPI,
} from "../../services/FriendShipServices";
import { Friend } from "../../types/Friends";
import {
  getUserInfoByEmailAPI,
  getUsersEmailsAPI,
} from "../../services/UserServices";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [allEmails, setAllEmails] = useState<string[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState<Friend | null>();
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const friendsData = await getFriendsAPI();
      setFriends(friendsData);

      const indexedEmails = await fetchIndexedEmails();
      setAllEmails(indexedEmails);
    } catch (error) {
      toast.error("Error fetching friends or emails:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchIndexedEmails = async (): Promise<string[]> => {
    const emails = await getUsersEmailsAPI();
    return emails;
  };

  const handleSendFriendRequest = async () => {
    if (!newFriendEmail) {
      setRequestStatus("Please enter a valid email.");
      return;
    }

    try {
      await sendFriendRequestAPI(newFriendEmail);
      setRequestStatus(`Friend request sent to ${newFriendEmail}.`);
      setNewFriendEmail("");
      onClose();
      toast.success("Friend request sent successfully!");
    } catch (error) {
      toast.error("Error sending friend request");
      setRequestStatus("Failed to send friend request.");
    }
  };

  const handleEmailChange = (email: string) => {
    setNewFriendEmail(email);
    const filteredSuggestions = allEmails.filter((suggestion) =>
      suggestion.toLowerCase().includes(email.toLowerCase())
    );
    setEmailSuggestions(filteredSuggestions);
  };

  const calculateNetDebt = (debtInfo: Friend["debt_info"]) => {
    if (Array.isArray(debtInfo)) {
      return debtInfo.reduce((acc, debt) => acc + (debt.net_debt || 0), 0);
    }
    return 0;
  };

  const getDebtStatusColor = (debtInfo: Friend["debt_info"]) => {
    const netDebt = calculateNetDebt(debtInfo);
    if (netDebt === 0) return "default";
    return netDebt > 0 ? "success" : "danger";
  };

  const formatDebtAmount = (debtInfo: Friend["debt_info"]) => {
    const netDebt = calculateNetDebt(debtInfo);
    if (netDebt === 0) return "No debt";
    const amount = Math.abs(netDebt);
    return netDebt > 0
      ? `They owe you $${amount.toFixed(2)}`
      : `You owe $${amount.toFixed(2)}`;
  };

  const fetchUserInfo = async (email: string) => {
    setLoadingUserInfo(true);
    try {
      const userInfo = await getUserInfoByEmailAPI(email);
      setSelectedUserInfo(userInfo);
    } catch (error) {
      toast.error("Failed to fetch user info.");
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const handleEmailSelection = (email: string) => {
    setNewFriendEmail(email);
    setEmailSuggestions([]);
    fetchUserInfo(email);
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4 max-w-4xl mx-auto">
      <Card className="w-full shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center px-6 py-4">
          <h2 className="text-2xl font-bold">Friends List</h2>
          <Button
            color="secondary"
            onPress={onOpen}
            startContent={<Icon icon="mdi:account-plus" width={20} />}
          >
            Add New Friend
          </Button>
        </CardHeader>
        <CardBody className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <Card
                    key={friend.id}
                    isPressable
                    className="w-full hover:shadow-md transition-shadow duration-200"
                  >
                    <CardBody className="flex flex-row justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          icon={`${friend.name}`}
                          size="md"
                          color="secondary"
                        />
                        <div>
                          <p className="text-base font-semibold">
                            {friend.mail}
                          </p>
                          <p className="text-xs text-gray-500">
                            {friend.name} {friend.surname}
                          </p>
                        </div>
                      </div>
                      <Chip
                        color={getDebtStatusColor(friend.debt_info)}
                        variant="flat"
                      >
                        {formatDebtAmount(friend.debt_info)}
                      </Chip>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2">
                  No friends found. Add some friends to get started!
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-lg font-bold">Add a New Friend</h2>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    // type="email"
                    label="Friend's Email"
                    placeholder="Enter friend's email"
                    value={newFriendEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    variant="bordered"
                    endContent={
                      <Icon
                        icon="mdi:email-outline"
                        width={24}
                        className="text-default-400 pointer-events-none flex-shrink-0"
                      />
                    }
                  />
                  {emailSuggestions.length > 0 && (
                    <Card>
                      <CardBody className="p-2">
                        <ul className="divide-y divide-gray-200">
                          {emailSuggestions.map((email) => (
                            <li
                              key={email}
                              className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                              onClick={() => handleEmailSelection(email)}
                            >
                              {email}
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  )}
                  {loadingUserInfo ? (
                    <div className="flex justify-center">
                      <Spinner size="sm" color="secondary" />
                    </div>
                  ) : selectedUserInfo ? (
                    <Card className="bg-gray-100 dark:bg-gray-800">
                      <CardBody>
                        <h3 className="text-base font-semibold mb-2">
                          User Details:
                        </h3>
                        <p className="text-sm">
                          <span className="font-medium">Name:</span>{" "}
                          {selectedUserInfo.name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Surname:</span>{" "}
                          {selectedUserInfo.surname}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Email:</span>{" "}
                          {selectedUserInfo.mail}
                        </p>
                      </CardBody>
                    </Card>
                  ) : null}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="secondary" onPress={handleSendFriendRequest}>
                  Send Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FriendsPage;
