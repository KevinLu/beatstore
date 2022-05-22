import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Button,
  Flex,
  Stack,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/react';
import BuyButton from './BuyButton';
import LicenseBadges from './LicenseBadges';
import {LicenseValuesIcons, LicenseValues} from '../constants';
import parseLicenseValues from './parseLicenseValues';

const LicenseUsageTerm = ({term, value}) => {
  if (!term || !value) return null;

  return (
    <Stack direction="row" align="center">
      <Icon as={LicenseValuesIcons[term]} color="blue.600" />
      <Text>{parseLicenseValues(term, value)}</Text>
    </Stack>
  );
};

const SelectLicenseCard = ({license, priceOverride}) => {
  // use the override price if it's not zero
  const price = priceOverride !== 0 ? priceOverride : license.price;
  return (
    <Flex direction="column" flex="1">
      <Flex justifyContent="space-between">
        <Stack direction={{base: "column", sm: "row"}} flexWrap="wrap">
          <Heading as="h3" size="lg">{license.name}</Heading>
          <LicenseBadges license={license} />
        </Stack>
        <BuyButton price={price} />
      </Flex>
      <Accordion allowToggle>
        <AccordionItem>
          <Heading as="h4">
            <AccordionButton>
              <Text>
                Usage terms
              </Text>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={{base: 1, md: 2}} spacingY={2}>
              {LicenseValues.map(lv => <LicenseUsageTerm term={lv} value={license[lv]} />)}
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

const SelectLicenseModalContent = ({licenses}) => {
  if (!licenses) {
    return <>No licenses found</>;
  }

  return (
    <Stack spacing={8}>
      {licenses.filter(lic => lic.enabled_for_beat).map(lic =>
        <SelectLicenseCard id={lic.license._id} license={lic.license} priceOverride={lic.price_override} />)}
    </Stack>
  );
}

function SelectLicense(props) {
  const {isOpen, onClose, licenses} = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select your license</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
          <SelectLicenseModalContent licenses={licenses} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectLicense;
