import { useEffect, useState } from "react";
import { Checkbox, CircularProgress, FormControlLabel, LinearProgress, Stack, Switch, Typography } from "@mui/material";
import CrewCard from "./crewcard";
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Disclaimer from "./Disclaimer";
import { useAuth0 } from "@auth0/auth0-react";

const mutations: Record<string, DocumentNode> = {
  'skipper': gql`
mutation sp($id: Int!, $profile: ProfileInput!) {
  addSkipperProfile(id: $id, profile: $profile) { ok member { id skipper { text published pictures } } }
}`,
  'crewing': gql`
mutation crewProfileMutation($id: Int!, $profile: ProfileInput!) {
  addCrewingProfile(id: $id, profile: $profile) { ok member { id crewing { text published pictures } } }
}`
};

const MEMBER_QUERY = gql(`query members($id: Int!) {
  members(id: $id) {
    firstname lastname email
    skipper { text published pictures }
    crewing { text published pictures }
  }
}`);

export default function Profile({ profileName }) {
  const { user } = useAuth0();
  const id = user?.['https://oga.org.uk/id'];
  const [profile, setProfile] = useState({ pictures: [], published: false, text: '' });
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState();
  const [oldEnough, setOldEnough] = useState(false);
  const { loading, data, refetch } = useQuery(MEMBER_QUERY, { variables: { id } });
  const [addProfile] = useMutation(mutations[profileName]);
  const [dirty, setDirty] = useState(false);

  function addPicture(url) {
    // 'addPicture', url);
    let p: string[] = [];
    if (profile?.pictures) {
      p = [...profile.pictures];
    }
    p.unshift(url);
    setProfile({ ...profile, pictures: p });
  }

  useEffect(() => {
    if (dirty) {
      const { __typename, ...p } = profile; // TODO use removeTypenameFromVariables
      setSaving(true);
      const r = addProfile({ variables: { id, profile: p } });
      r.then(() => {
        setSaving(false);
        setDirty(false);
        refetch(); // this is needed or Apollo will reload us with the old cached values when we switch tabs and bac
      });
    }
  }, [profile, dirty]);

  function handleChangeText(newText: string) {
    // console.log('handleChangeText', newText);
    setProfile({ ...profile, text: newText });
    setDirty(true);
  }

  function handleAddImage(url) {
    // console.log('handleAddImage', url);
    addPicture(url);
    setDirty(true);
  }

  function handleDeleteImage() {
    setProfile({ ...profile, pictures: [] }); // TODO handle multiple images
    setDirty(true);
  }

  function handleUseAvatar(useAvatar) {
    // console.log('handleUseAvatar', useAvatar);
    if (user?.picture) { // we have an avatar
      if (useAvatar) { // we want to use it
        if (profile?.pictures) {
          if (profile.pictures.includes(user.picture)) { // we are using it
            // console.log('already using avatar');
          } else { // add it
            setProfile({ ...profile, pictures: [user.picture, ...profile.pictures] });
            setDirty(true);
          }
        } else { // no pictures, add it
          setProfile({ ...profile, pictures: [user.picture] });
          setDirty(true);
        }
      } else { // we don't want to use it
        if (profile?.pictures?.includes(user.picture)) { // we are using it, remove it
          const p = (profile.pictures ?? []).filter((p) => p !== user.picture);
          setProfile({ ...profile, pictures: p });
          setDirty(true);
        }
      }
    }
  }

  function handleChangePublishState(published) {
    setProfile({ ...profile, published });
    setDirty(true);
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (data && !member) {
    const m = data.members[0];
    setMember(m);
    const p = (profileName == 'skipper') ? m.skipper : m.crewing;
    if (JSON.stringify(p) !== JSON.stringify(profile)) {
      setProfile(p);
    }
  }

  return <>
    <Typography>This is your {profileName} profile card</Typography>
    <Stack direction='row' spacing={2} >
      <CrewCard
        name={`${member?.firstname} ${member?.lastname}`}
        goldId={id}
        email={member?.email ?? ''}
        profile={profile}
        editEnabled={true}
        onChangeText={handleChangeText}
        onAddImage={handleAddImage}
        onDeleteImage={handleDeleteImage}
        onUseAvatar={(value: boolean) => handleUseAvatar(value)}
      />
      <Stack>
        <Typography>You can customise your card with an optional picture and your choice of text.</Typography>
        <Typography>
          Your profile can be saved but won't be visible until it is published.
        </Typography>
        <Typography>
          Once you've got a picture, if you want to delete or change it, just click on the
          rubbish bin.
        </Typography>
        <Typography>Edit the text by clicking on the edit button above the text. Save the changes or cancel using the tick and cross
          buttons that appear during editing.</Typography>
        <Disclaimer border={1} marginTop={1} />
        <FormControlLabel
          control={<Checkbox
            checked={oldEnough}
            onChange={(e) => setOldEnough(e.target.checked)}
          />}
          label="I confirm I am over 18 years old"
        />
        <FormControlLabel
          disabled={!(profile?.published) && !oldEnough}
          control={<Switch checked={profile?.published}
          onChange={(e) => handleChangePublishState(e.target.checked)} />}
          label="Published"
        />
      </Stack>
    </Stack>
    {saving ? <LinearProgress /> : ''}
  </>;
}