import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

const ActivityDashboard = () => {
  const {
    activityStore: { selectedActivity, editMode },
  } = useStore();

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && <ActivityDetail />}
        {editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
};
export default observer(ActivityDashboard);
