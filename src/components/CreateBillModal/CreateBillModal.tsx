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

  const filteredSuggestions = label
    ? labelSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(label.toLowerCase()),
      )
    : labelSuggestions;

  const handleLabelSelection = (label: string) => {
    setLabel(label);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-2xl font-bold">Create New Bill</h2>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Bill Name"
              placeholder="Enter bill name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="bordered"
            />
            <div className="relative">
              <Input
                label="Label Name"
                placeholder="Enter bill label"
                value={label}
                onChange={(e) => handleLabelChange(e.target.value)}
                variant="bordered"
              />
              {label && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-content1 rounded-md shadow-lg">
                  <ul className="py-1">
                    {filteredSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="px-3 py-2 cursor-pointer hover:bg-content2"
                        onClick={() => handleLabelSelection(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="secondary" onPress={() => onSubmit({ name, label })}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
