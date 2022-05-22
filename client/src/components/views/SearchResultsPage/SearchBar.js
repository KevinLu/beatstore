import React, {useState, useEffect, useCallback} from 'react';
import {
    Icon,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import debounce from '../../utils/debounce';
import {IoMdSearch} from 'react-icons/io';
import {withRouter} from 'react-router-dom';

function SearchBar(props) {
    const [Value, setValue] = useState(props.value);

    const handleChange = (e) => {
        setValue(e.currentTarget.value);
    }

    const handleSearch = (searchTerms) => {
        if (searchTerms) {
            props.history.push(`/beats?search_keyword=${searchTerms}`);
        } else {
            props.history.push(`/beats`);
        }
    }

    const debounceSearch = useCallback(debounce(handleSearch, 600), []);

    useEffect(() => {
        if (props.value !== Value) {
            debounceSearch(Value);
        }
    }, [Value]);

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
                    autoFocus
                    fontWeight="600"
                    id="search"
                    placeholder={props.placeholder}
                    defaultValue={props.value}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-autocomplete="none"
                    type="search" />
            </InputGroup>
        </div>
    )
}

export default withRouter(SearchBar)
