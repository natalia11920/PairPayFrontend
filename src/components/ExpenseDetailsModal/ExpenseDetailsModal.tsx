import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Avatar,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  deleteExpenseAPI,
  getExpenseAPI,
} from "../../services/ExpenseServices";
import { ConfirmationModal } from "../ModalHelpers/ConfirmationModal";

interface User {
  id: number;
  name: string;
  surname: string;
  mail: string;
  created_at: string;
}

interface Participant {
  amount_owed: number;
  user: User;
}

interface ExpenseDetails {
  id: number;
  name: string;
  price: number;
  currency: string;
  payer: User;
  participants: Participant[];
}

interface ExpenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | undefined;
  expenseId: number | undefined;
  userId: number | undefined;
  onExpenseDeleted?: () => void;
}

export const ExpenseDetailsModal = ({
  isOpen,
  onClose,
  billId,
  expenseId,
  userId,
  onExpenseDeleted,
}: ExpenseDetailsModalProps) => {
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchExpenseDetails = async () => {
    if (!billId || !expenseId) return;

    setLoading(true);
    try {
      const details = await getExpenseAPI(billId, expenseId);
      setExpenseDetails(details);
    } catch (error) {
      toast.error("Error fetching expense details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseId) return;

    try {
      setLoading(true);
      await deleteExpenseAPI(expenseId);
      toast.success("Expense deleted successfully!");
      if (onExpenseDeleted) {
        onExpenseDeleted();
      }
      onClose();
    } catch (error) {
      toast.error("Error deleting expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && billId) {
      fetchExpenseDetails();
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
                <h2 className="text-2xl font-bold">{expenseDetails?.name}</h2>
              </ModalHeader>
              <ModalBody>
                {expenseDetails && (
                  <div className="space-y-6">
                    <div className="bg-content2 rounded-lg p-4">
                      <h3 className="font-semibold mb-4 text-lg">
                        General Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Total Amount</p>
                          <p className="text-2xl font-bold text-secondary">
                            {expenseDetails.price} {expenseDetails.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Paid by</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar
                              icon={`${expenseDetails.payer.name}`}
                              size="sm"
                              color="secondary"
                            />
                            <div>
                              <p className="font-medium">
                                {expenseDetails.payer.name}{" "}
                                {expenseDetails.payer.surname}
                              </p>
                              <p className="text-xs text-gray-400">
                                {expenseDetails.payer.mail}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-content2 rounded-lg p-4">
                      <h3 className="font-semibold mb-4 text-lg">
                        Participants
                      </h3>
                      <div className="space-y-3">
                        {expenseDetails.participants.map((participant) => (
                          <div
                            key={participant.user.id}
                            className="flex justify-between items-center p-3 bg-content3 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={`${participant.user.name} ${participant.user.surname}`}
                                size="sm"
                                color="secondary"
                                icon={`${participant.user.name.charAt(0)}`}
                              />
                              <div>
                                <p className="font-medium">
                                  {participant.user.name}{" "}
                                  {participant.user.surname}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {participant.user.mail}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                Owes: {participant.amount_owed}{" "}
                                {expenseDetails.currency}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => setShowConfirmation(true)}
                  disabled={loading}
                >
                  Delete Expense
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          handleDeleteExpense();
          setShowConfirmation(false);
        }}
        message={
          "Are you sure you want to delete this expense? This action cannot be undone."
        }
      />
    </>
  );
};

export default ExpenseDetailsModal;
