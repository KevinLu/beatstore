import React from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Flex } from "@chakra-ui/react";

function NavBar({ children }) {
  return (
    <div>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg="blue.800"
      >
        <LeftMenu />
        <RightMenu />
      </Flex>
      {children}
    </div>
  );
}

export default NavBar
