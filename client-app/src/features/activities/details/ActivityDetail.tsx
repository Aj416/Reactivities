import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

const ActivityDetail = () => {
  const { id } = useParams();
  const {
    activityStore: { selectedActivity: activity, initialLoading, loadActivity },
  } = useStore();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }
  }, [id, loadActivity]);

  if (initialLoading || !activity) return <LoadingComponent />;

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button
            basic
            color="blue"
            content="Edit"
            as={Link}
            to={`/manage/${activity.id}`}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            as={Link}
            to="/activities"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};
export default observer(ActivityDetail);
