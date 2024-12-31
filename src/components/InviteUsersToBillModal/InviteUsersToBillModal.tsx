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
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Friend } from "../../types/Friends";
import { toast } from "react-toastify";
import {
  getFriendsNotInBillAPI,
  inviteUsersToBillAPI,
} from "../../services/BillServices";

interface InviteUsersToBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | undefined;
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
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    new Set(initialSelectedUsers)
  );
  const [friends, setFriends] = useState<Friend[]>([]);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const arraySelectedUsers = Array.from(selectedUsers);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const friends = await getFriendsNotInBillAPI(billId);
      setFriends(friends);
    } catch (error) {
      toast.error("Error fetching friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !prevIsOpen) {
      fetchFriends();
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
                {loading ? (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <Spinner color="secondary" size="lg" />
                  </div>
                ) : (
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
                            color="secondary"
                            size="sm"
                            icon={item.name.charAt(0)}
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
                )}
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
