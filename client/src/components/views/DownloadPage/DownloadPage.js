import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {removeAllFromCart} from '../../../_actions/cart_actions';
import {
    Box,
    Image,
    Flex,
    Badge,
    Text,
    Link,
    Button,
    Stack,
    useToast
} from '@chakra-ui/react';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import Axios from 'axios';
import LoadingView from '../../utils/LoadingView';

const NotWorkingText = () => (
    <Text fontSize="xl" mt="1em" mb="1em" d="flex" justifyContent="center">
        Download not working? Contact me at&nbsp;
        <Link textAlign="center" color="blue.500" href="mailto:prodglace@gmail.com">prodglace@gmail.com</Link>
    </Text>
);

function DownloadPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const queries = queryString.parse(location.search);
    const toast = useToast();

    const [Items, setItems] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);
    const [IsError, setIsError] = useState(false);

    const removeAllItemsFromCart = () => {
        dispatch(removeAllFromCart(window.localStorage.getItem("cartId")))
            .then(response => {
                console.log(response);
            });
    }

    const verifyOrderIsPaid = (session_id) => {
        Axios.get(`/api/order/getOrderStatus?session_id=${session_id}`)
            .then(response => {
                if (response.data.success) {
                    if (response.data.orderStatus === "succeeded") {
                        toast({
                            title: "Thank you for your purchase!",
                            description: "Please download your files here.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
                        setItems(response.data);
                        removeAllItemsFromCart();
                    } else {
                        setIsError(true);
                        toast({
                            title: "Payment not yet received.",
                            description: "We haven't received your payment yet, please check back later.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                }
                setIsLoading(false);
            })
            .catch(err => {
                setIsError(true);
                toast({
                    title: "An error occurred.",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                setIsLoading(false);
            });
    };

    useEffect(() => {
        verifyOrderIsPaid(queries.session_id);
    }, [queries.session_id]);

    if (IsLoading) {
        return (
            <Box margin="40vh auto">
                <LoadingView />
                <NotWorkingText />
            </Box>
        );
    } else if (IsError) {
        return (
            <Box margin="40vh auto">
                <Text fontSize="4xl" mt="1em" mb="1em" d="flex" justifyContent="center">
                    Oh snap... something went wrong.
                </Text>
                <NotWorkingText />
            </Box>
        );
    } else if (Items.lineItems) {
        return (
            <div>
                <Box mt={2} textAlign="center" lineHeight="short" d="flex" flexDir="column" justifyContent="center" mt="3em">
                    <Text fontSize="3xl" fontWeight="semibold">
                        Thank you for purchasing! Please download your files below.
                    </Text>
                    <Text fontSize="xl" mt="1em">
                        Please save this link if you want to download your files again.
                    </Text>
                </Box>
                {Items.lineItems.map((item, index) => {
                    return (
                        <Box key={index} width="300px" m="auto" mt="5em" mb="5em">
                            <Box border="1px solid #CBD5E0" rounded="md" p="1.5em">
                                <Image rounded="md" src={item.artwork[0]} fallbackSrc="https://via.placeholder.com/300" width="300px" />
                                <Flex align="baseline" mt={2}>
                                    <Badge colorScheme="blue">PREMIUM</Badge>
                                    <Text
                                        ml={2}
                                        textTransform="uppercase"
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color="blue.800"
                                    >
                                        MP3 &bull; 320kbps
                                        </Text>
                                </Flex>
                                <Stack spacing={2}>
                                    <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
                                        {item.title}
                                    </Text>
                                    <Text>{item.description}</Text>
                                    <Button as="a" href={Items.downloadLinks[index]} mt={2} colorScheme="blue" variant="solid">
                                        Download
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    )
                })}
                <NotWorkingText />
            </div>
        );
    } else {
        return (
            <Box margin="40vh auto">
                <Text fontSize="xl" mt="1em" mb="1em" d="flex" justifyContent="center">
                    Oh snap... something went wrong.
                </Text>
                <NotWorkingText />
            </Box>
        );
    }
}

export default DownloadPage
