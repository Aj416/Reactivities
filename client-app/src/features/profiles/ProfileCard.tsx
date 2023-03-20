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

interface Props {
  profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.image || "/assets/user.png"} />
      <CardContent>
        <CardHeader>{profile.displayName}</CardHeader>
        <CardDescription>Bio goes here</CardDescription>
      </CardContent>
      <CardContent extra>
        <Icon name="user" />
        20 followers
      </CardContent>
    </Card>
  );
};
export default ProfileCard;
