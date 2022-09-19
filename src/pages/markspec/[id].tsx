/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { db, storage } from '../../../firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../../store';

const MarkSpecId = () => {
  const router = useRouter();
  const [repairName, setRepairName] = useState('');
  const [customer, setCustomer] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [url, setUrl] = useState([]);
  const [path, setPath] = useState([]);
  const [fileUpload, setFileUpload] = useState<File | any>();
  const [loading, setLoading] = useRecoilState(loadingState);
  const toast = useToast();

  // 仕様書を取得
  useEffect(() => {
    const getMarkDoc = async () => {
      const docRef = doc(db, 'markDocs', `${router.query.id}`);
      try {
        setLoading(true);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCustomer(docSnap.data().customer);
          setDeliveryPlace(docSnap.data().deliveryPlace);
          setRepairName(docSnap.data().repairName);
          setPrice(docSnap.data().price);
          setNote(docSnap.data().note);
          setUrl(docSnap.data().url);
          setPath(docSnap.data().path);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getMarkDoc();
  }, [router.query.id, fileUpload, setLoading, toast]);

  // 画像を削除
  const deleteDocImage = async () => {
    const result = window.confirm('画像を削除して宜しいでしょうか');
    if (!result) return;
    try {
      const docRef = doc(db, 'markDocs', `${router.query.id}`);
      await updateDoc(docRef, {
        url: '',
        path: '',
      });
      // path.forEach(async (p) => {
      //   const desertRef = ref(storage, p);
      //   deleteObject(desertRef);
      // });
      setUrl([]);
      setPath([]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateMarkDoc = async () => {
    const result = window.confirm('更新して宜しいでしょうか');
    if (!result) return;
    try {
      setLoading(true);
      const docRef = await updateDoc(
        doc(db, 'markDocs', `${router.query.id}`),
        {
          customer,
          deliveryPlace,
          repairName,
          price: Number(price),
          note,
        }
      );
      if (!fileUpload) return;

      Array.from(fileUpload).forEach(async (file: any) => {
        const fileName = new Date().getTime() + '_' + file.name;
        const imagePath = `markImages/${fileName}`;
        const storageRef = ref(storage, imagePath);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const path = storageRef.fullPath;
        const postsRef = doc(db, 'markDocs', `${router.query.id}`);
        await updateDoc(postsRef, {
          url: arrayUnion(url),
          path: arrayUnion(path),
        });
        setFileUpload('');
      });
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        toast({
          title: '更新しました',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }, 3000);
    }
  };

  return (
    <Box p={6}>
      <Container maxW='600px' mt={12} p={6} bgColor='white'>
        <Box as='h1' textAlign='center' fontSize='2xl'>
          仕様書を編集
        </Box>
        <VStack mt={6}>
          <InputGroup w='100%'>
            <InputLeftAddon children='顧客名' borderColor='#d5d6d9' />
            <Input
              type='text'
              bgColor='white'
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </InputGroup>
          <InputGroup w='100%'>
            <InputLeftAddon children='修理名' borderColor='#d5d6d9' />
            <Input
              type='text'
              bgColor='white'
              value={repairName}
              onChange={(e) => setRepairName(e.target.value)}
            />
          </InputGroup>
          <InputGroup w='100%'>
            <InputLeftAddon children='修理代' borderColor='#d5d6d9' />
            <Input
              type='number'
              bgColor='white'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </InputGroup>
          <InputGroup w='100%'>
            <InputLeftAddon children='納品先' borderColor='#d5d6d9' />
            <Input
              type='text'
              bgColor='white'
              value={deliveryPlace}
              onChange={(e) => setDeliveryPlace(e.target.value)}
            />
          </InputGroup>
        </VStack>
        <Box w='100%' mt={6}>
          <Text mb='2px'>内容</Text>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </Box>
        {url.length !== 0 && (
          <Box mt={6} position='relative'>
            {url.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} />
            ))}
            <Box
              position='absolute'
              top='-18px'
              left='50%'
              transform='translateX(-50%)'
              borderRadius='50%'
              bgColor='white'
              cursor='pointer'
              onClick={deleteDocImage}
            >
              <AiFillCloseCircle fontSize='36px' />
            </Box>
          </Box>
        )}

        {url.length === 0 && (
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
                <Box position='relative' mt={6}>
                  {Array.from(fileUpload).map((file: any) => (
                    <Box key={file.name} mt={6}>
                      <img
                        src={window.URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    </Box>
                  ))}

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
              </>
            )}
          </Box>
        )}
        <Flex w='100%' mt={6} justifyContent='center' gap={2}>
          <Link href='/markspec'>
            <a>
              <Button>キャンセル</Button>
            </a>
          </Link>
          <Button
            colorScheme='blue'
            onClick={() => {
              updateMarkDoc();
            }}
          >
            更新
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default MarkSpecId;
