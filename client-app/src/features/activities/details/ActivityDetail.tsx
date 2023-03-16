import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import {
  ActivityDetailedChat,
  ActivityDetailedHeader,
  ActivityDetailedInfo,
  ActivityDetailedSidebar,
} from ".";
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

  if (initialLoading || !activity)
    return <LoadingComponent content="Loading activity ..." />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};
export default observer(ActivityDetail);
