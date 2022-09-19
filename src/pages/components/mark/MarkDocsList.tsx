/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../../../../firebase';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../../../store';
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';

type Props = {
  pasteMarkDoc: Function;
  onClose: Function;
  switching: boolean;
};

type Docs = {
  id: string;
  repairName: string;
  customer: string;
  deliveryPlace: string;
  price: number;
  note: string;
  url: string[];
  path: string[];
  uid: string;
}[];

const MarkSpecList: NextPage<Props> = ({
  pasteMarkDoc,
  onClose,
  switching,
}) => {
  const [markDocs, setMarkDocs] = useState<Docs>([]);
  const [filterDocs, setFilterDocs] = useState<Docs>([]);
  const [customer, setCustomer] = useState('');
  const [repairName, setRepairName] = useState('');
  const [loading, setLoading] = useRecoilState(loadingState);

  // 仕様書一覧取得
  useEffect(() => {
    const getMarkDocs = async () => {
      onSnapshot(collection(db, 'markDocs'), (querySnapshot) => {
        setMarkDocs(
          querySnapshot.docs.map((doc: any) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    };
    getMarkDocs();
  }, []);

  // 仕様書一覧にフィルターをかける
  useEffect(() => {
    const newMarkDocs = markDocs
      .filter((doc) => {
        if (doc.customer.includes(customer)) return doc;
      })
      .filter((doc) => {
        if (doc.repairName.includes(repairName)) return doc;
      });
    setFilterDocs(newMarkDocs);
  }, [markDocs, customer, repairName]);

  // 仕様書を削除する
  const deleteMarkDoc = async (document: { id: string; path: string[] }) => {
    const result = window.confirm('削除して宜しいでしょうか');
    if (!result) return;
    setLoading(true);
    await deleteDoc(doc(db, 'markDocs', `${document.id}`))
      .then(async () => {
        // document.path.forEach(async (pathName) => {
        //   const desertRef = ref(storage, `${pathName}`);
        //   await deleteObject(desertRef);
        // });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <VStack mt={12}>
        <InputGroup w='100%' justifyContent='center'>
          <InputLeftAddon children='修理名で検索' borderColor='#d5d6d9' />
          <Input
            type='text'
            maxW='500px'
            bgColor='white'
            value={repairName}
            onChange={(e) => setRepairName(e.target.value)}
          />
        </InputGroup>
        <InputGroup w='100%' justifyContent='center'>
          <InputLeftAddon children='顧客名で検索' borderColor='#d5d6d9' />
          <Input
            type='text'
            maxW='500px'
            bgColor='white'
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </InputGroup>
      </VStack>
      <Grid
        w='100%'
        mt={12}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          '2xl': 'repeat(4, 1fr)',
        }}
        gap={6}
      >
        {filterDocs.map(
          (doc: {
            id: string;
            repairName: string;
            customer: string;
            price: number;
            deliveryPlace: string;
            note: string;
            url: string[];
            path: string[];
            uid: string;
          }) => (
            <Box
              key={doc.id}
              p={3}
              w='100%'
              border='1px solid #dfdfe7'
              bgColor='white'
            >
              <VStack spacing={2} textAlign='left'>
                <Box w='100%'>顧客名：{doc.customer && doc.customer}</Box>
                <Box w='100%'>修理名：{doc.repairName && doc.repairName}</Box>
                <Box w='100%'>工　賃：{doc.price && doc.price + '円'}</Box>
                <Box w='100%'>
                  納品先：{doc.deliveryPlace && doc.deliveryPlace}
                </Box>
                <Flex w='100%' mt={3} textAlign='left' whiteSpace='pre-wrap'>
                  <Box>備　考：</Box>
                  <Box flex='1'>{doc.note && doc.note}</Box>
                </Flex>
                <Box w='100%' mt={3}>
                  {doc.url && (
                    <a
                      href={doc.url[0]}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img src={doc.url[0]} alt={doc.repairName} />
                    </a>
                  )}
                </Box>
                {switching ? (
                  <Button
                    colorScheme='blue'
                    onClick={() => {
                      pasteMarkDoc(doc.id);
                      onClose();
                    }}
                  >
                    選択
                  </Button>
                ) : (
                  <HStack>
                    <Button
                      size='sm'
                      colorScheme='red'
                      onClick={() => deleteMarkDoc(doc)}
                    >
                      削除
                    </Button>
                    <Link href={`/markspec/${doc.id}`}>
                      <a>
                        <Button size='sm' colorScheme='blue'>
                          編集
                        </Button>
                      </a>
                    </Link>
                  </HStack>
                )}
              </VStack>
            </Box>
          )
        )}
      </Grid>
    </>
  );
};

export default MarkSpecList;
