import {
  Button,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  record: {
    productName: string;
    size: string;
    quantity: number | null;
    remarks: string;
  };
  setRecord: any;
};

const RecordInput: NextPage<Props> = ({ record, setRecord }) => {
  const hankaku = (str: any) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s: any) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  };
  return (
    <>
      {record && (
        <Flex alignItems='center'>
          <Input
            bgColor='white'
            type='text'
            flex='1'
            value={record.productName}
            onChange={(e) =>
              setRecord({ ...record, productName: e.target.value })
            }
          />
          <Input
            bgColor='white'
            textAlign='center'
            w='80px'
            type='text'
            value={record.size}
            onChange={(e) => setRecord({ ...record, size: e.target.value })}
          />
          <NumberInput
            min={1}
            bgColor='white'
            w='100px'
            value={!record.quantity ? '' : Number(record.quantity)}
            onChange={(e) => setRecord({ ...record, quantity: Number(e) })}
          >
            <NumberInputField textAlign='right' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Input
            bgColor='white'
            textAlign='center'
            w='200px'
            type='text'
            value={record.remarks}
            onChange={(e) => setRecord({ ...record, remarks: e.target.value })}
          />
          <Button
            w='60px'
            ml={1}
            size='sm'
            colorScheme='gray'
            border='1px solid #d5d6d9'
            onClick={() =>
              setRecord({
                productName: '',
                size: '',
                quantity: null,
                remarks: '',
              })
            }
          >
            クリア
          </Button>
        </Flex>
      )}
    </>
  );
};

export default RecordInput;
