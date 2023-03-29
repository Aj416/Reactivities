import { observer } from "mobx-react-lite";
import { Button, Reveal, RevealContent } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

const FollowButton = ({ profile }: Props) => {
  const {
    profileStore: { updateFollowing, loading },
    userStore,
  } = useStore();

  if (userStore.user?.userName === profile.userName) return null;

  const handleFollow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    username: string
  ) => {
    e.preventDefault();

    updateFollowing(username);
  };

  return (
    <Reveal animated="move">
      <RevealContent visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not Following"}
        />
      </RevealContent>
      <RevealContent hidden style={{ width: "100%" }}>
        <Button
          fluid
          basic
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={loading}
          onClick={(e) => handleFollow(e, profile.userName)}
        />
      </RevealContent>
    </Reveal>
  );
};
export default observer(FollowButton);
