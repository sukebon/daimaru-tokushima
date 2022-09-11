import { Box, Container } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  const menuList = [
    { title: 'menu1', link: '/' },
    { title: 'menu2', link: '/' },
  ];
  return (
    <Box
      w='100%'
      bg='rgba(255, 255, 255, 0.8)'
      boxShadow='1px 1px 3px 0px #00000014'
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
            gap={2}
            fontSize='md'
          >
            {menuList.map((menu: { title: string; link: string }) => (
              <Link key={menu.title} href={menu.link}>
                <Box p={2}>{menu.title}</Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
