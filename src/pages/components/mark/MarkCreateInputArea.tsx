/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useRecoilState } from 'recoil';
import { auth, db, storage } from '../../../../firebase';
import { loadingState } from '../../../../store';

type Props = {
  markItems: {
    customer: string;
    repairName: string;
    deliveryPlace: string;
    price: string;
    note: string;
  };
  setMarkItems: Function;
  fileUpload: any;
  setFileUpload: any;
};

const MarkCreateInputArea: NextPage<Props> = ({
  markItems,
  setMarkItems,
  fileUpload,
  setFileUpload,
}) => {
  const currentUser = useAuthState(auth);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setMarkItems({ ...markItems, [name]: value });
  };

  return (
    <>
      <VStack>
        <InputGroup w='100%'>
          <InputLeftAddon children='顧客名' borderColor='#d5d6d9' />
          <Input
            type='text'
            bgColor='white'
            name='customer'
            value={markItems?.customer}
            onChange={handleInputChange}
          />
        </InputGroup>

        <InputGroup w='100%'>
          <InputLeftAddon children='修理名' borderColor='#d5d6d9' />
          <Input
            type='text'
            bgColor='white'
            name='repairName'
            value={markItems?.repairName}
            onChange={handleInputChange}
          />
        </InputGroup>
        <InputGroup w='100%'>
          <InputLeftAddon children='修理代' borderColor='#d5d6d9' />
          <Input
            type='number'
            bgColor='white'
            textAlign='right'
            name='price'
            value={markItems?.price}
            onChange={handleInputChange}
          />
          <InputRightAddon children='円' borderColor='#d5d6d9' />
        </InputGroup>
        <InputGroup w='100%'>
          <InputLeftAddon children='納品先' borderColor='#d5d6d9' />
          <Input
            type='text'
            bgColor='white'
            name='deliveryPlace'
            value={markItems?.deliveryPlace}
            onChange={handleInputChange}
          />
        </InputGroup>
      </VStack>
      <Box w='100%' mt={6}>
        <Text mb='2px'>内容</Text>
        <Textarea
          name='note'
          value={markItems?.note}
          onChange={handleInputChange}
        />
      </Box>
      <Box mt={6}>
        {!fileUpload && (
          <Input
            type='file'
            accept='image/*'
            value={fileUpload ? fileUpload.name : ''}
            multiple
            onChange={(e) => setFileUpload(e.target.files)}
          />
        )}
        {fileUpload && (
          <>
            <Box mt={6}>
              {Array.from(fileUpload).map((file: any, index: number) => (
                <Box key={file.name} position='relative' mt={6}>
                  <img src={window.URL.createObjectURL(file)} alt={file.name} />

                  <Box
                    position='absolute'
                    top='-18px'
                    left='50%'
                    transform='translateX(-50%)'
                    borderRadius='50%'
                    bgColor='white'
                    cursor='pointer'
                    onClick={() => setFileUpload(null)}
                  >
                    <AiFillCloseCircle fontSize='36px' />
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default MarkCreateInputArea;
