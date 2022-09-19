import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import {
  Box,
  Container,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

const Header = () => {
  const router = useRouter();
  const currentUser = useAuthState(auth);
  const menuList = [{ title: 'トップページ', link: '/' }];

  useEffect(() => {
    if (currentUser[0] === null) {
      console.log('ログインしてください');
      router.push('/login');
    }
  }, [currentUser, router]);

  const signOutClick = () => {
    signOut(auth)
      .then(() => {
        console.log('サインアウトしました');
        router.push('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      w='100%'
      bg='rgba(255, 255, 255, 0.8)'
      boxShadow='1px 1px 3px 0px #00000014'
      position='sticky'
      top={0}
      zIndex='100'
    >
      <Container
        maxW='1280px'
        minHeight='60px'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Box>
          <Link href='/'>
            <a>
              <h1>大丸白衣 徳島工場</h1>
            </a>
          </Link>
        </Box>
        <Box>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            gap={6}
            fontSize='md'
          >
            {menuList.map((menu: { title: string; link: string }) => (
              <Link key={menu.title} href={menu.link}>
                <Box cursor='pointer'>{menu.title}</Box>
              </Link>
            ))}
            <Box>
              <Menu>
                <MenuButton>マーク伝票</MenuButton>
                <MenuList>
                  <Link href='/markslip/new'>
                    <a>
                      <MenuItem>伝票作成</MenuItem>
                    </a>
                  </Link>
                  <Link href='/markslip'>
                    <a>
                      <MenuItem>伝票一覧</MenuItem>
                    </a>
                  </Link>
                  <MenuDivider />
                  <Link href='/markspec/new'>
                    <a>
                      <MenuItem>仕様書作成</MenuItem>
                    </a>
                  </Link>
                  <Link href='/markspec'>
                    <a>
                      <MenuItem>仕様書一覧</MenuItem>
                    </a>
                  </Link>
                </MenuList>
              </Menu>
            </Box>
            <Box cursor='pointer' onClick={() => signOutClick()}>
              ログアウト
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
