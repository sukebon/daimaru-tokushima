import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { DragHandleIcon } from '@chakra-ui/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { NextPage } from 'next';

type Props = {
  slipId: string;
};

const MarkListMenuButton: NextPage<Props> = ({ slipId }) => {
  const assortChange0 = async (id: string) => {
    const docRef = doc(db, 'markSlips', `${id}`);
    await updateDoc(docRef, {
      assort: 0,
    });
  };
  const assortChange1 = async (id: string) => {
    const docRef = doc(db, 'markSlips', `${id}`);
    await updateDoc(docRef, {
      assort: 1,
    });
  };
  const assortChange2 = async (id: string) => {
    const docRef = doc(db, 'markSlips', `${id}`);
    await updateDoc(docRef, {
      assort: 2,
    });
  };
  const assortChange3 = async (id: string) => {
    const docRef = doc(db, 'markSlips', `${id}`);
    await updateDoc(docRef, {
      assort: 3,
    });
  };
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<DragHandleIcon />}
        variant='goast'
      />
      <MenuList>
        <MenuItem onClick={() => assortChange2(slipId)}>残業</MenuItem>
        <MenuItem onClick={() => assortChange3(slipId)}>内職</MenuItem>
        <MenuItem onClick={() => assortChange0(slipId)}>未受取に戻す</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MarkListMenuButton;
