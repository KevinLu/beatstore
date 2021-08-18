import React from 'react';
import {Flex, Text} from '@chakra-ui/react';

function ErrorView(props) {
  const { title, description, padding } = props;
  return (
    <Flex m="auto" justifyContent="center" alignItems="center" flexDir="column" padding={padding}>
      <Text fontSize="4xl" textAlign="center">
        {title}
      </Text>
      <Text fontSize="xl" mt="1em" textAlign="center">
        {description}
      </Text>
    </Flex>
  )
}

export default ErrorView;
