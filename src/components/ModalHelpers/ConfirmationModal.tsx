import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <ModalContent>
      <ModalHeader>
        <h3 className="text-xl font-bold">Confirm Action</h3>
      </ModalHeader>
      <ModalBody>
        <p className="text-gray-600">{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onPress={onConfirm}>
          Yes, Delete
        </Button>
        <Button color="default" variant="flat" onPress={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
