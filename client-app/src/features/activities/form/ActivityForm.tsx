import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import {
  MyDateInput,
  MySelectInput,
  MyTextArea,
  MyTextInput,
} from "../../../app/common/form";
import { v4 as uuid } from "uuid";

const initialState: Activity = {
  id: "",
  title: "",
  category: "",
  description: "",
  date: null,
  city: "",
  venue: "",
};

const ActivityForm = () => {
  const [activity, setActivity] = useState<Activity>(initialState);
  const { id } = useParams();
  const {
    activityStore: {
      getActivity,
      initialLoading,
      loading,
      createActivity,
      updateActivity,
    },
  } = useStore();

  const navigate = useNavigate();

  const validationScheme = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    category: Yup.string().required("Category is required"),
    date: Yup.string().required("Date is required"),
    city: Yup.string().required(),
    venue: Yup.string().required(),
  });

  useEffect(() => {
    if (id) {
      getActivity(id).then((result) => setActivity(result ?? initialState));
    }
  }, [id, getActivity]);

  if (initialLoading) {
    return <LoadingComponent content="Loading activity..." />;
  }

  const handleFormSubmit = (activity: Activity) => {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    }
  };

  return (
    <Segment clearing>
      <Header color="teal" sub content="Activity Details" />
      <Formik
        initialValues={activity}
        validationSchema={validationScheme}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title" />
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header color="teal" sub content="Location Details" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              floated="right"
              positive
              type="submit"
              content="Submit"
              loading={loading}
            />
            <Button
              floated="right"
              type="button"
              content="Cancel"
              as={Link}
              to="/activities"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
