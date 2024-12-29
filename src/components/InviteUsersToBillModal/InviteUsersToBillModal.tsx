import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  ScrollShadow,
  Avatar,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Friend } from "../../types/Friends";
import { getFriendListAPI } from "../../services/UserServices";
import { toast } from "react-toastify";
import { inviteUsersToBillAPI } from "../../services/BillServices";

interface InviteUsersToBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | null;
  onSubmit: (billId: number | null, selectedUsers: string[]) => void;
  initialSelectedUsers?: string[];
}

export const InviteUsersToBillModal = ({
  isOpen,
  onClose,
  billId,
  onSubmit,
  initialSelectedUsers = [],
}: InviteUsersToBillModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    new Set(initialSelectedUsers)
  );
  const [friends, setFriends] = useState<Friend[]>([]);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const arraySelectedUsers = Array.from(selectedUsers);

  const fetchFriends = async () => {
    try {
      const friends = await getFriendListAPI();
      setFriends(friends);
    } catch (error) {
      toast.error("Error fetching friends");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (isOpen && !prevIsOpen) {
      setSelectedUsers(new Set(initialSelectedUsers));
    }
    setPrevIsOpen(isOpen);
  }, [isOpen, prevIsOpen, initialSelectedUsers]);

  const topContent = arraySelectedUsers.length ? (
    <ScrollShadow
      hideScrollBar
      className="w-full flex py-0.5 px-2 gap-1"
      orientation="horizontal"
    >
      {arraySelectedUsers.map((id) => (
        <Chip key={id}>
          {friends.find((friend) => `${friend.id}` === id)?.mail}
        </Chip>
      ))}
    </ScrollShadow>
  ) : null;

  const handleInvite = async () => {
    const emails = friends
      .filter((friend) => arraySelectedUsers.includes(String(friend.id)))
      .map((friend) => friend.mail);

    if (billId && emails.length > 0) {
      try {
        const response = await inviteUsersToBillAPI(billId, emails);
        onSubmit(billId, arraySelectedUsers);
        toast.success(response.message);
        onClose();
      } catch (error) {
        toast.error("Error sending invitations");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className="text-xl font-bold">Add Users to Bill</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center justify-center gap-4">
                <Listbox
                  classNames={{
                    base: "max-w-xs",
                    list: "max-h-[300px] overflow-y-auto",
                  }}
                  items={friends}
                  label="Select Users"
                  selectionMode="multiple"
                  variant="flat"
                  selectedKeys={selectedUsers}
                  topContent={topContent}
                  onSelectionChange={(keys) =>
                    setSelectedUsers(new Set(Array.from(keys) as string[]))
                  }
                >
                  {(item) => (
                    <ListboxItem key={item.id} textValue={item.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={item.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={
                            "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png"
                          }
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{item.name}</span>
                          <span className="text-tiny text-default-400">
                            {item.mail}
                          </span>
                        </div>
                      </div>
                    </ListboxItem>
                  )}
                </Listbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="secondary" onPress={handleInvite}>
                Add Users
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
