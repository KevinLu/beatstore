import React, { useState, useMemo, useCallback } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import { Icon, message, Row, Col } from 'antd';
import { FaTrash } from 'react-icons/fa';
import Axios from 'axios';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '1em',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#636363',
    borderStyle: 'dashed',
    backgroundColor: '#f0f0f0',
    color: '#262626',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function AudioUpload(props) {

    const [Files, setFiles] = useState([])
    
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);
        Axios.post('/api/beat/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {
                    setFiles([...Files, response.data.file])
                    props.refreshFunction([...Files, response.data.file])
                    message
                        .loading('Uploading...', 1)
                        .then(() => message.success('File uploaded', 2.5));
                } else {
                    message.error('Ran into an error uploading that file, check the file type.')
                }
            });
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({ onDrop, accept: 'audio/*' });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    const onDelete = (file) => {
        const currentIndex = Files.indexOf(file)
        let newFiles = [...Files]
        newFiles.splice(currentIndex, 1)
        setFiles(newFiles)
        props.refreshFunction(newFiles)
        message.success('File removed successfully.')
    }

    return (
        <Row>
            <Col span={12}>
                <div className="container">
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drag your beats here, or click to select.</p>
                    </div>
                </div>
            </Col>

            <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column', float: 'right' }}>
                    {Files.map((file, index) => (
                        <div key={index} style={{ display: 'flex', border: '1px solid lightgray', flexDirection: 'row', float: 'right' }}>
                            <div style={{ marginRight: '1em' }}>
                                {file.substring(28)}
                            </div>
                            <FaTrash onClick={onDelete} style={{ marginTop: '0.25em', color: '#ff3b3b', cursor: 'pointer' }} />
                        </div>
                    ))}
                </div>
            </Col>
        </Row>
    )
}

export default AudioUpload
