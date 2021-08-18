import React, {useState, useEffect} from 'react';
import {useDispatch, connect} from 'react-redux';
import {getUserLicenses, toggleLicenseActivation} from '../../../../_actions/license_actions';
import {
  Box, Flex, SimpleGrid, Badge, Heading, Stack, Text, Button, Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Switch,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
} from '@chakra-ui/react';
import {MdChevronRight, MdEdit} from 'react-icons/md';
import LoadingView from '../../../utils/LoadingView';
import ErrorView from '../../../utils/ErrorView';
import EditLicense from './EditLicense';

const EmptyState = () => (
  <Stack
    margin="auto"
    justifyContent="center"
    alignItems="center"
    spacing={4}
    p={16}
  >
    <Heading size="xl">You haven't created any licenses.</Heading>
    <Text fontSize="lg">Welcome 👋 Let's create your first license.</Text>
    <Button colorScheme="blue">New License</Button>
  </Stack>
);

const BreadCrumbs = () => (
  <Breadcrumb spacing="8px" separator={<MdChevronRight color="gray.500" />}>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem isCurrentPage>
      <BreadcrumbLink href="#">Licenses</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
);

const LicenseCard = (license, onOpen, setEditLicenseId) => {
  const dispatch = useDispatch();

  const toggleStatus = () => {
    dispatch(toggleLicenseActivation(license._id));
  }

  const openEditModal = () => {
    setEditLicenseId(license._id);
    onOpen();
  }

  return (
    <SimpleGrid
      key={license._id}
      columns={3} spacing={4}
      p={4}
      justifyContent="space-between"
      border="1px"
      borderColor="gray.100"
      borderRadius="4px"
      backgroundColor="gray.50">
      <Stack>
        <Heading size="md">{license.name}</Heading>
        <Stack direction="row">
          {license.included_mp3 ?
            <Badge variant="solid">
              {license.mp3_untagged ? 'MP3' : 'MP3 tagged'}
            </Badge> : null}
          {license.included_wav ?
            <Badge variant="solid" colorScheme="pink">
              WAV
          </Badge> : null}
          {license.included_stems ?
            <Badge variant="solid" colorScheme="purple">
              Stems
          </Badge> : null}
        </Stack>
      </Stack>

      <Stat d="flex" justifyContent={["center", null, null, "normal"]}>
        <StatLabel>Default price</StatLabel>
        <StatNumber>${license.price}</StatNumber>
      </Stat>

      <Stack direction="column" ml="auto">
        <Stack direction="row">
          <Text fontWeight="semibold">Enabled</Text>
          <Switch onChange={toggleStatus} id="enabled" colorScheme="blue" defaultChecked={license.enabled} />
        </Stack>
        <Button onClick={openEditModal} leftIcon={<MdEdit />} colorScheme="blue">Edit</Button>
      </Stack>
    </SimpleGrid >
  );
};

function DashboardLicenses(props) {
  const {licenses} = props;
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [licensesLoading, setLicensesLoading] = useState(true);
  const [licensesError, setLicensesError] = useState(false);
  const [editLicenseId, setEditLicenseId] = useState(null);

  useEffect(() => {
    dispatch(getUserLicenses())
      .then(response => {
        setLicensesLoading(false);
        if (!response.payload.success) {
          //setLicensesError(true);
        }
      }).catch(err => {
        setLicensesLoading(false);
        //setLicensesError(true);
        console.log(err);
      });
  }, [dispatch]);

  if (licensesLoading) {
    return <LoadingView />;
  } else if (licenses == null || licensesError) {
    return <ErrorView
      title='Oh snap... 🤯 something went wrong.'
      description='Try refreshing the page.'
      padding={4} />;
  } else if (licenses?.length === 0) {
    return <EmptyState />;
  } else {
    return (
      <>
        <Box p={4} w="100%">
          <BreadCrumbs />
          <SimpleGrid columns={[1, 1, 1, 1, 2, 3]} spacing={4} mt={4}>
            {licenses.map(license => LicenseCard(license, onOpen, setEditLicenseId))}
          </SimpleGrid>
        </Box>
        <EditLicense isOpen={isOpen} onClose={onClose} license={licenses.find(lic => lic._id === editLicenseId)} />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    licenses: state.license.licenses,
  }
}

export default connect(mapStateToProps)(DashboardLicenses);
