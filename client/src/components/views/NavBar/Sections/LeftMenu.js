import React from 'react';
import { Heading, Flex } from "@chakra-ui/core";
import { withRouter } from 'react-router-dom';

function LeftMenu(props) {
  const goHome = () => {
    props.history.push("/");
  }

  return (
    <Flex align="center" mr={5} ml={5}>
      <Heading color="white" as="h1" size="lg" letterSpacing={"-.1rem"}>
        <a href="#home" onClick={goHome}>BEATSTORE</a>
        </Heading>
    </Flex>
  );
}

export default withRouter(LeftMenu);
