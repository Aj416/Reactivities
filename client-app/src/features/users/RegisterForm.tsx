import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import { MyTextInput } from "../../app/common/form";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationError from "../errors/ValidationError";

const RegisterForm = () => {
  const { userStore } = useStore();

  const validationScheme = Yup.object({
    userName: Yup.string().required(),
    displayName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  return (
    <Formik
      validationSchema={validationScheme}
      initialValues={{
        userName: "",
        displayName: "",
        email: "",
        password: "",
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            color="teal"
            content="Sign up for Reactivities"
            textAlign="center"
          />
          <MyTextInput placeholder="Display Name" name="displayName" />
          <MyTextInput placeholder="UserName" name="userName" />
          <MyTextInput placeholder="Email" name="email" />
          <MyTextInput placeholder="Password" name="password" type="password" />
          <ErrorMessage
            name="error"
            render={() => <ValidationError errors={errors.error} />}
          />
          <Button
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
            positive
            content="Register"
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
};
export default observer(RegisterForm);
