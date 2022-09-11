import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Header from './Header';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const path = router.pathname;
  console.log(path);
  return (
    <Box minH='100vh' bg='gray.100'>
      {path !== '/login' && path !== '/register' && <Header />}
      {children}
    </Box>
  );
};

export default Layout;
