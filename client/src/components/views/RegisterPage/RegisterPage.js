import React from "react";
import moment from "moment";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Box,
  Heading,
  useToast
} from "@chakra-ui/core";

function RegisterPage(props) {
  const dispatch = useDispatch();
  const toast = useToast();

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required('Please enter a username'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Please enter an e-mail'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Please enter a password'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Please type your password again')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          var cleanEmail = values.email;
          cleanEmail.trim();
          cleanEmail.toLowerCase();
          let dataToSubmit = {
            username: values.username,
            email: values.email,
            password: values.password,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };

          dispatch(registerUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
              props.history.push("/login");
              toast({
                position: "bottom",
                title: "Thanks for signing up!",
                description: "You can login now :)",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            } else {
              toast({
                position: "bottom",
                title: "Can't login!",
                description: "Incorrect e-mail or password.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          })
          setSubmitting(false);
        }, 500);
      }}
    >
      {props => (
        <Box w="350px" display="flex" margin="auto" flexDirection="column">
          <Box display="flex" justifyContent="center" mt={10} mb={5}>
            <Heading>Sign up</Heading>
          </Box>
          <form onSubmit={props.handleSubmit}>
            <Box mt={5}>
              <Field name="username">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.username && form.touched.username}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input {...field} id="username" placeholder="Set a username for your profile" />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={5}>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <Input {...field} id="email" placeholder="Enter your e-mail" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={5}>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input {...field} id="password" placeholder="Set your password" type="password" />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={5}>
              <Field name="confirmPassword">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                    <Input {...field} id="confirmPassword" placeholder="Type your password again" type="password" />
                    <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={5}>
              <Button
                width="100%"
                variantColor="blue"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Sign up
          </Button>
            </Box>
            <Box display="flex" fontSize="md" mt={5} mb={10} justifyContent="center">
              <Text mr={2}>
                Have an account?
              </Text>
              <Text fontWeight="600">
                <Link to="/login">Sign in</Link>
              </Text>
            </Box>
          </form>
        </Box>
      )}
    </Formik>
  );
};

export default RegisterPage
