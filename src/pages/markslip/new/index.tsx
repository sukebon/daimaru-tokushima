/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import Head from 'next/head';
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import MarkRecordInput from '../../components/mark/MarkRecordInput';
import MarkCreateDoc from '../../components/mark/MarkCreateDoc';
import MarkNotePasteModal from '../../components/mark/MarkNotePasteModal';
import MarkDocsModal from '../../components/mark/MarkDocsModal';
import { AiFillCloseCircle } from 'react-icons/ai';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

const MarkNew = () => {
  const router = useRouter();
  const [textArea, setTextArea] = useState('');
  const currentUser = useAuthState(auth);
  const currentUserId = currentUser[0] && currentUser[0]?.uid;
  const [customer, setCustomer] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [deadline, setDeadline] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [repairName, setRepairName] = useState('');
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

  // 営業ノートを貼り付ける
  const notePaste = () => {
    const newArray = textArea
      .split('\n')
      .map((record) => {
        const field = record.split('   ');
        return field;
      })
      .map((array: any) => {
        return {
          productName: array[0] || '',
          size: array[1] || '',
          quantity: array[2] || '',
          remarks: array[3] || '',
        };
      });

    let recordArray = [];
    for (let i = 0; i < 10; i++) {
      if (newArray[i]) {
        recordArray.push({
          productName: newArray[i].productName,
          size: newArray[i].size,
          quantity: newArray[i].quantity,
          remarks: newArray[i].remarks,
        });
      }
    }

    setRecord_0({ ...recordArray[0] });
    setRecord_1({ ...recordArray[1] });
    setRecord_2({ ...recordArray[2] });
    setRecord_3({ ...recordArray[3] });
    setRecord_4({ ...recordArray[4] });
    setRecord_5({ ...recordArray[5] });
    setRecord_6({ ...recordArray[6] });
    setRecord_7({ ...recordArray[7] });
    setRecord_8({ ...recordArray[8] });
    setRecord_9({ ...recordArray[9] });
  };

  // マーク伝票を登録
  const addMarkSlip = async () => {
    const result = window.confirm('登録して宜しいでしょうか');
    if (!result) return;
    try {
      await runTransaction(db, async (transaction) => {
        // 更新前の伝票NO.を取得
        const markNumberRef = doc(db, 'markNumber', 'serialNumber');
        const markNumberSnap = await transaction.get(markNumberRef);

        if (!markNumberSnap.exists()) {
          throw 'マーク伝票 document does not exist!';
        }
        // 伝票NOを更新
        let count = await markNumberSnap.data().count;
        count += 1;
        transaction.update(markNumberRef, { count: count });

        //マーク伝票を作成
        const markSlipsRef = doc(db, 'markSlips', `${count}`);
        transaction.set(markSlipsRef, {
          uid: currentUserId,
          customer,
          deadline,
          repairName,
          deliveryPlace,
          price: Number(price),
          note,
          url,
          createdAt: serverTimestamp(),
          data: [
            record_0,
            record_1,
            record_2,
            record_3,
            record_4,
            record_5,
            record_6,
            record_7,
            record_8,
            record_9,
          ],
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push('/mark');
    }
  };

  const onClear = () => {
    setCustomer('');
    setDeliveryPlace('');
    setDeadline('');
    setPrice('');
    setNote('');
    setRepairName('');
    setUrl('');
    setRecord_0(initData);
    setRecord_1(initData);
    setRecord_2(initData);
    setRecord_3(initData);
    setRecord_4(initData);
    setRecord_5(initData);
    setRecord_6(initData);
    setRecord_7(initData);
    setRecord_8(initData);
    setRecord_9(initData);
  };

  const pasteMarkDoc = async (id: string) => {
    const markRef = doc(db, 'markDocs', `${id}`);
    setMarkDocId(id);
    const docSnap = await getDoc(markRef);
    if (docSnap.exists()) {
      setCustomer(docSnap.data().customer);
      setDeliveryPlace(docSnap.data().deliveryPlace);
      setPrice(docSnap.data().price);
      setNote(docSnap.data().note);
      setRepairName(docSnap.data().repairName);
      setUrl(docSnap.data().url);
    }
  };

  return (
    <Box>
      <Head>
        <title>大丸白衣 徳島工場</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Container maxW='1000px' mt={6} p={6}>
          <Flex justifyContent='space-between'>
            <HStack spacing={2}>
              <MarkNotePasteModal
                textArea={textArea}
                setTextArea={setTextArea}
                notePaste={notePaste}
              />
              <MarkDocsModal pasteMarkDoc={pasteMarkDoc} />
              <MarkCreateDoc pasteMarkDoc={pasteMarkDoc} />
              <Button
                onClick={onClear}
                colorScheme='gray'
                border='1px solid #d5d6d9'
              >
                クリア
              </Button>
            </HStack>
            <Button px={8} colorScheme='blue' onClick={() => addMarkSlip()}>
              登録
            </Button>
          </Flex>

          <Box mt={12}>
            <Box as='h1' textAlign='center' fontSize='2xl' fontWeight='bold'>
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
      </main>
    </Box>
  );
};

export default MarkNew;
