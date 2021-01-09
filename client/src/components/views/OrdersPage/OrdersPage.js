import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Axios from 'axios';
import {
    Box,
    Grid,
    Stack,
    Heading,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useToast,
    Image,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import LoadingView from '../../utils/LoadingView';
import LicenseText from "../../utils/LicenseText";
import {FiChevronDown} from "react-icons/fi";

function OrdersPage(props) {
    const [IsLoading, setIsLoading] = useState(true);
    const [Orders, setOrders] = useState([]);
    const event = new Date(Date.now());
    const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const [LicenseDetails, setLicenseDetails] = useState({'producer': 'PRODUCER NAME', 'title': 'Beat Title', 'price': "price", 'date': event.toLocaleString('en-US', dateOptions)});
    const {isOpen, onOpen, onClose} = useDisclosure();

    const location = useLocation();
    const queries = queryString.parse(location.search);
    const toast = useToast();

    useEffect(() => {
        Axios.get('/api/order/getUserOrders')
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    toast({
                        title: "An error occurred.",
                        description: "Couldn't fetch order history, please try again.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
                setIsLoading(false);
            })
            .catch(err => {
                toast({
                    title: "An error occurred.",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
    }, [toast]);

    const downloadBeat = (mongo_id) => {
        Axios.post('/api/order/getDownloadLink', {mongo_id})
            .then(response => {
                if (response.data.success) {
                    window.location = response.data.downloadLink;
                }
            })
            .catch(err => {
                toast({
                    title: "An error occurred.",
                    description: err.response.data.msg,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
    }

    const viewReceipt = (paymentIntent) => {
        Axios.post('/api/order/getReceiptLink', {paymentIntent})
            .then(response => {
                if (response.data.success) {
                    window.location = response.data.receiptLink;
                }
            })
            .catch(err => {
                toast({
                    title: "An error occurred.",
                    description: err.response.data.msg,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
    }

    const renderOrderItems = Orders.map((order, index) => {
        var orderTotal = 0;
        var currency = "USD"; // Default currency is USD as set in Stripe
        var paymentIntent = order.checkoutSession.payment_intent;
        var orderDate = new Date(order.date).toLocaleString('en-US', dateOptions);

        return (
            <Box key={index} border="1px solid" borderColor="gray.200" borderRadius="4px" mb={4} p={4}>
                <Heading as="h4" size="md" fontWeight="600" mb={4}>ORDER DATE: {order.date.substring(0, 10)}</Heading>
                {order.products.map((product, index) => {
                    orderTotal += product.amount_total;
                    // This will break if items are in different currencies
                    // -> shouldn't happen (?) because currency is set in Stripe
                    currency = product.currency.toUpperCase();
                    const details = {'producer': product.producer.username, 'title': product.title, 'price': product.amount_total / 100, 'date': orderDate};

                    return (
                        <div key={index}>
                            <Grid templateColumns={{base: "1fr 2fr 1fr", lg: "auto auto 1fr"}} gap={6} alignItems="center" mb={4}>
                                <Link to={"/beat/" + product.url}>
                                    <Image
                                        borderRadius="3px"
                                        boxSize={{base: "60px", lg: "80px"}}
                                        src={product.image}
                                        fallbackSrc="https://via.placeholder.com/80"
                                        cursor="pointer"
                                    />
                                </Link>
                                <Stack>
                                    <Link to={"/beat/" + product.url}>
                                        <Heading as="h3" size="md" fontWeight="400">{product.description}</Heading>
                                    </Link>
                                    <Text wordWrap="anywhere" fontSize="md" fontWeight="400" mt={2}>${product.amount_total / 100} {product.currency.toUpperCase()}</Text>
                                </Stack>
                                <Box ml="auto">
                                    <Menu>
                                        <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                                            Actions
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={() => downloadBeat(product.price.metadata.mongo_id)}>Download</MenuItem>
                                            <MenuItem onClick={()=>{setLicenseDetails(details, onOpen());}}>View License</MenuItem>
                                            <MenuItem onClick={() => viewReceipt(paymentIntent)}>View Receipt</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </Grid>
                        </div>
                    );
                })}
                <Divider borderColor="gray.400" />
                <Heading as="h3" size="md" fontWeight="600">Total: ${orderTotal / 100} {currency}</Heading>
            </Box>
        );
    });

    if (props.user && props.user.userData.isAuth) {
        return (
            <div>
                <Box m="3em 1em 5em 1em">
                    <Box maxWidth={["480px", "500px", "600px", "1166px"]} margin="auto">
                        <Heading mb={8}>ORDERS</Heading>
                        {Orders.length > 0 ?
                            renderOrderItems
                            : IsLoading ?
                                <LoadingView />
                                :
                                <Text fontSize="lg">No orders found! Check out more beats
                                    <Link to="/">
                                        &nbsp;<u>here</u>
                                    </Link>.
                                </Text>
                        }
                    </Box>
                </Box>
                <Modal preserveScrollBarGap isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="full">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader fontWeight="bold">BEAT LICENSE</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <LicenseText producer={LicenseDetails.producer} title={LicenseDetails.title} price={LicenseDetails.price} date={LicenseDetails.date} />
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                CLOSE
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        );
    } else {
        return (<></>);
    }
}

export default OrdersPage
