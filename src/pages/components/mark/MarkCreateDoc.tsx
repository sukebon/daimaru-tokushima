/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import { useRef, useState } from 'react';
import { NextPage } from 'next';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import MarkCreateInputArea from './MarkCreateInputArea';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../../../../firebase';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../../../store';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

type Props = {
  pasteMarkDoc: Function;
};

const MarkCreateDoc: NextPage<Props> = ({ pasteMarkDoc }) => {
  const btnRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useAuthState(auth);
  const initMarkItems = {
    customer: '',
    repairName: '',
    deliveryPlace: '',
    price: '',
    note: '',
  };
  const [markItems, setMarkItems] = useState(initMarkItems);
  const [fileUpload, setFileUpload] = useState<File | any>(null);
  const [loading, setLoading] = useRecoilState(loadingState);
  const toast = useToast();

  const addMarkDoc = async () => {
    const result = window.confirm('登録して宜しいでしょうか');
    if (!result) return;

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'markDocs'), {
        customer: markItems?.customer,
        deliveryPlace: markItems?.deliveryPlace,
        price: Number(markItems?.price),
        repairName: markItems?.repairName,
        note: markItems?.note,
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
      setMarkItems(initMarkItems);
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
            <MarkCreateInputArea
              markItems={markItems}
              setMarkItems={setMarkItems}
              fileUpload={fileUpload}
              setFileUpload={setFileUpload}
            />
          </DrawerBody>

          <DrawerFooter>
            <Flex w='100%' mt={6} justifyContent='center'>
              <Button variant='outline' mr={3} onClick={onClose}>
                キャンセル
              </Button>
              <Button
                disabled={!markItems.repairName || !markItems.price}
                colorScheme='blue'
                onClick={() => {
                  addMarkDoc();
                }}
              >
                登録
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default MarkCreateDoc;
