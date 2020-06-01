import React from 'react';
import { Heading, Flex } from "@chakra-ui/core";
import { Link } from 'react-router-dom';

function LeftMenu() {
  return (
    <Flex align="center">
      <Heading color="white" as="h1" size="lg" letterSpacing={"-.1rem"}>
        <Link to="/">BEATSTORE</Link>
        </Heading>
    </Flex>
  );
}

export default LeftMenu;
