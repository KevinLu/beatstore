import React, {useState, useEffect} from 'react';
import {
    Icon,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import {IoMdSearch} from 'react-icons/io';
import {withRouter} from 'react-router-dom';

function SearchBar(props) {
    const [Value, setValue] = useState("");

    const handleChange = (event) => {
        setValue(event.currentTarget.value);
    }

    const handleSearch = (searchTerms) => {
        if (searchTerms) {
            props.history.push(`/beats?search_keyword=${searchTerms}`);
        } else {
            props.history.push(`/beats`);
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (Value !== props.value) {
                handleSearch(Value);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [Value]);

    useEffect(() => {
        if (props.value && props.value !== "") {
            setValue(props.value);
        }
    }, [props.value]);

    return (
        <div>
            <InputGroup size="lg">
                <InputLeftElement
                    fontSize="1.75em"
                    pointerEvents="none"
                    children={<Icon as={IoMdSearch}
                        color="gray.300" />}
                />
                <Input
                    color="black"
                    fontWeight="600"
                    id="search"
                    placeholder={props.placeholder}
                    value={Value}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-autocomplete="none"
                    type="search" />
            </InputGroup>
        </div>
    )
}

export default withRouter(SearchBar)
