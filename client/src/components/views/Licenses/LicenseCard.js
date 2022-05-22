import React from 'react';
import {
  Text,
  Heading,
  VStack,
  Button,
} from "@chakra-ui/react";
import LicenseBadges from '../../utils/LicenseBadges';

function LicenseCard({license}) {
  return (
    <VStack>
      <Heading size="md">{license.name}</Heading>
      <Heading>${license.price}</Heading>
      <Text>Files included:</Text>
      <LicenseBadges license={license} />
      <Button>View License</Button>
    </VStack>
  );
}

export default LicenseCard;
