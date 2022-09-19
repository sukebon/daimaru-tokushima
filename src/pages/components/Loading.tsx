import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

const Loading = () => {
  return (
    <Flex
      position='fixed'
      zIndex='1000'
      w='100%'
      h='100vh'
      justifyContent='center'
      alignItems='center'
    >
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
    </Flex>
  );
};

export default Loading;
