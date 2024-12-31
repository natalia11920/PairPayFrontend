import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Avatar,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { User } from "../../types/User";
import { createExpenseAPI } from "../../services/ExpenseServices";
import { useState } from "react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: number | undefined;
  billParticipants: Array<User>;
  billCreator: User | undefined;
  onExpenseAdded: () => void;
}

const AddExpenseModal = ({
  isOpen,
  onClose,
  billId,
  billParticipants,
  billCreator,
  onExpenseAdded,
}: AddExpenseModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    currency: "USD",
    payer: 0,
    participants: [] as number[],
  });

  const participants = [
    ...new Map(
      [...billParticipants, billCreator]
        .filter(Boolean)
        .map((user) => [user?.id, user])
    ).values(),
  ];

  const handleSubmit = async () => {
    if (!billId) return;

    if (
      !formData.name ||
      formData.price <= 0 ||
      !formData.payer ||
      formData.participants.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await createExpenseAPI(billId, formData);

      console.log(response);

      toast.success("Expense added successfully!");
      onExpenseAdded();
      onClose();
      setFormData({
        name: "",
        price: 0,
        currency: "USD",
        payer: 0,
        participants: [],
      });
    } catch (error) {
      toast.error("Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  const currencies = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "PLN", value: "PLN" },
  ];

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Add New Expense</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <Input
              label="Expense Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              variant="bordered"
              isRequired
            />

            <div className="flex gap-4">
              <Input
                label="Amount"
                type="number"
                value={formData.price.toString()}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setFormData((prev) => ({ ...prev, price: value }));
                  } else {
                    setFormData((prev) => ({ ...prev, price: 0 }));
                  }
                }}
                variant="bordered"
                className="flex-1"
                isRequired
              />

              <Select
                label="Currency"
                selectedKeys={[formData.currency]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="w-32"
              >
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    textValue={currency.label}
                  >
                    {currency.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Select
              label="Paid By"
              selectedKeys={formData.payer ? [formData.payer.toString()] : []}
              onChange={(e) => {
                const selectedKey = e.target.value;
                if (selectedKey) {
                  setFormData((prev) => ({
                    ...prev,
                    payer: parseInt(selectedKey),
                  }));
                }
              }}
              variant="bordered"
              isRequired
            >
              {participants.map((user) => (
                <SelectItem
                  key={user?.id?.toString() || ""}
                  value={user?.id.toString()}
                  textValue={`${user?.name} ${user?.surname}`}
                >
                  {user?.name} {user?.surname}
                </SelectItem>
              ))}
            </Select>

            <div>
              <p className="text-sm font-medium mb-2">Split Between</p>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-content2 rounded-lg">
                {participants.map((user) => (
                  <Checkbox
                    key={user?.id}
                    color="secondary"
                    isSelected={
                      user ? formData.participants.includes(user.id) : false
                    }
                    onValueChange={(checked) => {
                      if (user) {
                        setFormData((prev) => ({
                          ...prev,
                          participants: checked
                            ? [...prev.participants, user.id]
                            : prev.participants.filter((id) => id !== user.id),
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        icon={`${user?.name.charAt(0)}`}
                        size="sm"
                        color="secondary"
                      />
                      <span>
                        {user?.name} {user?.surname}
                      </span>
                    </div>
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="secondary" onPress={handleSubmit} isLoading={loading}>
            Add Expense
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddExpenseModal;
