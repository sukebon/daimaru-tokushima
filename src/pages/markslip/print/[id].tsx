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
                一覧へ戻る
              </Button>
            </a>
          </Link>
          <ReactToPrint
            trigger={() => (
              <Button colorScheme="facebook" variant="outline" ml={6}>
                印刷
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
              伝票 No.{numberOfDigits(router.query.id)}
            </Box>
            <Box
              as="h1"
              mt={3}
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              マーク伝票
            </Box>
            <Stack mt={6} direction={{ md: "row" }}>
              <Box fontSize="lg" flex="1">
                顧客名 {customer}
              </Box>
              <Box fontSize="lg">希望納期 {deadline ? deadline : "未記入"}</Box>
            </Stack>
            <Box mt={2} fontSize="lg">
              納品先 {deliveryPlace ? deliveryPlace : "未記入"}
            </Box>

            <TableContainer mt={6}>
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th w="65%" fontSize="sm" pl={1}>
                      商品名
                    </Th>
                    <Th w="5%" fontSize="sm" px={2}>
                      サイズ
                    </Th>
                    <Th w="5%" fontSize="sm" px={2}>
                      数量
                    </Th>
                    <Th w="25%" fontSize="sm" pr={1}>
                      備考
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
              修理名 {repairName ? repairName : "未記入"}
            </Box>
            <HStack>
              <Box fontSize="lg" mr={4}>
                合計数量 {getSum(data)}
              </Box>
              <Box fontSize="lg">修理代 {price ? price : "未記入"}円</Box>
            </HStack>
          </HStack>

          {note && (
            <HStack mt={2} alignItems="start">
              <Box fontSize="lg">備　考 </Box>
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
