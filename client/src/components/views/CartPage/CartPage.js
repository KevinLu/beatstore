import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';
import { Box, Grid, Text, Heading, Image, Button, CloseButton, ButtonGroup, Divider } from "@chakra-ui/core";
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

function CartPage(props) {
    const dispatch = useDispatch();
    const [Cart, setCart] = useState([]);
    var grossAmount = 0;
    var discountAmount = 0;

    useEffect(() => {
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) { // if userData exists
            if (props.user.userData.cart.length > 0) { // if the cart is not empty
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id);
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart)).then(response => {
                    setCart(response.payload);
                });
            }
        }
    }, [props.user.userData]);

    const renderCartItems = Cart.map((item, index) => {
        grossAmount += item.price;
        return (
            <div>
                <Grid templateColumns={{ base: "0.5fr 3fr 1fr", lg: "0.5fr 2fr 0.5fr 2fr" }} gap={3} alignItems="center">
                    <Image borderRadius="3px" size={{ base: "44px", lg: "60px" }} src={`http://localhost:5000/${item.images[0]}`}></Image>

                    <ListText fontSize="md" fontWeight="600"><Link to={`/beat/${item.url}`}>{item.title}</Link></ListText>

                    <ListText float={{ base: "right", lg: "initial" }} fontSize="xl" fontWeight="700">${item.price}</ListText>

                    <ButtonGroup display={{ base: "none", lg: "flex" }}>
                        <Button>
                            REVIEW LICENSE
                    </Button>
                        <CloseButton size="lg" />
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
                <Grid templateColumns={{ base: "1fr", lg: "2.5fr 1fr" }} mt="5em">
                    <div>
                        <Grid templateColumns={{ base: "0.5fr 3fr 1fr", lg: "0.5fr 2fr 0.5fr 2fr" }} gap={3}>
                            <div></div>
                            <ListHeading>PRODUCT</ListHeading>
                            <ListHeading float={{ base: "right", lg: "initial" }}>PRICE</ListHeading>
                            <div></div>
                        </Grid>
                        {renderCartItems}
                    </div>
                    <Box mt={{ base: "2em", lg: "0" }}>
                        <Box display="flex" justifyContent="space-between">
                            <Text color="black" fontSize="lg" fontWeight="600">Gross</Text>
                            <Text color="black" fontSize="lg" fontWeight="600">${grossAmount}</Text>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Text color="black" fontSize="lg" fontWeight="600">Discount</Text>
                            <Text color="black" fontSize="lg" fontWeight="600">-${discountAmount}</Text>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                            <Text color="blue.900" fontSize="2xl" fontWeight="800">Total</Text>
                            <Text color="blue.900" fontSize="2xl" fontWeight="800">${grossAmount - discountAmount}</Text>
                        </Box>
                        <Divider />
                        <Button width="100%" variantColor="blue">
                            PAYPAL CHECKOUT
                        </Button>
                    </Box>
                </Grid>
            </Box>
        </Box>
    )
}

export default CartPage
