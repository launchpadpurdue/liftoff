import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Chip, Divider, Grid, List, makeStyles, Paper, Typography } from '@material-ui/core';

import { Member, skillIcon } from '../../constants';
import MemberCard from './Cards/MemberCard';
import SkeletonCard from './Cards/SkeletonCard';

const profileStyles = makeStyles((theme) => ({
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  image: {
    border: `5px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    objectFit: "contain",
    height: "auto",
    width: "75%",
    [theme.breakpoints.up("sm")]: {
      height: "auto",
      width: "100%",
    },
  },
  name: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  profile: {
    [theme.breakpoints.up("xs")]: {
      marginLeft: theme.spacing(2),
    },
  },
  skill: {
    padding: theme.spacing(1),
  },
}));

const listCardStyles = makeStyles({
  list: {
    overflow: "auto",
  },
});

type ProfileCardProps = {
  profile: Member;
};
function ProfileCard({ profile }: ProfileCardProps) {
  const classes = profileStyles();
  let {
    firstName,
    lastName,
    skills,
    description,
    profilePicture,
    role,
  } = profile;
  if (description === "") description = "User has not added a description yet";
  if (profilePicture === "") profilePicture = "/profile.jpg";

  return (
    <Grid container>
      <Grid item xs={12} sm={3} container alignItems="center" justify="center">
        <img className={classes.image} alt="User" src={profilePicture} />
      </Grid>
      <Grid item className={classes.profile} xs>
        <Typography className={classes.name} variant="h3">
          {`${firstName} ${lastName}`}
        </Typography>
        <Divider className={classes.divider} />
        <Grid item container direction="column" spacing={1}>
          <Grid item container alignItems="center">
            <Typography variant="h6">{role}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Skills</Typography>
            <Grid item container spacing={1}>
              {skills && skills.length ? (
                skills.sort().map((skill) => (
                  <Grid item key={skill}>
                    <Chip
                      className={classes.skill}
                      color="secondary"
                      icon={<FontAwesomeIcon icon={skillIcon(skill)} />}
                      label={skill}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item>
                  <Typography variant="body1">
                    User has not listed any skills yet
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">{description}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

type ListCardProps = {
  list: Array<any>;
  title: string;
  emptyListText: string;
  footer: string;
  renderListItem: Function;
};

function ListCard(props: ListCardProps) {
  const { list = [], title, emptyListText, footer, renderListItem } = props;
  const classes = listCardStyles();
  return (
    <Paper>
      {title && (
        <Fragment>
          <Box py={2} px={4}>
            <Typography variant="h5">{title}</Typography>
          </Box>
          <Divider />
        </Fragment>
      )}

      <Box px={2}>
        {list.length > 0 && (
          <List className={classes.list}>
            {list.map((item: any) => renderListItem(item))}
          </List>
        )}
        {list.length === 0 && (
          <Box py={2}>
            <Typography variant="body1" align="center">
              {emptyListText}
            </Typography>
          </Box>
        )}
      </Box>
      {footer && (
        <Fragment>
          <Divider />
          <Box py={2} display="flex" justifyContent="center">
            {footer}
          </Box>
        </Fragment>
      )}
    </Paper>
  );
}

export { ListCard, MemberCard, ProfileCard, SkeletonCard };
