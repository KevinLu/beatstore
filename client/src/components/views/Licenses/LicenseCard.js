import React from 'react';
import {
  Text,
  Heading,
  VStack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";

function LicenseCard(props) {
  const {license} = props;

  return (
    <VStack>
      <Heading size="md">{license.name}</Heading>
      <Heading>${license.price}</Heading>
      <Text>Files included:</Text>
      <HStack>
        {license.included_mp3 ?
          <Badge variant="solid">
            {license.mp3_untagged ? 'MP3 untagged' : 'MP3 tagged'}
          </Badge> : null}
        {license.included_wav ?
          <Badge variant="solid" colorScheme="pink">
            WAV
          </Badge> : null}
        {license.included_stems ?
          <Badge variant="solid" colorScheme="purple">
            Stems
          </Badge> : null}
      </HStack>
      <Button>View License</Button>
    </VStack>
  );
}

export default LicenseCard;
