import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
  Paper,
  Box,
  List
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import React, { Fragment, FunctionComponent } from "react";

import { Link } from "react-router-dom";

import { skillIcon, Member, FixMeLater } from "../../constants";

const cardStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "100%" // 1:1
  },
  cardContent: {
    flexGrow: 1
  },
  chipLabel: { paddingRight: 0 },
  chipRoot: { maxHeight: 32 }
}));

const profileStyles = makeStyles(theme => ({
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  image: {
    border: `5px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    objectFit: "contain",
    height: "auto",
    width: "75%",
    [theme.breakpoints.up("sm")]: {
      height: "auto",
      width: "100%"
    }
  },
  name: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  profile: {
    [theme.breakpoints.up("xs")]: {
      marginLeft: theme.spacing(2)
    }
  },
  skill: {
    padding: theme.spacing(1)
  }
}));

const listCardStyles = makeStyles(theme => ({
  list: {
    overflow: "auto"
  }
}));

type MemberCardProps = {
  member: Member;
};
const MemberCard: FunctionComponent<MemberCardProps> = ({ member }) => {
  const classes = cardStyles();
  const { firstName, lastName, profilePicture, skills, id } = member;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={profilePicture}
          title={`${firstName} ${lastName} Picture`}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom component="h2" variant="h5">
            {`${firstName} ${lastName}`}
          </Typography>
          <Grid container spacing={1}>
            {skills.sort().map(skill => (
              <Grid item key={skill}>
                <Tooltip arrow title={skill}>
                  <Chip
                    color="secondary"
                    classes={{
                      label: classes.chipLabel,
                      root: classes.chipRoot
                    }}
                    icon={
                      <FontAwesomeIcon
                        fixedWidth
                        icon={skillIcon(skill)}
                        size="lg"
                      />
                    }
                  ></Chip>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            size="small"
            component={Link}
            to={`/profile/${id}`}
          >
            View Profile
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

type ProfileCardProps = {
  profile: Member;
};
const ProfileCard: FunctionComponent<ProfileCardProps> = ({ profile }) => {
  const classes = profileStyles();
  let {
    firstName,
    lastName,
    skills,
    description,
    profilePicture,
    role
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
                skills.sort().map(skill => (
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
};

function SkeletonCard() {
  const classes = cardStyles();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <Skeleton className={classes.cardMedia} variant="rect" />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom component="h2" variant="h5">
            <Skeleton animation="wave" variant="text" />
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Skeleton
                width={32}
                height={32}
                animation="wave"
                variant="circle"
              />
            </Grid>
            <Grid item>
              <Skeleton
                width={32}
                height={32}
                animation="wave"
                variant="circle"
              />
            </Grid>
            <Grid item>
              <Skeleton
                width={32}
                height={32}
                animation="wave"
                variant="circle"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Skeleton animation="wave" width="40%" />
        </CardActions>
      </Card>
    </Grid>
  );
}

type ListCardProps = {
  list: Array<FixMeLater>;
  title: string;
  emptyListText: string;
  footer: string;
  renderListItem: Function;
};
const ListCard: FunctionComponent<ListCardProps> = props => {
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
            {list.map((item: FixMeLater) => renderListItem(item))}
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
};

export { ListCard, MemberCard, ProfileCard, SkeletonCard };
