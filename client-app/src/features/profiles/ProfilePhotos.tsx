import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardGroup,
  Grid,
  GridColumn,
  Header,
  Image,
  TabPane,
} from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

const ProfilePhotos = ({ profile }: Props) => {
  const [target, setTarget] = useState("");
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      uploading,
      setMainPhoto,
      loading,
      deletePhoto,
    },
  } = useStore();

  const [addPhotoMode, setAddPhotoMode] = useState(false);

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  };

  return (
    <TabPane>
      <Grid>
        <GridColumn width={16}>
          <Header icon="image" content="Photos" floated="left" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </GridColumn>
        <GridColumn width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handlePhotoUpload}
              loading={uploading}
            />
          ) : (
            <CardGroup itemsPerRow={5}>
              {profile.photos?.map((photo) => {
                return (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <ButtonGroup fluid widths={2}>
                        <Button
                          basic
                          color="green"
                          content="Main"
                          name={"main" + photo.id}
                          disabled={photo.isMain}
                          loading={target === "main" + photo.id && loading}
                          onClick={(e) => handleSetMainPhoto(photo, e)}
                        />
                        <Button
                          basic
                          color="red"
                          icon="trash"
                          loading={target === photo.id && loading}
                          onClick={(e) => handleDeletePhoto(photo, e)}
                          disabled={photo.isMain}
                          name={photo.id}
                        />
                      </ButtonGroup>
                    )}
                  </Card>
                );
              })}
            </CardGroup>
          )}
        </GridColumn>
      </Grid>
    </TabPane>
  );
};
export default observer(ProfilePhotos);
