import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Friend } from "../../types/Friends";
import { getUserInfoByEmailAPI } from "../../services/UserServices";
import { sendFriendRequestAPI } from "../../services/FriendShipServices";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  allEmails: string[];
}

const AddFriendModal = ({
  isOpen,
  onClose,
  allEmails,
}: AddFriendModalProps) => {
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState<Friend | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  const handleEmailChange = (email: string) => {
    setNewFriendEmail(email);
    const filteredSuggestions = allEmails.filter((suggestion) =>
      suggestion.toLowerCase().includes(email.toLowerCase())
    );
    setEmailSuggestions(filteredSuggestions);
  };

  const handleEmailSelection = async (email: string) => {
    setNewFriendEmail(email);
    setEmailSuggestions([]);
    await fetchUserInfo(email);
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

  const handleSendFriendRequest = async () => {
    if (!newFriendEmail) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      await sendFriendRequestAPI(newFriendEmail);
      setNewFriendEmail("");
      onClose();
      toast.success("Friend request sent successfully!");
    } catch (error) {
      toast.error("Error sending friend request");
    }
  };

  const handleClose = () => {
    setNewFriendEmail("");
    setSelectedUserInfo(null);
    setEmailSuggestions([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className="text-lg font-bold">Add a New Friend</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
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
              <Button color="danger" variant="light" onPress={handleClose}>
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
  );
};

export default AddFriendModal;
