import React, { useEffect, useState } from 'react';
import {
  Container,
  SliderProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import MarkList from '../components/mark/MarkList';

const MarkSlips = () => {
  const [markSlips, setMarkSlips] = useState<any>([]);
  const [markNotOrderSlips, setMarkNotOrderSlips] = useState<any>([]);
  const [markOrderSlips, setMarkOrderSlips] = useState<any>([]);
  const [markOvertimeSlips, setMarkOvertimeSlips] = useState<any>([]);
  const [markSideJobSlips, setMarkSideJobSlips] = useState<any>([]);

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

  // マーク伝票一覧取得
  useEffect(() => {
    setMarkNotOrderSlips(
      markSlips.filter((slip: { assort: number }) =>
        slip.assort === 0 ? true : false
      )
    );
    setMarkOrderSlips(
      markSlips.filter((slip: { assort: number }) =>
        slip.assort === 1 ? true : false
      )
    );
    setMarkOvertimeSlips(
      markSlips.filter((slip: { assort: number }) =>
        slip.assort === 2 ? true : false
      )
    );
    setMarkSideJobSlips(
      markSlips.filter((slip: { assort: number }) =>
        slip.assort === 3 ? true : false
      )
    );
  }, [markSlips]);

  return (
    <Container maxW='1500px' mt={12} p={6} bgColor='white'>
      <Tabs>
        <TabList>
          <Tab>未受取</Tab>
          <Tab>受取済み</Tab>
          <Tab>残業</Tab>
          <Tab>内職</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <MarkList markSlips={markNotOrderSlips} />
          </TabPanel>
          <TabPanel>
            <MarkList markSlips={markOrderSlips} />
          </TabPanel>
          <TabPanel>
            <MarkList markSlips={markOvertimeSlips} />
          </TabPanel>
          <TabPanel>
            <MarkList markSlips={markSideJobSlips} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default MarkSlips;
