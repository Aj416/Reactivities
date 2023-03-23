import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { MyTextArea, MyTextInput } from "../../app/common/form";
import { Button } from "semantic-ui-react";

interface Props {
  setEditProfileMode: (editProfileMode: boolean) => void;
}

const ProfileEditForm = ({ setEditProfileMode }: Props) => {
  const {
    profileStore: { updateProfile, profile },
  } = useStore();

  const validationScheme = Yup.object({
    displayName: Yup.string().required("display name is required"),
  });

  return (
    <Formik
      validationSchema={validationScheme}
      initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
      onSubmit={(values) =>
        updateProfile(values).then(() => setEditProfileMode(false))
      }
    >
      {({ isValid, isSubmitting, dirty }) => (
        <Form className="ui form">
          <MyTextInput placeholder="Display Name" name="displayName" />
          <MyTextArea rows={3} placeholder="Add ypur bio" name="bio" />
          <Button
            positive
            loading={isSubmitting}
            disabled={!isValid || !dirty}
            floated="right"
            type="submit"
            content="Update Profile"
          />
        </Form>
      )}
    </Formik>
  );
};
export default ProfileEditForm;
