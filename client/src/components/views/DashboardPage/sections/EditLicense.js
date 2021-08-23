import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {updateLicense} from '../../../../_actions/license_actions';
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
  HStack,
  Switch,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import {useForm, Controller} from "react-hook-form";

const fileTypes = [{file: "included_mp3", text: "MP3 (tagged)"},
{file: "mp3_untagged", text: "MP3 (untagged)"},
{file: "included_wav", text: "WAV"},
{file: "included_stems", text: "Stems"}];

function EditLicense(props) {
  const {isOpen, onClose, license} = props;
  const {
    handleSubmit,
    control,
    register,
    formState: {errors, isSubmitting},
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    reset(null);
  }, [isOpen]);

  function onSubmit(values) {
    return new Promise((resolve) => {
      dispatch(updateLicense(license._id, values))
        .then(res => {
          if (res.payload.success) {
            resolve();
            onClose();
          } else {
            throw Error("Encountered an error while updating license!");
          }
        })
        .catch(err => {
          toast({
            title: "Could not update license.",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        })
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit License</ModalHeader>
        <ModalCloseButton />
        {license == null ? <>Loading..</> :
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <SimpleGrid columns={1} spacing={4}>
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="name">License Name</FormLabel>
                  <Input id="name" defaultValue={license.name} {...register("name", {
                    required: "License name is required",
                  })} />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  <FormControl isInvalid={errors.price}>
                    <FormLabel htmlFor="price">Default price</FormLabel>
                    <Controller
                      control={control}
                      name="price"
                      defaultValue={license.price}
                      render={({field: {onChange, value, ref}}) => (
                        <NumberInput id="price"
                          onChange={onChange}
                          ref={ref}
                          value={value}
                          precision={2}
                          step={0.01}
                          min={1}
                          max={999999}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )} />
                    <FormErrorMessage>
                      {errors.price && errors.price.message}
                    </FormErrorMessage>
                    <FormHelperText>Prices are in <b>USD</b></FormHelperText>
                  </FormControl>
                  <FormControl isInvalid={errors.min_offer_price}>
                    <FormLabel htmlFor="min_offer_price">Minimum offer price</FormLabel>
                    <Controller
                      control={control}
                      name="min_offer_price"
                      defaultValue={license.min_offer_price}
                      render={({field: {onChange, value, ref}}) => (
                        <NumberInput id="min_offer_price"
                          onChange={onChange}
                          ref={ref}
                          value={value}
                          precision={2}
                          step={0.01}
                          min={1}
                          max={999999}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )} />
                    <FormErrorMessage>
                      {errors.min_offer_price && errors.min_offer_price.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>0</b> to disable offers</FormHelperText>
                  </FormControl>
                </SimpleGrid>

                <FormControl id="files_included" as="fieldset">
                  <FormLabel as="legend">Files included</FormLabel>
                  <HStack>
                    {fileTypes.map(({file, text}) => (
                      <Controller
                        control={control}
                        name={file}
                        key={file}
                        defaultValue={license[file]}
                        render={({field: {onChange, value, ref}}) => (
                          <Checkbox
                            onChange={onChange}
                            ref={ref}
                            isChecked={value}
                            isDisabled={file === 'included_mp3' ? true : false}>
                            {text}
                          </Checkbox>
                        )} />
                    ))}
                  </HStack>
                </FormControl>
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  <FormControl isInvalid={errors.audio_streams}>
                    <FormLabel htmlFor="audio_streams">Audio streams</FormLabel>
                    <NumberInput id="audio_streams" defaultValue={license.audio_streams} step={1000} min={-1} max={99999999}>
                      <NumberInputField {...register("audio_streams", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.audio_streams && errors.audio_streams.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.distribution_copies}>
                    <FormLabel htmlFor="distribution_copies">Distribution copies</FormLabel>
                    <NumberInput id="distribution_copies" defaultValue={license.distribution_copies} step={1000} min={-1} max={99999999}>
                      <NumberInputField {...register("distribution_copies", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.distribution_copies && errors.distribution_copies.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.free_downloads}>
                    <FormLabel htmlFor="free_downloads">Free downloads</FormLabel>
                    <NumberInput id="free_downloads" defaultValue={license.free_downloads} step={1000} min={-1} max={99999999}>
                      <NumberInputField {...register("free_downloads", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.free_downloads && errors.free_downloads.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.music_videos}>
                    <FormLabel htmlFor="music_videos">Music videos</FormLabel>
                    <NumberInput id="music_videos" defaultValue={license.music_videos} step={1000} min={-1} max={99999999}>
                      <NumberInputField {...register("music_videos", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.music_videos && errors.music_videos.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.music_video_streams}>
                    <FormLabel htmlFor="music_video_streams">Music video streams</FormLabel>
                    <NumberInput id="music_video_streams" defaultValue={license.music_video_streams} step={1000} min={-1} max={99999999}>
                      <NumberInputField {...register("music_video_streams", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.music_video_streams && errors.music_video_streams.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.radio_stations}>
                    <FormLabel htmlFor="radio_stations">Radio stations</FormLabel>
                    <NumberInput id="radio_stations" defaultValue={license.radio_stations} step={10} min={-1} max={99999999}>
                      <NumberInputField {...register("radio_stations", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.radio_stations && errors.radio_stations.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={errors.non_profit_performances}>
                    <FormLabel htmlFor="non_profit_performances">Number of not for profit performances</FormLabel>
                    <NumberInput id="non_profit_performances" defaultValue={license.non_profit_performances} step={1000} min={-1} max={99999999}>
                      <NumberInputField {...register("non_profit_performances", {
                        required: "Cannot be blank",
                      })} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.non_profit_performances && errors.non_profit_performances.message}
                    </FormErrorMessage>
                    <FormHelperText>Enter <b>-1</b> for unlimited</FormHelperText>
                  </FormControl>

                  <FormControl display="flex" alignItems="center" isInvalid={errors.allow_for_profit_performances}>
                    <FormLabel id="allow_for_profit_performances_label" htmlFor="allow_for_profit_performances" mb="0">
                      Allow for profit performances?
                    </FormLabel>
                    <Switch
                      {...register("allow_for_profit_performances")}
                      aria-label="Allow for profit performances toggle"
                      aria-labelledby="allow_for_profit_performances_label"
                      id="allow_for_profit_performances"
                      defaultChecked={license.allow_for_profit_performances} />
                  </FormControl>

                </SimpleGrid>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} isLoading={isSubmitting} type="submit">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        }
      </ModalContent>

    </Modal>
  );
}

export default EditLicense;
