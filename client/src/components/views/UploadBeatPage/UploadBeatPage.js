import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Heading,
    FormHelperText,
    Input,
    Textarea,
    Button,
    useToast
} from "@chakra-ui/core";
import AudioUpload from '../../utils/AudioUpload';
import ImageUpload from '../../utils/ImageUpload';
import Tags from '@yaireo/tagify/dist/react.tagify';
import Axios from 'axios';

function UploadBeatPage(props) {

    const [field, setField] = useState({
        title: "",
        description: "",
        bpm: 0,
        price: 0,
        date: ""
    });

    const onChangeHandler = e => {
        const { name, value } = e.target
        setField(prevField => ({
            ...prevField,
            [name]: value
        }))
    }

    const [Audios, setAudios] = useState([])

    const updateAudios = (newAudios) => {
        setAudios(newAudios)
    }

    const [Images, setImages] = useState([])

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    // Tagify settings object
    const baseTagifySettings = {
        maxTags: 3,
        backspace: "edit",
        placeholder: "Tag this beat",
    }

    const [BeatTags, setBeatTags] = useState([])

    const updateTags = (newBeatTags) => {
        setBeatTags(newBeatTags)
    }

    // array to keep track of all the tags on beat
    var beattags = []

    const tagInvalidCallback = e => {
        toast({
            position: "bottom",
            title: "Invalid tag.",
            description: "Invalid or duplicate tag.",
            status: "error",
            duration: 1000,
            isClosable: true,
        })
    }

    const tagAddCallback = e => {
        beattags[e.detail.index] = e.detail.data.value;
        updateTags(beattags)
    }

    const tagRemoveCallback = e => {
        beattags.splice(e.detail.index, 1)
        updateTags(beattags)
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
        event.preventDefault();

        if (!field.title || !field.description || !field.price || !field.bpm || !field.date || !Images || !Audios || !BeatTags) {
            return toast({
                position: "bottom",
                title: "Empty fields!",
                description: "Fill in everything first.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }

        var ad = new Audio();
        ad.src = `http://localhost:5000/${Audios[0]}`
        ad.onloadedmetadata = function () {
            const variables = {
                producer: props.user.userData._id,
                title: field.title,
                description: field.description,
                bpm: field.bpm,
                length: ad.duration,
                price: field.price,
                date: field.date,
                audios: Audios,
                images: Images,
                tags: BeatTags
            }

            Axios.post('/api/beat/uploadBeat', variables)
                .then(response => {
                    if (response.data.success) {
                        toast({
                            position: "bottom",
                            title: "Beat uploaded.",
                            description: "Time to get those placements!",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        })
                        props.history.push('/')
                    } else {
                        toast({
                            position: "bottom",
                            title: "Error uploading this beat.",
                            description: "Please try again.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                });
        };
    }

    return (

        <div style={{ margin: '2rem' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Heading>Upload a Beat</Heading>
                </div>

                <form>
                    <FormControl isRequired>
                        <FormLabel>Upload Beat Preview (tagged)</FormLabel>
                        <AudioUpload refreshFunction={updateAudios} />
                        <FormHelperText>MP3/WAV only</FormHelperText>
                    </FormControl>

                    <FormControl isRequired mt={5}>
                        <FormLabel>Upload Artwork</FormLabel>
                        <ImageUpload refreshFunction={updateImages} />
                        <FormHelperText>PNG/JPG/JPEG only</FormHelperText>
                    </FormControl>

                    <FormControl isRequired mt={5}>
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
                        <FormLabel>Release date</FormLabel>
                        <Input isDisabled={true} onChange={onChangeHandler} value={field.date = Date()} name="date" />
                    </FormControl>

                    <FormLabel mt={5}>Tags (max. 3)</FormLabel>
                    <Tags
                        settings={settings}
                    />

                    <Button mt={5} variantColor="blue" onClick={onSubmit}>Upload</Button>
                </form>
            </div>
        </div>
    )
}

export default UploadBeatPage
