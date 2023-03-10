import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";

const initialState: Activity = {
  id: "",
  title: "",
  category: "",
  description: "",
  date: "",
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

  useEffect(() => {
    if (id) {
      getActivity(id).then((result) => setActivity(result ?? initialState));
    }
  }, [id, getActivity]);

  if (initialLoading) {
    return <LoadingComponent content="Loading activity..." />;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const handleInputChange = (
    ev: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = ev.target;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          name="title"
          value={activity.title}
          onChange={(e) => handleInputChange(e)}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={(e) => handleInputChange(e)}
        />
        <Form.Input
          placeholder="Category"
          name="category"
          value={activity.category}
          onChange={(e) => handleInputChange(e)}
        />
        <Form.Input
          type="date"
          placeholder="Date"
          name="date"
          value={activity.date}
          onChange={(e) => handleInputChange(e)}
        />
        <Form.Input
          placeholder="City"
          name="city"
          value={activity.city}
          onChange={(e) => handleInputChange(e)}
        />
        <Form.Input
          placeholder="Venue"
          name="venue"
          value={activity.venue}
          onChange={(e) => handleInputChange(e)}
        />
        <Button
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
    </Segment>
  );
};
export default observer(ActivityForm);
