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
import { getBillDetailsAPI } from "../../services/BillServices";
import { toast } from "react-toastify";

interface BillDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | null;
  onUserAdded?: () => void;
}

export const BillDetailsModal = ({
  isOpen,
  onClose,
  billId,
  onUserAdded,
}: BillDetailsModalProps) => {
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBillDetails = async () => {
    if (!billId) return;

    setLoading(true);
    try {
      const details = await getBillDetailsAPI(billId);
      console.log("test");
      console.log(details);
      setBillDetails(details);
    } catch (error) {
      toast.error("Error fetching bill details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && billId) {
      fetchBillDetails();
    }
  }, [isOpen, billId]);

  return (
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
                    <h3 className="font-semibold mb-2">General Information</h3>
                    <div className="p-4 rounded-lg">
                      <p>Total Amount: ${billDetails.total_sum}</p>
                      <p>
                        Created:{" "}
                        {new Date(billDetails.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Participants</h3>
                    <div className="space-y-2">
                      {billDetails.users.map((user) => (
                        <div
                          key={user.id}
                          className="flex justify-between items-center p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.mail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Expenses</h3>
                    <div className="space-y-2">
                      {Object.entries(billDetails.expenses).map(
                        ([expenseId, expense]) => (
                          <div
                            key={`expense-${expenseId}`}
                            className="p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{expense.name}</p>
                              </div>
                              <p className="font-semibold">${expense.price}</p>
                            </div>
                            <p>Payer</p>
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
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
