import React from 'react';
import {
  HStack,
  Badge,
} from "@chakra-ui/react";

function LicenseBadges({license}) {
  return (
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
  );
}

export default LicenseBadges;
