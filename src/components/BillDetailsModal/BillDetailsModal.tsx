import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { BillDetails } from "../../types/Bill";
import { getBillDetailsAPI, deleteBillAPI } from "../../services/BillServices";
import { toast } from "react-toastify";
import { InviteUsersToBillModal } from "../InviteUsersToBillModal/InviteUsersToBillModal";
import { Icon } from "@iconify/react";

interface BillDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | null;
  userId: number | undefined;
  onBillDeleted?: () => void;
}

export const BillDetailsModal = ({
  isOpen,
  onClose,
  billId,
  userId,
  onBillDeleted,
}: BillDetailsModalProps) => {
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchBillDetails = async () => {
    if (!billId) return;

    setLoading(true);
    try {
      const details = await getBillDetailsAPI(billId);
      setBillDetails(details);
    } catch (error) {
      toast.error("Error fetching bill details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async () => {
    if (!billId) return;

    try {
      setLoading(true);
      await deleteBillAPI(billId);
      toast.success("Bill deleted successfully!");
      if (onBillDeleted) {
        onBillDeleted();
      }
      onClose();
    } catch (error) {
      toast.error("Error deleting bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleFinalDelete = () => {
    setShowConfirmation(false);
    handleDeleteBill();
  };

  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  useEffect(() => {
    if (isOpen && billId) {
      fetchBillDetails();
    }
  }, [isOpen, billId]);

  return (
    <>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <>
              <ModalHeader>
                <div>
                  <h2 className="text-xl font-bold">{billDetails?.name}</h2>
                  <p className="text-sm text-gray-500">{billDetails?.label}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                {billDetails && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">
                        General Information
                      </h3>
                      <div className="p-4 rounded-lg">
                        <p>Total Amount: ${billDetails.total_sum}</p>
                        <p>
                          Created:{" "}
                          {new Date(billDetails.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold mb-2">Participants</h3>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white"
                          onClick={handleOpenInviteModal}
                          aria-label="Invite Users"
                        >
                          <Icon icon="mdi:plus" width={18} height={18} />
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto pr-2">
                        <div className="space-y-2">
                          {billDetails.users.map((user) => (
                            <div
                              key={user.id}
                              className="flex justify-between items-center p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">
                                  {user.mail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Expenses</h3>
                      <div className="max-h-64 overflow-y-auto pr-2">
                        <div className="space-y-2">
                          {Object.entries(billDetails.expenses).map(
                            ([expenseId, expense]) => (
                              <div
                                key={`expense-${expenseId}`}
                                className="p-3 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium">
                                      {expense.name}
                                    </p>
                                  </div>
                                  <p className="font-semibold">
                                    ${expense.price}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600">Payer</p>
                                <div className="text-sm text-gray-600">
                                  <p className="font-medium">
                                    {expense.payer.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {expense.payer.mail}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {billDetails?.user_creator.id === userId && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleConfirmDelete}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Delete Bill"}
                  </Button>
                )}
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <InviteUsersToBillModal
        isOpen={showInviteModal}
        onClose={handleCloseInviteModal}
        billId={billId}
      />

      <Modal isOpen={showConfirmation} onClose={handleCancelDelete}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this bill? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleFinalDelete}>
              Yes, Delete
            </Button>
            <Button
              color="default"
              variant="light"
              onPress={handleCancelDelete}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
