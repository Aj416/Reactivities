import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Icon,
  Image,
} from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import FollowButton from "./FollowButton";

interface Props {
  profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
  const truncate = (str: string | undefined) => {
    if (str) {
      return str.length > 40 ? str.substring(0, 37) + "..." : str;
    }
  };

  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.image || "/assets/user.png"} />
      <CardContent>
        <CardHeader>{profile.displayName}</CardHeader>
        <CardDescription>{truncate(profile.bio)}</CardDescription>
      </CardContent>
      <CardContent extra>
        <Icon name="user" />
        {profile.followersCount}{" "}
        {profile.followersCount > 1 ? "followers" : "follower"}
      </CardContent>
      <FollowButton profile={profile} />
    </Card>
  );
};
export default ProfileCard;
