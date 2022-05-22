import React, {useState, useEffect} from 'react';
import {useDispatch, connect} from 'react-redux';
import {getUserLicenses, toggleLicenseActivation, createLicense} from '../../../../_actions/license_actions';
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
import {MdChevronRight, MdEdit, MdAdd} from 'react-icons/md';
import LoadingView from '../../../utils/LoadingView';
import ErrorView from '../../../utils/ErrorView';
import EditLicense from './EditLicense';

const emptyLicense = {
  "name": "New License",
  "price": 100,
  "min_offer_price": 0,
  "enabled": false,
  "included_mp3": true,
  "mp3_untagged": true,
  "included_wav": false,
  "included_stems": false,
  "audio_streams": 10000,
  "distribution_copies": 10000,
  "free_downloads": 10000,
  "music_videos": 1,
  "music_video_streams": 10000,
  "radio_stations": 1,
  "allow_for_profit_performances": true,
  "non_profit_performances": -1,
};

const EmptyState = () => {
  const dispatch = useDispatch();
  const [newLicenseLoading, setNewLicenseLoading] = useState(false);

  const createNewLicense = () => {
    setNewLicenseLoading(true);
    dispatch(createLicense(emptyLicense))
      .then(response => {
        if (response.payload.success) {
          setNewLicenseLoading(false);
        }
      })
      .catch(err => {
        setNewLicenseLoading(false);
        console.log(err);
      });
  }

  return (
    <Stack
      margin="auto"
      justifyContent="center"
      alignItems="center"
      spacing={4}
      p={16}
    >
      <Heading size="xl">You haven't created any licenses.</Heading>
      <Text fontSize="lg">Let's create your first license.</Text>
      <Button colorScheme="blue"
        isLoading={newLicenseLoading}
        onClick={createNewLicense}>
        New License
      </Button>
    </Stack>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const [newLicenseLoading, setNewLicenseLoading] = useState(false);

  const createNewLicense = () => {
    setNewLicenseLoading(true);
    dispatch(createLicense(emptyLicense))
      .then(response => {
        if (response.payload.success) {
          setNewLicenseLoading(false);
        }
      })
      .catch(err => {
        setNewLicenseLoading(false);
        console.log(err);
      });
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Breadcrumb spacing="8px" separator={<MdChevronRight color="gray.500" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Licenses</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Button leftIcon={<MdAdd />}
        isLoading={newLicenseLoading}
        onClick={createNewLicense}>
        New License
      </Button>
    </Flex>
  );
};

const LicenseCard = (license, onOpen, setEditLicense) => {
  const dispatch = useDispatch();

  const toggleStatus = () => {
    dispatch(toggleLicenseActivation(license._id));
  }

  const openEditModal = () => {
    setEditLicense(license);
    onOpen();
  }

  return (
    <SimpleGrid
      key={license._id}
      columns={3} spacing={4}
      p={4}
      justifyContent="space-between"
      border="1px"
      borderRadius="4px">
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
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [licensesLoading, setLicensesLoading] = useState(true);
  const [licensesError, setLicensesError] = useState(false);
  const [editLicense, setEditLicense] = useState(null);

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
          <Header onOpen={onOpen} setEditLicense={setEditLicense} />
          <SimpleGrid columns={[1, 1, 1, 1, 2, 3]} spacing={4} mt={4}>
            {licenses.map(license => LicenseCard(license, onOpen, setEditLicense))}
          </SimpleGrid>
        </Box>
        <EditLicense isOpen={isOpen} onClose={onClose} license={editLicense} />
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
