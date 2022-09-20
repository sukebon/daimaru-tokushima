import React from 'react';
import { NextPage } from 'next';
import { Td, Tr } from '@chakra-ui/react';

type Props = {
  record: {
    productName: string;
    size: string;
    quantity: number | null;
    remarks: string;
  };
};

const MarkRecord: NextPage<Props> = ({ record }) => {
  return (
    <>
      {record && (
        <Tr w='100%'>
          <Td w='60%' fontSize='md' py={0} pl={1} h={9}>
            {record.productName}
          </Td>
          <Td w='5%' fontSize='md' py={0} px={2} h={9}>
            {record.size}
          </Td>
          <Td w='5%' fontSize='md' py={0} px={2} h={9} isNumeric>
            {record.quantity}
          </Td>
          <Td w='30%' fontSize='md' py={0} pr={1} h={9}>
            {record.remarks}
          </Td>
        </Tr>
      )}
    </>
  );
};

export default MarkRecord;
