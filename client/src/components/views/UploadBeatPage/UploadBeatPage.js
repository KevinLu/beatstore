import React, { useState } from 'react';
import { Typography, Button, Form, message, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Tags from '@yaireo/tagify/dist/react.tagify';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

function UploadBeatPage(props) {

    const [field, setField] = useState({
        title: "",
        description: "",
        price: 0,
    });

    const onChangeHandler = e => {
        const { name, value } = e.target
        setField(prevField => ({
            ...prevField,
            [name]: value
        }))
    }

    const [Files, setFiles] = useState([])

    const updateFiles = (newFiles) => {
        setFiles(newFiles)
    }

    // just a name I made up for allowing dynamic changes for tagify settings on this component
    const [tagifySettings, setTagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState([])

    // Tagify settings object
    const baseTagifySettings = {
        maxTags: 12,
        backspace: "edit",
        placeholder: "Tag this beat",
    }

    const [BeatTags, setBeatTags] = useState([])

    const updateTags = (newBeatTags) => {
        setBeatTags(newBeatTags)
    }

    // array to keep track of all the tags on beat
    var beattags = []

    const tagInvalidCallback = e =>
        message.error('Invalid or duplicate tag!')

    const tagAddCallback = e => {
        beattags[e.detail.index] = e.detail.data.value;
        updateTags(beattags)
    }

    const tagRemoveCallback = e => {
        beattags.splice(e.detail.index, 1)
        updateTags(beattags)
    }

    const callback = e =>
        console.log(`%c ${e.type}: `, "background:#222; color:#bada55", e.detail)

    // callbacks props
    const tagifyCallbacks = {
        add: tagAddCallback,
        remove: tagRemoveCallback,
        input: callback,
        edit: callback,
        invalid: tagInvalidCallback,
        click: callback,
        keydown: callback,
        focus: callback,
        blur: callback,
        "edit:input": callback,
        "edit:updated": callback,
        "edit:start": callback,
        "edit:keydown": callback,
        "dropdown:show": callback,
        "dropdown:hide": callback,
        "dropdown:select": callback
    }

    // merged tagify settings (static & dynamic)
    const settings = {
        ...baseTagifySettings,
        ...tagifySettings,
        callbacks: tagifyCallbacks
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (!field.title || !field.description || !field.price || !Files || !BeatTags) {
            return message.error('Fill in everything first.')
        }

        const variables = {
            producer: props.user.userData._id,
            title: field.title,
            description: field.description,
            price: field.price,
            files: Files,
            tags: BeatTags
        }

        Axios.post('/api/beat/uploadBeat', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('Beat successfully uploaded!')
                    props.history.push('/')
                } else {
                    message.error('Failed to upload this beat.')
                }
            });
        return false;
    }

    return (
        <div style={{ margin: '2rem' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Title>Upload a Beat</Title>
                </div>

                <Form>
                    <label>Upload MP3/WAV</label>
                    <FileUpload refreshFunction={updateFiles} />

                    <label>Title</label>
                    <Input style={{ marginBottom: '1em' }} onChange={onChangeHandler} value={field.title} name="title" />

                    <label>Description</label>
                    <TextArea style={{ marginBottom: '1em' }} onChange={onChangeHandler} value={field.description} name="description" />

                    <label>Price (USD)</label>
                    <Input style={{ marginBottom: '1em' }} onChange={onChangeHandler} value={field.price} name="price" type="number" />

                    <label>Tags (max 12)</label>
                    <Tags
                        settings={settings}
                        {...tagifyProps}
                    />

                    <Button style={{ marginTop: '1em' }} type="primary" onClick={onSubmit}>Upload</Button>
                </Form>
            </div>
        </div>
    )
}

export default UploadBeatPage
