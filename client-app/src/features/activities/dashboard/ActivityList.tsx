import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

const ActivityList = () => {
  const [target, setTarget] = useState("");
  const {
    activityStore: { selectActivity, activities, loading, deleteActivity },
  } = useStore();

  const handleDeleteActivity = (id: string) => {
    setTarget(id);
    deleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group divided>
        {activities.map((activity) => {
          return (
            <Item key={activity.id}>
              <Item.Content>
                <Item.Header as="a">{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                  <div>{activity.description}</div>
                  <div>
                    {activity.city}, {activity.venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Button
                    floated="right"
                    content="View"
                    color="blue"
                    onClick={() => selectActivity(activity.id)}
                  />
                  <Button
                    floated="right"
                    content="Delete"
                    color="red"
                    onClick={() => handleDeleteActivity(activity.id)}
                    loading={loading && target === activity.id}
                  />
                  <Label basic content={activity.category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Segment>
  );
};
export default observer(ActivityList);
