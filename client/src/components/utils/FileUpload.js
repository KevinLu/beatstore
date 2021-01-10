import React, {useState, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import {useToast, Box, Flex, Text, Tag, TagLabel, TagCloseButton, CircularProgress} from "@chakra-ui/react";
import Axios from 'axios';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '1em',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#636363',
    borderStyle: 'dashed',
    backgroundColor: '#F7FAFC',
    color: '#262626',
    outline: 'none',
    transition: 'backgroundColor .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#ffffff',
    backgroundColor: '#63b3ed'
};

const acceptStyle = {
    borderColor: '#ffffff',
    backgroundColor: '#68d391'
};

const rejectStyle = {
    borderColor: '#ffffff',
    backgroundColor: '#fc8181'
};

function FileUpload(props) {
    const uploadUrl = props.public ? '/api/beat/uploadPublicFile' : '/api/beat/uploadPrivateFile';

    const toast = useToast();

    // Files state for use within FileUpload component ONLY
    // Stores objects with name and location keys
    const [Files, setFiles] = useState([]);
    const [IsUploading, setIsUploading] = useState(false);

    const onDrop = (files) => {
        console.log(files);
        setIsUploading(true);
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]);
        Axios.post(uploadUrl, formData, config)
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    setFiles([...Files, response.data.file]);
                    props.setFileState([...props.fileState, response.data.file.location]);
                    toast({
                        position: "bottom",
                        title: "File uploaded.",
                        description: "Beat file successfully uploaded.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        position: "bottom",
                        title: "Error uploading file.",
                        description: "Check the file type.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
                setIsUploading(false);
            });
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: props.accept,
        maxFiles: props.maxFiles,
        multiple: props.multiple,
        disabled: Files.length >= 1
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragAccept,
        isDragReject
    ]);

    const onDelete = (file) => {
        props.setFileState(props.fileState.filter(item => item !== file.location));
        setFiles(Files.filter(item => item.name !== file.name));
        toast({
            position: "bottom",
            title: "File removed.",
            duration: 2000,
            isClosable: true
        });
    }

    return (
        <Flex>
            <Flex flexWrap="wrap" flexDirection="column">
                <div className="container">
                    <div {...getRootProps({style})}>
                        {IsUploading ?
                            <CircularProgress isIndeterminate={IsUploading} />
                            :
                            <Flex justifyContent="center" flexDirection="column" alignItems="center">
                                <Box boxSize="25px" as={props.icon} />
                                <Text>{Files.length >= 1 ? "File selected." : "Drag your file here, or click to select."}</Text>
                                <input {...getInputProps()} />
                            </Flex>}
                    </div>
                </div>
                <Box>
                    {Files.map((file, index) => (
                        <div key={index} style={{marginLeft: 'auto', marginBottom: '3px'}}>
                            <Tag
                                size="md"
                                key={index}
                                variant="solid"
                                colorScheme="blue"
                            >
                                <TagLabel>{file.name}</TagLabel>
                                <TagCloseButton onClick={() => onDelete(file)} />
                            </Tag>
                        </div>
                    ))}
                </Box>
            </Flex>
        </Flex>
    );
}

export default FileUpload;
