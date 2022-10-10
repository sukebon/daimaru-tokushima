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
import { auth, db, storage } from '../../../firebase';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../../store';
import { useAuthState } from 'react-firebase-hooks/auth';

const MarkSpecId = () => {
  const router = useRouter();
  const user = useAuthState(auth);
  const currentUser = user[0]?.uid;
  const setLoading = useSetRecoilState(loadingState);
  const [markItems, setMarkItems] = useState<any>();
  const [url, setUrl] = useState([]);
  const [path, setPath] = useState([]);
  const [fileUpload, setFileUpload] = useState<File | any>();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any>([]);
  const toast = useToast();

  // 仕様書を取得
  useEffect(() => {
    const getMarkDoc = async () => {
      const docRef = doc(db, 'markDocs', `${router.query.id}`);
      try {
        setLoading(true);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMarkItems({ ...docSnap.data() });
          setUrl(docSnap.data().url);
          setPath(docSnap.data().url);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getMarkDoc();
  }, [router.query.id, fileUpload, setLoading, toast]);

  //コメントを取得
  useEffect(() => {
    const getComments = async () => {
      const unsub = onSnapshot(
        collection(db, 'markDocs', `${router.query.id}`, 'comments'),
        (doc) => {
          setComments(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
      );
    };
    getComments();
  }, [router.query.id]);

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

  //仕様書の更新
  const updateMarkDoc = async () => {
    const result = window.confirm('更新して宜しいでしょうか');
    if (!result) return;
    try {
      setLoading(true);
      await updateDoc(doc(db, 'markDocs', `${router.query.id}`), {
        customer: markItems.customer,
        deliveryPlace: markItems.deliveryPlace,
        repairName: markItems.repairName,
        price: Number(markItems.price),
        note: markItems.note,
      });
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

  //コメントを追加
  const addComment = () => {
    const docRef = collection(db, 'markDocs', `${router.query.id}`, 'comments');
    addDoc(docRef, {
      writer: currentUser,
      comment,
      createdAt: serverTimestamp(),
    });
    setComment('');
  };

  // input要素の値変更
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setMarkItems({ ...markItems, [name]: value });
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
              name='customer'
              bgColor='white'
              value={markItems?.customer}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup w='100%'>
            <InputLeftAddon children='修理名' borderColor='#d5d6d9' />
            <Input
              type='text'
              name='repairName'
              bgColor='white'
              value={markItems?.repairName}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup w='100%'>
            <InputLeftAddon children='修理代' borderColor='#d5d6d9' />
            <Input
              type='number'
              name='price'
              bgColor='white'
              value={markItems?.price}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup w='100%'>
            <InputLeftAddon children='納品先' borderColor='#d5d6d9' />
            <Input
              type='text'
              name='deliveryPlace'
              bgColor='white'
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
      <Container maxW='600px' mt={6} p={3} bgColor='white'>
        <Box>コメントを書く</Box>
        <Textarea
          mt={2}
          name='comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Box textAlign='center'>
          <Button
            mt={3}
            size='sm'
            colorScheme='blue'
            disabled={!comment}
            onClick={addComment}
          >
            送信
          </Button>
        </Box>
        <Box>
          {comments?.map(
            (comment: { id: string; comment: string; createdAt: any }) => (
              <Box key={comment.id}>
                <Box>
                  {comment.createdAt.toDate().toLocaleTimeString('en-US')}
                </Box>
                {comment.comment}
              </Box>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MarkSpecId;
