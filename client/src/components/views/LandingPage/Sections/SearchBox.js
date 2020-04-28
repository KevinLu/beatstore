import React from 'react'
import {
    Icon,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/core";

function SearchBox(props) {
    return (
        <div>
            <InputGroup>
                <InputLeftElement children={<Icon name="search" color="gray.300" />} />
                <Input id="search" placeholder={props.placeholder} />
            </InputGroup>
        </div>
    )
}

export default SearchBox
