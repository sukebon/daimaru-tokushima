import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../../store';
import Header from './Header';
import Loading from './Loading';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const path = router.pathname;
  const loading = useRecoilValue(loadingState);

  return (
    <Box minH='100vh' bg='#fafafa'>
      {loading && <Loading />}
      {path !== '/login' && path !== '/register' && <Header />}
      {children}
    </Box>
  );
};

export default Layout;
