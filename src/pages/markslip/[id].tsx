/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Textarea,
} from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillCloseCircle } from 'react-icons/ai';
import { auth, db } from '../../../firebase';
import MarkRecordInput from '../components/mark/MarkRecordInput';

const MarkId = () => {
  const router: any = useRouter();
  const [docSlip, setDocSlip] = useState<any>();
  const [textArea, setTextArea] = useState('');
  const currentUser = useAuthState(auth);
  const currentUserId = currentUser[0] && currentUser[0]?.uid;
  const [customer, setCustomer] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [deadline, setDeadline] = useState('');
  const [repairName, setRepairName] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [markDocId, setMarkDocId] = useState('');
  const [url, setUrl] = useState<any>();

  const initData = {
    productName: '',
    size: '',
    quantity: null,
    remarks: '',
  };

  const [record_0, setRecord_0] = useState(initData);
  const [record_1, setRecord_1] = useState(initData);
  const [record_2, setRecord_2] = useState(initData);
  const [record_3, setRecord_3] = useState(initData);
  const [record_4, setRecord_4] = useState(initData);
  const [record_5, setRecord_5] = useState(initData);
  const [record_6, setRecord_6] = useState(initData);
  const [record_7, setRecord_7] = useState(initData);
  const [record_8, setRecord_8] = useState(initData);
  const [record_9, setRecord_9] = useState(initData);

  useEffect(() => {
    const getDocSplit = async () => {
      const docRef = doc(db, 'markSlips', `${router.query.id}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap) return;
      const docSlip = docSnap.data();
      setCustomer(docSlip?.customer);
      setDeliveryPlace(docSlip?.deliveryPlace);
      setDeadline(docSlip?.deadline);
      setRepairName(docSlip?.repairName);
      setPrice(docSlip?.price);
      setNote(docSlip?.note);
      setUrl(docSlip?.url);
      setRecord_0(docSlip?.data[0]);
      setRecord_1(docSlip?.data[1]);
      setRecord_2(docSlip?.data[2]);
      setRecord_3(docSlip?.data[3]);
      setRecord_4(docSlip?.data[4]);
      setRecord_5(docSlip?.data[5]);
      setRecord_6(docSlip?.data[6]);
      setRecord_7(docSlip?.data[7]);
      setRecord_8(docSlip?.data[8]);
      setRecord_9(docSlip?.data[9]);
    };
    getDocSplit();
  }, [router.query.id]);

  const numberOfDigits = (serialNumber: string) => {
    let number = '00000000000' + serialNumber;
    number = number.slice(-11);
    return number;
  };

  return (
    <Container maxW='1000px' mt={6} p={6}>
      <Flex justifyContent='space-between'>
        <Link href='/markslip'>
          <a>
            <Button colorScheme='gray' border='1px solid #d5d6d9'>
              一覧へ戻る
            </Button>
          </a>
        </Link>
      </Flex>
      <Box mt={12}>
        <Box textAlign='right'>伝票No.{numberOfDigits(router.query.id)}</Box>
        <Box as='h1' mt={1} textAlign='center' fontSize='2xl' fontWeight='bold'>
          マーク伝票
        </Box>
        <Flex mt={6} flexDirection={{ base: 'column', md: 'row' }} gap={3}>
          <InputGroup w={{ base: '100%', md: '70%' }}>
            <InputLeftAddon children='顧客名' borderColor='#d5d6d9' />
            <Input
              type='text'
              bgColor='white'
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </InputGroup>
          <InputGroup w={{ base: '100%', md: '30%' }}>
            <InputLeftAddon children='希望納期' borderColor='#d5d6d9' />
            <Input
              type='date'
              bgColor='white'
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Flex mt={3} flexDirection={{ base: 'column', md: 'row' }} gap={3}>
          <InputGroup w={{ base: '100%', md: '100%' }}>
            <InputLeftAddon children='納品先' borderColor='#d5d6d9' />
            <Input
              type='text'
              bgColor='white'
              value={deliveryPlace}
              onChange={(e) => setDeliveryPlace(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Flex mt={6}>
          <Box flex='1' textAlign='center'>
            商品名
          </Box>
          <Box w='80px' textAlign='center'>
            サイズ
          </Box>
          <Box w='100px' textAlign='center'>
            数量
          </Box>
          <Box w='200px' textAlign='center'>
            備考
          </Box>
          <Box w='60px' textAlign='center' ml={1}></Box>
        </Flex>
        <MarkRecordInput record={record_0} setRecord={setRecord_0} />
        <MarkRecordInput record={record_1} setRecord={setRecord_1} />
        <MarkRecordInput record={record_2} setRecord={setRecord_2} />
        <MarkRecordInput record={record_3} setRecord={setRecord_3} />
        <MarkRecordInput record={record_4} setRecord={setRecord_4} />
        <MarkRecordInput record={record_5} setRecord={setRecord_5} />
        <MarkRecordInput record={record_6} setRecord={setRecord_6} />
        <MarkRecordInput record={record_7} setRecord={setRecord_7} />
        <MarkRecordInput record={record_8} setRecord={setRecord_8} />
        <MarkRecordInput record={record_9} setRecord={setRecord_9} />
      </Box>

      <Flex mt={12} flexDirection={{ base: 'column', md: 'row' }} gap={3}>
        <InputGroup w={{ base: '100%', md: '70%' }}>
          <InputLeftAddon children='修理名' borderColor='#d5d6d9' />
          <Input
            type='text'
            bgColor='white'
            value={repairName}
            onChange={(e) => setRepairName(e.target.value)}
          />
        </InputGroup>
        <InputGroup w={{ base: '100%', md: '30%' }}>
          <InputLeftAddon children='修理代' borderColor='#d5d6d9' />
          <Input
            type='number'
            bgColor='white'
            textAlign='right'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <InputRightAddon children='円' borderColor='#d5d6d9' />
        </InputGroup>
      </Flex>

      <Textarea
        mt={6}
        background='white'
        whiteSpace='pre-wrap'
        minH='15rem'
        placeholder='内容：'
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {url &&
        url.map((image: any) => (
          <Box key={image} mt={6} position='relative'>
            <img src={image} alt={image} width='100%' height='auto' />
            <Box
              position='absolute'
              top='-18px'
              left='50%'
              transform='translateX(-50%)'
              borderRadius='50%'
              bgColor='white'
              cursor='pointer'
              onClick={() => setUrl(null)}
            >
              <AiFillCloseCircle fontSize='36px' />
            </Box>
          </Box>
        ))}
    </Container>
  );
};

export default MarkId;
