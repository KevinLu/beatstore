import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEnabledLicenses } from '../../../_actions/license_actions';
import {
    Box,
    Flex,
    Grid,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Badge,
    Input,
    Textarea,
    Button,
    Checkbox,
    CheckboxGroup,
    HStack,
    useToast
} from "@chakra-ui/react";
import FileUpload from '../../utils/FileUpload';
import Tags from "@yaireo/tagify/dist/react.tagify"; // React-wrapper file
import "@yaireo/tagify/dist/tagify.css"; // Tagify CSS
import Axios from 'axios';
import {MdMusicNote, MdImage} from 'react-icons/md';
import {FiSliders} from 'react-icons/fi';
import {FaMusic} from 'react-icons/fa';

function UploadBeatPage(props) {
    const [IsUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();
    const licenses = useSelector(state => state.license.publicLicenses);

    useEffect(() => {
        dispatch(getEnabledLicenses());
    }, []);

    const [field, setField] = useState({
        title: "",
        description: "",
        bpm: 0,
        price: 0,
        licenses: [],
        date: new Date()
    });

    const onChangeHandler = e => {
        const {name, value} = e.target
        setField(prevField => ({
            ...prevField,
            [name]: value
        }));
    }

    const handleLicenseCheckbox = e => {
        setField(prevField => ({
            ...prevField,
            licenses: e
        }));
    }

    const [PreviewAudio, setPreviewAudio] = useState([]);
    const [PurchaseAudio, setPurchaseAudio] = useState([]);
    const [TrackStems, setTrackStems] = useState([]);
    const [Artwork, setArtwork] = useState([]);

    // Tagify settings object
    const baseTagifySettings = {
        maxTags: 3,
        backspace: "edit",
        placeholder: "Tag this beat",
    }

    const [BeatTags, setBeatTags] = useState([]);

    const updateTags = (newBeatTags) => {
        setBeatTags(newBeatTags);
    }

    // array to keep track of all the tags on beat
    var beattags = [];

    const tagInvalidCallback = e => {
        toast({
            position: "bottom",
            title: "Invalid tag.",
            description: "Invalid or duplicate tag.",
            status: "error",
            duration: 1000,
            isClosable: true,
        });
    }

    const tagAddCallback = e => {
        beattags[e.detail.index] = e.detail.data.value;
        updateTags(beattags);
    }

    const tagRemoveCallback = e => {
        beattags.splice(e.detail.index, 1);
        updateTags(beattags);
    }

    // callbacks props
    const tagifyCallbacks = {
        add: tagAddCallback,
        remove: tagRemoveCallback,
        invalid: tagInvalidCallback
    }

    const settings = {
        ...baseTagifySettings,
        callbacks: tagifyCallbacks
    }

    const toast = useToast();

    const onSubmit = (event) => {
        setIsUploading(true);
        event.preventDefault();

        if (!field.title || !field.description || !field.price || !field.bpm ||
            !field.licenses || !field.date || PreviewAudio.length === 0 ||
            Artwork.length === 0 || PurchaseAudio.length === 0) {
            setIsUploading(false);
            return toast({
                position: "bottom",
                title: "Empty fields!",
                description: "Fill in everything first.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }

        var safeTitle = field.title.replace(/\W+/g, '-').toLowerCase();
        var unixTimestamp = Math.floor(field.date / 1000);

        var ad = new Audio();
        ad.src = PreviewAudio[0];
        ad.onloadedmetadata = function () {
            const variables = {
                producer: props.user.userData._id,
                title: field.title,
                description: field.description,
                bpm: field.bpm,
                length: ad.duration,
                price: field.price,
                licenses: field.licenses,
                date: field.date,
                previewAudio: PreviewAudio,
                purchaseAudio: PurchaseAudio,
                trackStems: TrackStems,
                artwork: Artwork,
                tags: BeatTags,
                url: `${safeTitle}-${unixTimestamp}`
            }

            Axios.post('/api/beat/uploadBeat', variables)
                .then(response => {
                    setIsUploading(false);
                    if (response.data.success) {
                        toast({
                            position: "bottom",
                            title: "Beat uploaded.",
                            description: "Time to get those placements!",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                        props.history.push('/');
                    } else {
                        toast({
                            position: "bottom",
                            title: "Error uploading this beat.",
                            description: "Please try again.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                });
        };
    }

    if (props.user && props.user.userData.isAuth) {
        return (<Box m="3em 1em 5em 1em">
            <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                <Heading>UPLOAD</Heading>
                <form>
                    <Text mt={10} fontSize="2xl">Audio/Image Files</Text>
                    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                        <FormControl isRequired>
                            <Flex alignItems="center">
                                <FormLabel>Beat Preview (tagged)</FormLabel>
                                <Badge colorScheme="green">MP3/WAV</Badge>
                            </Flex>
                            <FileUpload
                                icon={MdMusicNote}
                                public={true}
                                accept="audio/mpeg, audio/wav"
                                maxFiles={1}
                                multiple={false}
                                fileState={PreviewAudio}
                                setFileState={setPreviewAudio} />
                        </FormControl>

                        <FormControl isRequired>
                            <Flex alignItems="center">
                                <FormLabel>Beat for Purchase</FormLabel>
                                <Badge colorScheme="green">MP3/WAV</Badge>
                            </Flex>
                            <FileUpload
                                icon={FaMusic}
                                public={false}
                                accept="audio/mpeg, audio/wav"
                                maxFiles={1}
                                multiple={false}
                                fileState={PurchaseAudio}
                                setFileState={setPurchaseAudio} />
                        </FormControl>

                        <FormControl>
                            <Flex alignItems="center">
                                <FormLabel>Track Stems</FormLabel>
                                <Badge colorScheme="green">ZIP/RAR</Badge>
                            </Flex>
                            <FileUpload
                                icon={FiSliders}
                                public={false}
                                accept=".rar, application/vnd.rar, application/x-rar-compressed,
                        application/octet-stream, application/zip,
                        application/x-zip-compressed, multipart/x-zip"
                                maxFiles={1}
                                multiple={false}
                                fileState={TrackStems}
                                setFileState={setTrackStems} />
                        </FormControl>

                        <FormControl isRequired>
                            <Flex alignItems="center">
                                <FormLabel>Artwork</FormLabel>
                                <Badge colorScheme="green">PNG/JPG/JPEG</Badge>
                            </Flex>
                            <FileUpload
                                icon={MdImage}
                                public={true}
                                accept="image/jpg, image/png, image/jpeg"
                                maxFiles={1}
                                fileState={Artwork}
                                setFileState={setArtwork} />
                        </FormControl>
                    </Grid>

                    <Text mt={10} fontSize="2xl">Track Information</Text>

                    <FormControl isRequired mt={4}>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder="Name of beat" onChange={onChangeHandler} value={field.title} name="title" />
                    </FormControl>

                    <FormControl isRequired mt={5}>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder="Describe this beat" onChange={onChangeHandler} value={field.description} name="description" />
                    </FormControl>

                    <FormControl isRequired mt={5}>
                        <FormLabel>BPM</FormLabel>
                        <Input onChange={onChangeHandler} value={field.bpm} name="bpm" type="number" />
                    </FormControl>

                    <FormControl isRequired mt={5}>
                        <FormLabel>Price (USD)</FormLabel>
                        <Input onChange={onChangeHandler} value={field.price} name="price" type="number" step="0.01" />
                    </FormControl>

                    <FormControl isRequired mt={5}>
                        <FormLabel>Attached licenses</FormLabel>
                        <CheckboxGroup onChange={handleLicenseCheckbox} value={field.licenses} name="attached_licenses">
                            <HStack>
                                {licenses?.map(lic => (
                                    <Checkbox value={lic._id} id={lic._id}>{lic.name}</Checkbox>
                                ))}
                            </HStack>
                        </CheckboxGroup>
                    </FormControl>

                    <FormControl isRequired mt={5}>
                        <FormLabel>Release date</FormLabel>
                        <Input isDisabled={true} onChange={onChangeHandler} value={field.date} name="date" />
                    </FormControl>

                    <FormLabel mt={5}>Tags (max. 3)</FormLabel>
                    <Tags style={{'border-radius': '0.25rem'}}
                        settings={settings}
                    />

                    <Button
                        mt={5}
                        colorScheme="blue"
                        isLoading={IsUploading}
                        loadingText="Uploading"
                        onClick={onSubmit}>
                        Upload
                    </Button>
                </form>
            </Box>
        </Box>);
    } else {
        return null;
    }
}

export default UploadBeatPage;
