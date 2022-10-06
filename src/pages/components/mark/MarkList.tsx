import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { db } from '../../../../firebase';
import MarkListMenuButton from './MarkListMenuButton';

type Props = {
  markSlips: {
    id: string;
    deadline: string;
    customer: string;
    repairName: string;
    deliveryPlace: string;
    price: number;
    note: string;
    assort: number;
    data: {
      productName: string;
      quantity: number;
      remarks: string;
      size: string;
    }[];
  }[];
};

const MarkList: NextPage<Props> = ({ markSlips }) => {
  const numberOfDigits = (serialNumber: string) => {
    let number = '00000000000' + serialNumber;
    number = number.slice(-11);
    return number;
  };

  // 数量の合計
  const sumQuantity = (array: any) => {
    let sum = 0;
    array.forEach((item: { quantity: number }) => {
      if (!item.quantity) return;
      sum += Number(item.quantity);
    });
    return sum;
  };

  const assortChange1 = async (id: string) => {
    const docRef = doc(db, 'markSlips', `${id}`);
    await updateDoc(docRef, {
      assort: 1,
    });
  };

  return (
    <TableContainer>
      <Table variant='simple' size='sm' fontSize='sm'>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>伝票NO.</Th>
            <Th>納期</Th>
            <Th>顧客名</Th>
            <Th>修理名</Th>
            <Th>修理代</Th>
            <Th>合計数量</Th>
            <Th>納品先</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {markSlips.map((slip) => (
            <Tr key={slip.id}>
              <Td w='80px'>
                {slip.assort === 0 ? (
                  <Button size='xs' onClick={() => assortChange1(slip.id)}>
                    受取る
                  </Button>
                ) : (
                  <MarkListMenuButton slipId={slip.id} />
                )}
              </Td>
              <Td>{numberOfDigits(slip.id)}</Td>
              <Td>{slip.deadline}</Td>
              <Td>{slip.customer}</Td>
              <Td>{slip.repairName}</Td>
              <Td> {slip.price}</Td>
              <Td>{sumQuantity(slip.data)}</Td>
              <Td> {slip.deliveryPlace}</Td>
              <Td>
                <Link href={`/markslip/print/${slip.id}`}>
                  <a>
                    <Button size='sm'>詳細</Button>
                  </a>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default MarkList;
