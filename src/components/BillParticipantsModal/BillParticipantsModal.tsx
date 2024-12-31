import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Friend } from "../../types/Friends";
import { toast } from "react-toastify";
import { getBillParticipantsAPI } from "../../services/BillServices";

interface BillParticiapntsModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | undefined;
}

export const BillParticiapntsModal = ({
  isOpen,
  onClose,
  billId,
}: BillParticiapntsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const friends = await getBillParticipantsAPI(billId);
      setFriends(friends);
    } catch (error) {
      toast.error("Error fetching friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className="text-xl font-bold">Bill Participants</h2>
            </ModalHeader>
            <ModalBody>
              <div>
                {loading ? (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <Spinner color="secondary" size="lg" />
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-2 p-2">
                      {friends.map((user) => (
                        <div
                          key={user.id}
                          className="flex justify-between items-center p-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">
                                {user.name} {user.surname}
                              </p>
                              <p className="text-sm text-gray-300">
                                {user.mail}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BillParticiapntsModal;
