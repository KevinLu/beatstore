import React from 'react';
import {
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import SelectLicense from '../utils/SelectLicense';
import {FaShoppingCart} from 'react-icons/fa';

function AddToCartButton({price, licenses, isInCart}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        leftIcon={isInCart ? null : <FaShoppingCart />}
        colorScheme="blue"
        style={{background: isInCart ? "#63b3ed" : null}}
        variant="solid"
        onClick={onOpen}
        >
        {isInCart ? "IN CART" : `$${price}`}
      </Button>
      <SelectLicense isOpen={isOpen} onClose={onClose} licenses={licenses} />
    </>
  );
}

export default AddToCartButton;
