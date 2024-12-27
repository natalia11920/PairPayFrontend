import React, { useState, useEffect } from "react";
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
} from "@nextui-org/react";
import {
  getFriendsAPI,
  sendFriendRequestAPI,
} from "../../services/FriendShipServices";
import { Friend } from "../../types/Friends";
import { getUsersEmailsAPI } from "../../services/UserServices";

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [allEmails, setAllEmails] = useState<string[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const friendsData = await getFriendsAPI();
        setFriends(friendsData);

        const indexedEmails = await fetchIndexedEmails();
        setAllEmails(indexedEmails);
      } catch (error) {
        console.error("Error fetching friends or emails:", error);
      } finally {
        setLoading(false);
      }
    };

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
    } catch (error) {
      console.error("Error sending friend request:", error);
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
    if (netDebt === 0) return "text-gray-600";
    return netDebt > 0 ? "text-green-600" : "text-red-600";
  };

  const formatDebtAmount = (debtInfo: Friend["debt_info"]) => {
    const netDebt = calculateNetDebt(debtInfo);
    if (netDebt === 0) return "No debt";
    const amount = Math.abs(netDebt);
    return netDebt > 0
      ? `They owe you $${amount.toFixed(2)}`
      : `You owe $${amount.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <Card className="w-full max-w-3xl p-2">
        <CardHeader>
          <h2 className="text-2xl font-bold">Friends List</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <Card key={friend.id} isPressable className="w-full">
                    <CardBody className="flex flex-row justify-between items-center p-4">
                      <div>
                        <p className="text-lg font-semibold">{friend.mail}</p>
                      </div>
                      <div className={getDebtStatusColor(friend.debt_info)}>
                        <p className="font-medium">
                          {formatDebtAmount(friend.debt_info)}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-600">No friends found.</p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Button color="secondary" onPress={onOpen}>
        Add New Friend
      </Button>

      {/* Modal for adding a new friend */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-bold">Add a New Friend</h2>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Enter friend's email"
                    value={newFriendEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full"
                  />
                  {emailSuggestions.length > 0 && (
                    <ul className="rounded shadow-lg p-2">
                      {emailSuggestions.map((email) => (
                        <li
                          key={email}
                          className="cursor-pointer p-1 rounded hover:bg-gray-600"
                          onClick={() => {
                            setNewFriendEmail(email);
                            setEmailSuggestions([]);
                          }}
                        >
                          {email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSendFriendRequest}>
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
