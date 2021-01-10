import React, {useEffect, useState} from 'react';
import {useDispatch, connect} from 'react-redux';
import {getCartItems, removeFromCart} from '../../../_actions/cart_actions';
import {
    Box, Grid, Text, Heading, Image, Button, CloseButton, ButtonGroup, Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import LoadingView from "../../utils/LoadingView";
import LicenseText from "../../utils/LicenseText";
import {Link} from "react-router-dom";
import Axios from "axios";
import {loadStripe} from '@stripe/stripe-js/pure';
import {stripePublicKey} from '../../utils/StripeClient';

const stripePromise = loadStripe(stripePublicKey);

const ListHeading = ({children, displayBreakpoints, float}) => (
    <Box w="100%" h="10" display={displayBreakpoints}>
        <Text float={float} fontWeight="600" fontSize="sm" color="gray.900" letterSpacing="2px">{children}</Text>
    </Box>
);

const ListText = ({children, displayBreakpoints, fontSize, fontWeight, float}) => (
    <Box w="100%" h="10" mt="0.6em" display={displayBreakpoints}>
        <Text float={float} fontWeight={fontWeight} fontSize={fontSize} color="black">{children}</Text>
    </Box>
);

const CartHeading = () => (
    <Grid templateColumns={{base: "0.5fr 3fr 1fr", lg: "0.5fr 2fr 0.5fr 2fr"}} gap={3}>
        <div></div>
        <ListHeading>PRODUCT</ListHeading>
        <ListHeading float={{base: "right", lg: "initial"}}>PRICE</ListHeading>
        <div></div>
    </Grid>
);

const EmptyCartView = () => (
    <div>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Heading fontSize="3xl">Your cart is empty</Heading>
            <Button colorScheme="blue" mt={5}>
                <Link to="/">
                    BROWSE BEATS
                </Link>
            </Button>
        </Box>
    </div>
);

function CartPage(props) {
    const {cartIsLoaded, cart, cartDetail} = props;
    const dispatch = useDispatch();
    const [IsLoading, setIsLoading] = useState(true);
    const [GrossAmount, setGrossAmount] = useState(0);
    const [LicenseDetails, setLicenseDetails] = useState({'producer': 'PRODUCER NAME', 'title': 'Beat Title', 'price': "price"});
    const {isOpen, onOpen, onClose} = useDisclosure();
    const toast = useToast();

    const event = new Date(Date.now());
    const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    useEffect(() => {
        let cartItems = [];
        setIsLoading(true);
        if (cart && cart.length > 0) { // if cart exists and not empty
            cart.forEach(item => {
                cartItems.push(item.id);
            });
            dispatch(getCartItems(cartItems, cart))
                .then(response => {
                    if (response.payload.length > 0) {
                        loadCartInfo(response.payload);
                    }
                });
        } else {
            setIsLoading(false);
        }
    }, [cart]);

    const calculateGross = (cart) => {
        let gross = 0;
        cart.map(item => {
            gross += item.price;
        });
        setGrossAmount(gross, setIsLoading(false));
    }

    const loadCartInfo = (cartInfo) => {
        setIsLoading(true);
        calculateGross(cartInfo);
    }

    const removeItemFromCart = (beatId) => {
        dispatch(removeFromCart(beatId, window.localStorage.getItem("cartId")))
            .then(response => {
                calculateGross(response.payload.cartDetail);
            });
    }

    const stripeOnClick = async () => {
        var line_items = [];
        cartDetail.forEach((item, index) => {
            line_items[index] = {
                price: item.stripePriceId,
                quantity: 1
            }
        });
        const variables = {
            line_items: line_items
        }
        const apiResponse = await Axios.post('api/order/createSession', variables);
        // When the customer clicks on the button, redirect them to Checkout.
        if (apiResponse.data.success) {
            const sessionId = apiResponse.data.sessionId;
            const stripe = await stripePromise;
            const {error} = await stripe.redirectToCheckout({
                sessionId,
            });
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `error.message`.
            if (error) {
                toast({
                    title: "Account created.",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        }
    };

    const CartView = () => {
        if (IsLoading || !cartIsLoaded) {
            return <LoadingView />
        } else if (cartIsLoaded && cart.length === 0) {
            return <EmptyCartView />
        } else {
            return (
                <Grid templateColumns={{base: "1fr", lg: "2.5fr 1fr"}} mt="5em">
                    <div>
                        <CartHeading />
                        {renderCartItems}
                    </div>
                    <Box mt={{base: "2em", lg: "0"}}>
                        <Box display="flex" justifyContent="space-between">
                            <Text color="black" fontSize="lg" fontWeight="600">Gross</Text>
                            <Text color="black" fontSize="lg" fontWeight="600">${GrossAmount}</Text>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Text color="black" fontSize="lg" fontWeight="600">Discount</Text>
                            <Text color="black" fontSize="lg" fontWeight="600">-${0}</Text>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                            <Text color="blue.900" fontSize="2xl" fontWeight="700">Total</Text>
                            <Text color="blue.900" fontSize="2xl" fontWeight="700">${GrossAmount - 0}</Text>
                        </Box>
                        <Divider />
                        <Button colorScheme="blue" width="100%" onClick={stripeOnClick} size="lg">Pay ${GrossAmount}</Button>
                    </Box>
                </Grid>
            );
        }
    };

    const renderCartItems = cartDetail.map((item, index) => {
        const details = {'producer': item.producer.username, 'title': item.title, 'price': item.price};
        return (
            <Box key={index} mb="2em">
                <Grid templateColumns={{base: "0.5fr 3fr 1fr", lg: "0.5fr 2fr 0.5fr 2fr"}} gap={3} alignItems="center">
                    <Image borderRadius="3px" size={{base: "44px", lg: "60px"}} src={item.artwork[0]}></Image>

                    <ListText fontSize="md" fontWeight="600"><Link to={`/beat/${item.url}`}>{item.title}</Link></ListText>

                    <ListText float={{base: "right", lg: "initial"}} fontSize="xl" fontWeight="700">${item.price}</ListText>

                    <ButtonGroup display={{base: "none", lg: "flex"}}>
                        <Button onClick={() => {setLicenseDetails(details, onOpen());}}>
                            REVIEW LICENSE
                        </Button>
                        <CloseButton size="lg" onClick={() => removeItemFromCart(item._id)} />
                    </ButtonGroup>
                </Grid>
                <ButtonGroup display={{base: "flex", lg: "none"}} justifyContent="space-between" mt="0.5em">
                    <Button onClick={() => {setLicenseDetails(details, onOpen());}} size="sm">
                        REVIEW LICENSE
                    </Button>
                    <CloseButton size="md" onClick={() => removeItemFromCart(item._id)} />
                </ButtonGroup>
            </Box>
        );
    });

    return (
        <>
            <Box m="3em 1em 5em 1em">
                <Box maxWidth={["480px", "500px", "600px", "1166px"]} margin="auto">
                    <Heading>CART</Heading>
                    <CartView />
                </Box>
            </Box>
            <Modal preserveScrollBarGap isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold">BEAT LICENSE</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <LicenseText producer={LicenseDetails.producer} title={LicenseDetails.title} price={LicenseDetails.price} date={event.toLocaleString('en-US', dateOptions)} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            CLOSE
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        cartIsLoaded: state.cart.success,
        cart: state.cart.cart.array,
        cartDetail: state.cart.cartDetail
    }
}

export default connect(mapStateToProps)(CartPage);
