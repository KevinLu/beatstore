import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Checkbox,
  Box,
  Heading,
  useToast
} from "@chakra-ui/core";
import { useDispatch } from "react-redux";

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const toast = useToast();

  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  return (
    <Formik
      initialValues={{ email: initialEmail, password: '' }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .required('Password is required'),
      })}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              console.log(response)
              if (response.payload.loginSuccess) {
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.email);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/");
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
            .catch(err => {
              toast({
                position: "bottom",
                title: "Can't login!",
                description: "Server error while logging in. Try again later.",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            });
          actions.setSubmitting(false);
        }, 500);
      }}
    >
      {props => (
        <Box w="350px" display="flex" margin="auto" flexDirection="column">
          <Box display="flex" justifyContent="center" mt={200} mb={5}>
            <Heading>Login</Heading>
          </Box>
          <form onSubmit={props.handleSubmit}>
            <Field name="email">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.email && form.touched.email}>
                  <FormLabel htmlFor="email">E-mail</FormLabel>
                  <Input {...field} id="email" placeholder="E-mail address" />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.password && form.touched.password}>
                  <FormLabel htmlFor="email">Password</FormLabel>
                  <Input {...field} id="email" placeholder="Password" type="password" />
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box mt={2}>
              <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember e-mail</Checkbox>
            </Box>
            <Box mb={300} mt={3}>
              <Button
                variantColor="blue"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Log in
          </Button>
            </Box>
          </form>
        </Box>
      )}
    </Formik>
  );
};

export default withRouter(LoginPage);
