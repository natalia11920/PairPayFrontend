import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { BillDetails } from "../../types/Bill";
import {
  getBillDetailsAPI,
  deleteBillAPI,
  updateBillAPI,
} from "../../services/BillServices";
import { toast } from "react-toastify";
import { InviteUsersToBillModal } from "../InviteUsersToBillModal/InviteUsersToBillModal";
import { Icon } from "@iconify/react";
import BillParticiapntsModal from "../BillParticipantsModal/BillParticipantsModal";

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
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showParticiapntsModal, setShowParticiapntsModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    name: "",
    label: "",
  });

  const fetchBillDetails = async () => {
    if (!billId) return;

    setLoading(true);
    try {
      const details = await getBillDetailsAPI(billId);
      setBillDetails(details);
      setEditedDetails({
        name: details.name,
        label: details.label,
      });
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
      toast.error("Error deleting bill");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!billId) return;

    try {
      setLoading(true);
      await updateBillAPI(billId, editedDetails);
      toast.success("Changes saved successfully!");
      fetchBillDetails();
      setEditMode(false);
    } catch (error) {
      toast.error("Error saving changes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && billId) {
      fetchBillDetails();
      setEditMode(false);
    }
  }, [isOpen, billId]);

  return (
    <>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="w-full">
                  {editMode ? (
                    <div className="space-y-2">
                      <Input
                        label="Name"
                        value={editedDetails.name}
                        onChange={(e) =>
                          setEditedDetails((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        variant="bordered"
                      />
                      <Input
                        label="Label"
                        value={editedDetails.label}
                        onChange={(e) =>
                          setEditedDetails((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        variant="bordered"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{billDetails?.name}</h2>
                      <p className="text-sm text-gray-500">
                        {billDetails?.label}
                      </p>
                    </>
                  )}
                </div>
              </ModalHeader>
              <ModalBody>
                {billDetails && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">
                        General Information
                      </h3>
                      <div className="p-2">
                        <p>Total Amount: ${billDetails.total_sum}</p>
                        <p>
                          Created:{" "}
                          {new Date(billDetails.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <h3 className="font-semibold mb-2">Participants</h3>
                          <Button
                            className="text-sm text-gray-500 mb-2"
                            variant="light"
                            onClick={() => setShowParticiapntsModal(true)}
                          >
                            Show all
                          </Button>
                        </div>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white"
                          onClick={() => setShowInviteModal(true)}
                          aria-label="Invite Users"
                        >
                          <Icon icon="mdi:plus" width={18} height={18} />
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="space-y-2 p-2">
                          {billDetails.users.map((user) => (
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
                                  <p className="text-sm text-gray-500">
                                    {user.mail}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Expenses</h3>
                      <div className="max-h-48 overflow-y-auto">
                        <div className="space-y-4 p-2">
                          {Object.entries(billDetails.expenses).map(
                            ([expenseId, expense]) => (
                              <div key={`expense-${expenseId}`} className="p-2">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-6 ">
                                    <h4 className="font-semibold text-lg">
                                      {expense.name}
                                    </h4>
                                    <span className="text-2xl font-bold text-secondary">
                                      ${expense.price}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-1">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Paid by
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                                      {expense.payer.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {expense.payer.name}{" "}
                                        {expense.payer.surname}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {expense.payer.mail}
                                      </p>
                                    </div>
                                  </div>
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
              <ModalFooter className="flex justify-between">
                <div>
                  {billDetails?.user_creator.id === userId && (
                    <>
                      <Button
                        color="default"
                        variant="light"
                        onPress={() => setEditMode(!editMode)}
                      >
                        {editMode ? "Cancel Edit" : "Edit"}
                      </Button>
                      {editMode && (
                        <Button
                          color="secondary"
                          onPress={handleSaveChanges}
                          className="ml-2"
                        >
                          Save Changes
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {billDetails?.user_creator.id === userId && (
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => setShowConfirmation(true)}
                      disabled={loading}
                    >
                      Delete Bill
                    </Button>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <InviteUsersToBillModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        billId={billDetails?.id}
        onSubmit={() => {}}
      />

      <BillParticiapntsModal
        isOpen={showParticiapntsModal}
        onClose={() => setShowParticiapntsModal(false)}
        billId={billDetails?.id}
      />

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this bill? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => {
                handleDeleteBill();
                setShowConfirmation(false);
              }}
            >
              Yes, Delete
            </Button>
            <Button
              color="default"
              variant="light"
              onPress={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BillDetailsModal;
