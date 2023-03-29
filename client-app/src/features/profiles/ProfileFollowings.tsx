import { observer } from "mobx-react-lite";
import {
  CardGroup,
  Grid,
  GridColumn,
  Header,
  TabPane,
} from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

const ProfileFollowings = () => {
  const {
    profileStore: { profile, followings, loadingFollowings, activeTab },
  } = useStore();

  return (
    <TabPane loading={loadingFollowings}>
      <Grid>
        <GridColumn width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === 3
                ? `People following ${profile?.displayName}`
                : `People ${profile?.displayName} is following`
            }
          />
        </GridColumn>
        <GridColumn width={16}>
          <CardGroup itemsPerRow={4}>
            {followings.map((pro) => {
              return <ProfileCard key={pro.userName} profile={pro} />;
            })}
          </CardGroup>
        </GridColumn>
      </Grid>
    </TabPane>
  );
};
export default observer(ProfileFollowings);
