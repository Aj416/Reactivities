import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";

const ProfileAbout = () => {
  const [editProfileMode, setEditProfileMode] = useState(false);
  const {
    profileStore: { isCurrentUser, profile },
  } = useStore();
  return (
    <TabPane>
      <Grid>
        <GridColumn width={16}>
          <Header
            icon="user"
            content={`About ${profile?.displayName}`}
            floated="left"
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </GridColumn>
        <GridColumn width={16}>
          {editProfileMode ? (
            <ProfileEditForm setEditProfileMode={setEditProfileMode} />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{profile?.bio}</span>
          )}
        </GridColumn>
      </Grid>
    </TabPane>
  );
};
export default observer(ProfileAbout);
