import React from 'react';
import {Button} from "@chakra-ui/react";
import {FaShoppingCart} from 'react-icons/fa';

function BuyButton({price, isInCart}) {
  return (
    <>
      <Button
        leftIcon={isInCart ? null : <FaShoppingCart />}
        colorScheme="blue"
        style={{background: isInCart ? "#63b3ed" : null}}
        variant="solid"
        >
        {isInCart ? "IN CART" : `$${price}`}
      </Button>
    </>
  );
}

export default BuyButton;
