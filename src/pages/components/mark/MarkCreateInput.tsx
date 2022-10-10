/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */

import { NextPage } from 'next';
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';

import { AiFillCloseCircle } from 'react-icons/ai';
import { connectAuthEmulator } from 'firebase/auth';

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
  setFileUpload: Function;
};

const MarkCreateInput: NextPage<Props> = ({
  markItems,
  setMarkItems,
  fileUpload,
  setFileUpload,
}) => {
  // input要素の値変更
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
            list='repairName'
            name='repairName'
            value={markItems?.repairName}
            onChange={handleInputChange}
          />
          <datalist id='repairName'>
            <option value='裾上げ（ルイス）' />
            <option value='裾上げ（たたき）' />
            <option value='ワッペン付け' />
            <option value='ネーム付け' />
          </datalist>
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
        {(!fileUpload || fileUpload.length === 0) && (
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
                    onClick={() => {
                      setFileUpload(
                        Array.from(fileUpload).filter((file, i) =>
                          i === index ? false : true
                        )
                      );
                    }}
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

export default MarkCreateInput;
