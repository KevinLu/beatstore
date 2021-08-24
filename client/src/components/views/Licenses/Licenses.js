import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getEnabledLicenses} from '../../../_actions/license_actions';
import {
  Text,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import LicenseCard from './LicenseCard';

function Licenses() {
  const dispatch = useDispatch();
  const licenses = useSelector(state => state.license.publicLicenses);

  useEffect(() => {
    dispatch(getEnabledLicenses());
  }, []);

  if (licenses == null) {
    return null;
  }

  return (
    <>
      <Heading size="lg" textAlign="center" mb={8}>Licensing Info</Heading>
      <SimpleGrid minChildWidth="200px" spacing={8}>
        {licenses.map(lic => <LicenseCard license={lic} />)}
      </SimpleGrid>
    </>
  );
}

export default Licenses;
