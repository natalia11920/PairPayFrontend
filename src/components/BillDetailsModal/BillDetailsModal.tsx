import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Input,
  CardBody,
  Card,
  Avatar,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { BillDetails } from "../../types/Bill";
import {
  getBillDetailsAPI,
  deleteBillAPI,
  updateBillAPI,
  deleteBillParticipantAPI,
} from "../../services/BillServices";
import { toast } from "react-toastify";
import { InviteUsersToBillModal } from "../InviteUsersToBillModal/InviteUsersToBillModal";
import { Icon } from "@iconify/react";
import BillParticiapntsModal from "../BillParticipantsModal/BillParticipantsModal";
import AddExpenseModal from "../CreateExpenseModal/CreateExpenseModal";
import ExpenseDetailsModal from "../ExpenseDetailsModal/ExpenseDetailsModal";
import { ConfirmationModal } from "../ModalHelpers/ConfirmationModal";

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
  const [selectedExpenseId, setSelectedExpenseId] = useState<
    number | undefined
  >(undefined);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showParticiapntsModal, setShowParticiapntsModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    name: "",
    label: "",
  });

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

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

  const handleExpenseClick = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
  };

  const handleRemoveParticipant = async (participantId: number) => {
    if (!billId) return;

    await deleteBillParticipantAPI(billId, participantId);
    await fetchBillDetails();
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
                <div className="w-full flex justify-between items-center">
                  {editMode ? (
                    <div className="space-y-2 w-full">
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
                        className="w-full"
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
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold">
                        {billDetails?.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {billDetails?.label}
                      </p>
                    </div>
                  )}
                  {billDetails?.user_creator.id === userId && (
                    <Button
                      isIconOnly
                      color="default"
                      variant="light"
                      onPress={() => setEditMode(!editMode)}
                    >
                      <Icon
                        icon={editMode ? "mdi:close" : "mdi:pencil"}
                        width={20}
                      />
                    </Button>
                  )}
                </div>
              </ModalHeader>
              <ModalBody>
                {billDetails && (
                  <div className="space-y-6">
                    <div className="bg-content2 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 text-lg">
                        General Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Total Amount</p>
                          <p className="text-xl font-bold text-secondary">
                            ${billDetails.total_sum}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Created</p>
                          <p>
                            {new Date(billDetails.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-content2 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Participants</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="secondary"
                            onPress={() => setShowParticiapntsModal(true)}
                          >
                            Show all
                          </Button>
                          {billDetails.user_creator.id === userId && (
                            <Button
                              isIconOnly
                              color="secondary"
                              variant="flat"
                              size="sm"
                              onPress={() => setShowInviteModal(true)}
                              aria-label="Invite Users"
                            >
                              <Icon icon="mdi:plus" width={18} height={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="space-y-3">
                          {billDetails.users.map((user) => (
                            <div
                              key={user.id}
                              className="flex justify-between items-center p-3 rounded-md bg-content3 hover:bg-content4 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar
                                  name={user.name}
                                  icon={user.name}
                                  alt={user.name}
                                  size="sm"
                                  color="secondary"
                                />
                                <div>
                                  <p className="font-medium text-sm">
                                    {user.name} {user.surname}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {user.mail}
                                  </p>
                                </div>
                              </div>
                              {billDetails.user_creator.id === userId && (
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="flat"
                                  size="sm"
                                  onPress={() =>
                                    handleRemoveParticipant(user.id)
                                  }
                                >
                                  <Icon
                                    icon="mdi:delete"
                                    width={18}
                                    height={18}
                                  />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-content2 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">Expenses</h3>
                        <Button
                          isIconOnly
                          color="secondary"
                          variant="flat"
                          size="sm"
                          onPress={() => setShowAddExpenseModal(true)}
                          aria-label="Add Expense"
                        >
                          <Icon icon="mdi:plus" width={18} height={18} />
                        </Button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        <div className="space-y-4">
                          {Object.entries(billDetails.expenses).map(
                            ([expenseId, expense]) => (
                              <Card
                                key={expense.id}
                                isPressable
                                onPress={() => handleExpenseClick(expense.id)}
                                className="w-full"
                              >
                                <CardBody className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-semibold text-lg">
                                        {expense.name}
                                      </h4>
                                      <p className="text-sm text-gray-400">
                                        Paid by: {expense.payer.name}
                                      </p>
                                    </div>
                                    <span className="text-2xl font-bold text-secondary">
                                      ${expense.price}
                                    </span>
                                  </div>
                                </CardBody>
                              </Card>
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
                  {billDetails?.user_creator.id === userId && editMode && (
                    <Button
                      color="secondary"
                      onPress={handleSaveChanges}
                      className="mr-2"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
                <div>
                  {billDetails?.user_creator.id === userId && (
                    <Button
                      color="danger"
                      variant="flat"
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

      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        billId={billDetails?.id}
        billParticipants={billDetails?.users || []}
        billCreator={billDetails?.user_creator}
        onExpenseAdded={() => {
          fetchBillDetails();
          setShowAddExpenseModal(false);
        }}
      />

      <ExpenseDetailsModal
        isOpen={!!selectedExpenseId}
        onClose={() => setSelectedExpenseId(undefined)}
        expenseId={selectedExpenseId}
        billId={billDetails?.id}
        userId={userId}
        onExpenseDeleted={fetchBillDetails}
      />

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          handleDeleteBill();
          setShowConfirmation(false);
        }}
        message={
          "Are you sure you want to delete this bill? This action cannot be undone."
        }
      />
    </>
  );
};

export default BillDetailsModal;
