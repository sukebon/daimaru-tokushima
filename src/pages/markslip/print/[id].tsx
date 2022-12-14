/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactToPrint from "react-to-print";
import { auth, db } from "../../../../firebase";
import MarkRecord from "../../components/mark/MarkRecord";
import { numberOfDigits } from "../../../../functions";

const MarkSlipPrintId = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const currentUser = useAuthState(auth);
  const currentUserId = currentUser[0]?.uid;
  const [customer, setCustomer] = useState("");
  const [deliveryPlace, setDeliveryPlace] = useState("");
  const [deadline, setDeadline] = useState("");
  const [repairName, setRepairName] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState<any>();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getDocSplit = async () => {
      const docRef = doc(db, "markSlips", `${router.query.id}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap) return;
      const docSlip = docSnap.data();
      setCustomer(docSlip?.customer);
      setDeliveryPlace(docSlip?.deliveryPlace);
      setDeadline(docSlip?.deadline);
      setRepairName(docSlip?.repairName);
      setPrice(docSlip?.price);
      setNote(docSlip?.note);
      setUrl(docSlip?.url);
      setData(docSlip?.data);
    };
    getDocSplit();
  }, [router.query.id]);

  const getSum = (data: any) => {
    let sum = 0;
    if (!data) return;
    data.forEach((d: { quantity: number }) => {
      if (!d.quantity) return;
      sum += Number(d.quantity);
    });
    return sum;
  };

  return (
    <>
      <Container mt={12}>
        <Flex justifyContent="center">
          <Link href="/markslip">
            <a>
              <Button colorScheme="facebook" variant="outline">
                ???????????????
              </Button>
            </a>
          </Link>
          <ReactToPrint
            trigger={() => (
              <Button colorScheme="facebook" variant="outline" ml={6}>
                ??????
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Flex>
      </Container>
      <Box p={6}>
        <Container
          maxW="800px"
          pt={12}
          pb={6}
          px={12}
          backgroundColor="white"
          ref={componentRef}
        >
          <Box>
            <Box textAlign="right" fontSize="lg">
              ?????? No.{numberOfDigits(router.query.id)}
            </Box>
            <Box
              as="h1"
              mt={3}
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              ???????????????
            </Box>
            <Stack mt={6} direction={{ md: "row" }}>
              <Box fontSize="lg" flex="1">
                ????????? {customer}
              </Box>
              <Box fontSize="lg">???????????? {deadline ? deadline : "?????????"}</Box>
            </Stack>
            <Box mt={2} fontSize="lg">
              ????????? {deliveryPlace ? deliveryPlace : "?????????"}
            </Box>

            <TableContainer mt={6}>
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th w="65%" fontSize="sm" pl={1}>
                      ?????????
                    </Th>
                    <Th w="5%" fontSize="sm" px={2}>
                      ?????????
                    </Th>
                    <Th w="5%" fontSize="sm" px={2}>
                      ??????
                    </Th>
                    <Th w="25%" fontSize="sm" pr={1}>
                      ??????
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((d) => (
                    <MarkRecord key={d} record={d} />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <HStack mt={6}>
            <Box fontSize="lg" flex="1">
              ????????? {repairName ? repairName : "?????????"}
            </Box>
            <HStack>
              <Box fontSize="lg" mr={4}>
                ???????????? {getSum(data)}
              </Box>
              <Box fontSize="lg">????????? {price ? price : "?????????"}???</Box>
            </HStack>
          </HStack>

          {note && (
            <HStack mt={2} alignItems="start">
              <Box fontSize="lg">????????? </Box>
              <Box fontSize="lg" flex="1" whiteSpace="pre-wrap">
                {note}
              </Box>
            </HStack>
          )}

          {url &&
            url.map((image: any) => (
              <Box key={image} mt={6} position="relative">
                <Image
                  src={image}
                  alt={image}
                  width="auto"
                  height="350px"
                  objectFit="cover"
                />
              </Box>
            ))}
        </Container>
      </Box>
    </>
  );
};
export default MarkSlipPrintId;
