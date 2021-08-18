import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  HStack,
  Switch,
  SimpleGrid,
} from '@chakra-ui/react';

function EditLicense(props) {
  const {isOpen, onClose, license} = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" closeOnEsc={false} closeOnOverlayClick={false} size="6xl">
      <ModalOverlay />
      {license == null ? <>Loading..</> :
        <ModalContent>
          <ModalHeader>Edit License</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} spacing={4}>
              <FormControl id="name">
                <FormLabel>License Name</FormLabel>
                <Input defaultValue={license.name} />
              </FormControl>
              <SimpleGrid columns={[1, null, 2]} spacing={4}>
                <FormControl id="price">
                  <FormLabel>Default price</FormLabel>
                  <NumberInput defaultValue={license.price} precision={2} step={0.01} min={1} max={10000}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Prices are in <b>USD</b></FormHelperText>
                </FormControl>
                <FormControl id="min_offer_price">
                  <FormLabel>Minimum offer price</FormLabel>
                  <NumberInput defaultValue={license.min_offer_price} precision={2} step={0.01} min={0} max={10000}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>0</b> to disable offers</FormHelperText>
                </FormControl>
              </SimpleGrid>

              <FormControl as="fieldset" id="files_included">
                <FormLabel as="legend">Files included</FormLabel>
                <CheckboxGroup defaultValue={[license.included_mp3 && "included_mp3", license.mp3_untagged && "mp3_untagged",
                license.included_wav && "included_wav", license.included_stems && "included_stems"]}>
                  <HStack>
                    <Checkbox value="included_mp3" isDisabled>MP3 Tagged</Checkbox>
                    <Checkbox value="mp3_untagged">MP3 Untagged</Checkbox>
                    <Checkbox value="included_wav">WAV</Checkbox>
                    <Checkbox value="included_stems">Stems</Checkbox>
                  </HStack>
                </CheckboxGroup>
              </FormControl>
              <SimpleGrid columns={[1, null, 2]} spacing={4}>
                <FormControl id="audio_streams">
                  <FormLabel>Audio streams</FormLabel>
                  <NumberInput defaultValue={license.audio_streams} step={1000} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl id="distribution_copies">
                  <FormLabel>Distribution copies</FormLabel>
                  <NumberInput defaultValue={license.distribution_copies} step={1000} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl id="free_downloads">
                  <FormLabel>Free downloads</FormLabel>
                  <NumberInput defaultValue={license.free_downloads} step={1000} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl id="music_videos">
                  <FormLabel>Music videos</FormLabel>
                  <NumberInput defaultValue={license.music_videos} step={1000} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl id="music_video_streams">
                  <FormLabel>Music video streams</FormLabel>
                  <NumberInput defaultValue={license.music_video_streams} step={1000} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl id="radio_stations">
                  <FormLabel>Radio stations</FormLabel>
                  <NumberInput defaultValue={license.radio_stations} step={10} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl id="non_profit_performances">
                  <FormLabel>Number of not for profit performances</FormLabel>
                  <NumberInput defaultValue={license.non_profit_performances} step={1000} min={-1} max={99999999}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel id="allow_for_profit_performances_label" htmlFor="allow_for_profit_performances" mb="0">
                    Allow for profit performances?
                  </FormLabel>
                  <Switch
                    aria-label="Allow for profit performances toggle"
                    aria-labelledby="allow_for_profit_performances_label"
                    id="allow_for_profit_performances"
                    defaultValue={license.allow_for_profit_performances} />
                </FormControl>

              </SimpleGrid>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      }
    </Modal>
  );
}

export default EditLicense;
