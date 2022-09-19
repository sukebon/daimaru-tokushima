import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';

function MarkNotePasteModal({ textArea, setTextArea, notePaste }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} colorScheme='gray' border='1px solid #d5d6d9'>
        営業ノート貼付け
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>営業ノート貼付け</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              bg='white'
              minH='15rem'
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                notePaste();
                onClose();
              }}
              colorScheme='blue'
            >
              添付
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default MarkNotePasteModal;
