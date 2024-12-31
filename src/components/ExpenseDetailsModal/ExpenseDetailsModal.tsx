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
                <div className="w-full">
                  <h2 className="text-xl font-bold">{expenseDetails?.name}</h2>
                </div>
              </ModalHeader>
              <ModalBody>
                {expenseDetails && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">
                        General Information
                      </h3>
                      <div className="p-4 rounded-lg space-y-2">
                        <p>
                          Total Amount: {expenseDetails.price}{" "}
                          {expenseDetails.currency}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Paid by:</span>
                          <span>
                            {expenseDetails.payer.name}{" "}
                            {expenseDetails.payer.surname}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({expenseDetails.payer.mail})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Participants</h3>
                      <div className="space-y-2">
                        {expenseDetails.participants.map(
                          (participant, index) => (
                            <div
                              key={participant.user.id}
                              className="flex justify-between items-center p-4 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                                  {participant.user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {participant.user.name}{" "}
                                    {participant.user.surname}
                                  </p>
                                  <p className="text-sm text-gray-500">
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
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
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
