/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import { useState } from 'react';
import { Box, Button, Container, Flex, Toast } from '@chakra-ui/react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../../../../firebase';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../../../store';
import MarkCreateInput from '../../components/mark/MarkCreateInput';

const MarkSpecNew = () => {
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
  const setLoading = useSetRecoilState(loadingState);

  // 仕様書を追加
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
      Toast({
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
    <Box p={6}>
      <Container maxW='800px' mt={12} p={6} bgColor='white'>
        <Box as='h1' w='100%' fontSize='2xl' textAlign='center'>
          仕様書を作成
        </Box>
        <MarkCreateInput
          markItems={markItems}
          setMarkItems={setMarkItems}
          fileUpload={fileUpload}
          setFileUpload={setFileUpload}
        />
        <Flex w='100%' mt={6} justifyContent='center'>
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
      </Container>
    </Box>
  );
};
export default MarkSpecNew;
