/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import { useRef, useState } from 'react';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  Textarea,
  useDisclosure,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useRecoilState } from 'recoil';
import { auth, db, storage } from '../../../../firebase';
import { loadingState } from '../../../../store';

type Props = {
  pasteMarkDoc: any;
};

const MarkCreateDoc: NextPage<Props> = ({ pasteMarkDoc }) => {
  const currentUser = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [repairName, setRepairName] = useState('');
  const [customer, setCustomer] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [fileUpload, setFileUpload] = useState<File | any>(null);
  const [loading, setLoading] = useRecoilState(loadingState);
  const toast = useToast();

  const addMarkDoc = async () => {
    const result = window.confirm('登録して宜しいでしょうか');
    if (!result) return;

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'markDocs'), {
        customer,
        deliveryPlace,
        price: Number(price),
        repairName,
        note,
        uid: currentUser[0]?.uid,
      });
      if (!fileUpload) return;

      Array.from(fileUpload).forEach(async (file: any) => {
        if (!file) return;
        const fileName = new Date().getTime() + '_' + file.name;
        const imagePath = `markImages/${fileName}`;
        const storageRef = ref(storage, imagePath);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const path = storageRef.fullPath;
        const postsRef = doc(db, 'markDocs', `${docRef.id}`);
        await updateDoc(postsRef, {
          url: arrayUnion(url),
          path: arrayUnion(path),
        });
        await pasteMarkDoc(docRef.id);
      });
    } catch (err) {
      console.log(err);
    } finally {
      toast({
        title: '仕様書を作成しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
      setRepairName('');
      setCustomer('');
      setDeliveryPlace('');
      setPrice('');
      setNote('');
      setFileUpload(null);
    }
  };

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme='gray'
        border='1px solid #d5d6d9'
        onClick={onOpen}
      >
        仕様書を作成
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
        size='lg'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>仕様書を作成</DrawerHeader>

          <DrawerBody>
            <VStack>
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
                  textAlign='right'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <InputRightAddon children='円' borderColor='#d5d6d9' />
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
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Box>
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
                  <Box mt={6}>
                    {Array.from(fileUpload).map((file: any, index: number) => (
                      <Box key={file.name} position='relative' mt={6}>
                        <img
                          src={window.URL.createObjectURL(file)}
                          alt={file.name}
                        />

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
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button
              disabled={!repairName || !price}
              colorScheme='blue'
              onClick={() => {
                addMarkDoc();
                onClose();
              }}
            >
              登録
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default MarkCreateDoc;
