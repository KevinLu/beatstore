import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, removeFromCart } from '../../../_actions/cart_actions';
import { Box, CircularProgress, Grid, Text, Heading, Image, Button, CloseButton, ButtonGroup, Divider } from "@chakra-ui/core";
import { Link } from "react-router-dom";

const ListHeading = ({ children, displayBreakpoints, float }) => (
    <Box w="100%" h="10" display={displayBreakpoints}>
        <Text float={float} fontWeight="600" fontSize="sm" color="gray.900" letterSpacing="2px">{children}</Text>
    </Box>
);

const ListText = ({ children, displayBreakpoints, fontSize, fontWeight, float }) => (
    <Box w="100%" h="10" mt="0.6em" display={displayBreakpoints}>
        <Text float={float} fontWeight={fontWeight} fontSize={fontSize} color="black">{children}</Text>
    </Box>
);

const CartHeading = () => (
    <Grid templateColumns={{ base: "0.5fr 3fr 1fr", lg: "0.5fr 2fr 0.5fr 2fr" }} gap={3}>
        <div></div>
        <ListHeading>PRODUCT</ListHeading>
        <ListHeading float={{ base: "right", lg: "initial" }}>PRICE</ListHeading>
        <div></div>
    </Grid>
);

const EmptyCartView = () => (
    <div>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Heading fontSize="3xl">Your cart is empty</Heading>
            <Button variantColor="blue" mt={5}>
                <Link to="/">
                    BROWSE BEATS
                </Link>
            </Button>
        </Box>
    </div>
);

function CartPage() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const [IsLoading, setIsLoading] = useState(true);
    const [GrossAmount, setGrossAmount] = useState(0);

    useEffect(() => {
        let cartItems = [];
        setIsLoading(true);
        if (cart.cart && cart.cart.array) { // if userData exists
            if (cart.cart.array.length > 0) { // if the cart is not empty
                cart.cart.array.forEach(item => {
                    cartItems.push(item.id);
                });
                dispatch(getCartItems(cartItems, cart.cart.array))
                    .then(response => {
                        if (response.payload.length > 0) {
                            loadCartInfo(response.payload);
                        }
                    });
            } else {
                setIsLoading(false);
            }
        }
    }, [cart.cart.array]);

    const calculateGross = (cart) => {
        let gross = 0;
        cart.map(item => {
            gross += parseInt(item.price, 10);
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

    const CartLoadingView = () => (
        <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress isIndeterminate={IsLoading} color="blue" />
        </Box>
    );

    const CartView = () => {
        if (IsLoading) {
            return <CartLoadingView />
        } else if (cart.cart.array.length === 0) {
            return <EmptyCartView />
        } else {
            return (
                <Grid templateColumns={{ base: "1fr", lg: "2.5fr 1fr" }} mt="5em">
                    <div>
                        <CartHeading />
                        {renderCartItems}
                    </div>
                    <Box mt={{ base: "2em", lg: "0" }}>
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
                            <Text color="blue.900" fontSize="2xl" fontWeight="800">Total</Text>
                            <Text color="blue.900" fontSize="2xl" fontWeight="800">${GrossAmount - 0}</Text>
                        </Box>
                        <Divider />
                        <Button width="100%" variantColor="blue">
                            PAYPAL CHECKOUT
                </Button>
                    </Box>
                </Grid>
            );
        }
    };

    const renderCartItems = cart.cartDetail.map((item, index) => {
        return (
            <div key={index}>
                <Grid templateColumns={{ base: "0.5fr 3fr 1fr", lg: "0.5fr 2fr 0.5fr 2fr" }} gap={3} alignItems="center">
                    <Image borderRadius="3px" size={{ base: "44px", lg: "60px" }} src={`http://localhost:5000/${item.images[0]}`}></Image>

                    <ListText fontSize="md" fontWeight="600"><Link to={`/beat/${item.url}`}>{item.title}</Link></ListText>

                    <ListText float={{ base: "right", lg: "initial" }} fontSize="xl" fontWeight="700">${item.price}</ListText>

                    <ButtonGroup display={{ base: "none", lg: "flex" }}>
                        <Button>
                            REVIEW LICENSE
                        </Button>
                        <CloseButton size="lg" onClick={() => removeItemFromCart(item._id)} />
                    </ButtonGroup>
                </Grid>
                <ButtonGroup display={{ base: "flex", lg: "none" }} justifyContent="space-between" mt="0.5em">
                    <Button size="sm">
                        REVIEW LICENSE
                    </Button>
                    <CloseButton size="md" />
                </ButtonGroup>
            </div>
        );
    });

    return (
        <Box m="3em 1em 5em 1em">
            <Box maxWidth={["480px", "500px", "600px", "1166px"]} margin="auto">
                <Heading>CART</Heading>
                <CartView />
            </Box>
        </Box>
    )
}

export default CartPage
