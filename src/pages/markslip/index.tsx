import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Container,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';

const MarkSlips = () => {
  const [markSlips, setMarkSlips] = useState<any>([]);

  // マーク伝票一覧取得
  useEffect(() => {
    const getMarkSlips = async () => {
      const q = query(
        collection(db, 'markSlips'),
        orderBy('createdAt', 'desc')
      );
      onSnapshot(q, (querySnapshot) => {
        setMarkSlips(
          querySnapshot.docs.map((doc: any) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    };
    getMarkSlips();
  }, []);

  const numberOfDigits = (serialNumber: string) => {
    let number = '00000000000' + serialNumber;
    number = number.slice(-11);
    return number;
  };

  const sumQuantity = (array: any) => {
    let sum = 0;
    array.forEach((item: { quantity: number }) => {
      if (!item.quantity) return;
      sum += Number(item.quantity);
    });
    return sum;
  };

  return (
    <Container maxW='1500px' mt={12} p={6} bgColor='white'>
      <TableContainer>
        <Table variant='simple' size='sm' fontSize='sm'>
          <Thead>
            <Tr>
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
            {markSlips.map(
              (slips: {
                id: string;
                deadline: string;
                customer: string;
                repairName: string;
                deliveryPlace: string;
                price: number;
                note: string;
                data: {
                  productName: string;
                  quantity: number;
                  remarks: string;
                  size: string;
                }[];
              }) => (
                <Tr key={slips.id}>
                  <Td>{numberOfDigits(slips.id)}</Td>
                  <Td>{slips.deadline}</Td>
                  <Td>{slips.customer}</Td>
                  <Td>{slips.repairName}</Td>
                  <Td> {slips.price}</Td>
                  <Td>{sumQuantity(slips.data)}</Td>
                  <Td> {slips.deliveryPlace}</Td>
                  <Td>
                    <Link href={`/markslip/print/${slips.id}`}>
                      <a>
                        <Button size='sm'>詳細</Button>
                      </a>
                    </Link>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MarkSlips;
