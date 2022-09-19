import { LockIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push('/');
        // ...
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        // ..
      });
  };
  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.alert('成功');
        const user = userCredential.user;
        router.push('/');
        // ...
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <LockIcon boxSize={6} />
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Stack>
          <Flex justifyContent='center'>
            <Button
              mt={9}
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={loginUser}
            >
              Sign in
            </Button>
          </Flex>
        </Box>
      </Stack>
    </Flex>
  );
}
