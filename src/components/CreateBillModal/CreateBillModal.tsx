import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { set } from "react-hook-form";

interface CreateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (billData: any) => void;
}

export const CreateBillModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateBillModalProps) => {
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [labelSuggestions, setLabelSuggestions] = useState<string[]>([
    "Rent",
    "Utilities",
    "Groceries",
    "Entertainment",
    "Transportation",
    "Dining Out",
    "Healthcare",
    "Subscriptions",
    "Savings",
    "Miscellaneous",
  ]);

  const handleLabelChange = (value: string) => {
    setLabel(value);
  };

  const filteredSuggestions = labelSuggestions.filter((label) =>
    label.toLowerCase().includes(label.toLowerCase())
  );

  const handleLabelSelection = (label: string) => {
    setLabel(label);
    setLabelSuggestions([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className="text-xl font-bold">Create New Bill</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Bill Name"
                  placeholder="Enter bill name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Label Name"
                  placeholder="Enter bill label"
                  value={label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                />
                {label && filteredSuggestions.length > 0 && (
                  <ul className="rounded shadow-lg p-2">
                    {filteredSuggestions.map((label) => (
                      <li
                        key={label}
                        className="cursor-pointer p-1 rounded hover:bg-gray-600"
                        onClick={() => handleLabelSelection(label)}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="secondary"
                onPress={() => onSubmit({ name, label })}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
