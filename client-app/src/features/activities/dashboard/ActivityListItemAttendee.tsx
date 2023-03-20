import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Image, List, ListItem, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

const ActivityListItemAttendee = ({ attendees }: Props) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => {
        return (
          <Popup
            hoverable
            key={attendee.userName}
            trigger={
              <ListItem
                key={attendee.userName}
                as={Link}
                to={`/profiles/${attendee.userName}`}
              >
                <Image
                  size="mini"
                  circular
                  src={attendee.image || "/assets/user.png"}
                />
              </ListItem>
            }
          >
            <PopupContent>
              <ProfileCard profile={attendee} />
            </PopupContent>
          </Popup>
        );
      })}
    </List>
  );
};
export default observer(ActivityListItemAttendee);
