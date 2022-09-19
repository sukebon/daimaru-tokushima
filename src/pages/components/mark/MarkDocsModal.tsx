/* eslint-disable react/no-children-prop */
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import MarkDocsList from './MarkDocsList';

type Props = {
  pasteMarkDoc: any;
};

const MarkDocsModal: NextPage<Props> = ({ pasteMarkDoc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        colorScheme='gray'
        border='1px solid #d5d6d9'
        onClick={() => onOpen()}
        m={4}
      >
        仕様書を添付
      </Button>

      <Modal onClose={onClose} size='full' isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>マーク伝票一覧</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <MarkDocsList
              pasteMarkDoc={pasteMarkDoc}
              onClose={onClose}
              switching={true}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default MarkDocsModal;
