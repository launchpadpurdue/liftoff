import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button, Card, CardActions, CardContent, CardMedia, Chip, Grid, Tooltip, Typography
} from '@material-ui/core';

import { cardStyles, Member, skillIcon } from '../../../constants';

type MemberCardProps = {
  member: Member;
};

export default function MemberCard({ member }: MemberCardProps) {
  const classes = cardStyles();
  const { firstName, lastName, profilePicture, skills, id } = member;
  return (
    <Grid item md={4} sm={6} xs={12}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={profilePicture}
          title={`${firstName} ${lastName} Picture`}
        />
        <CardContent className={classes.cardContent}>
          <Typography component="h2" gutterBottom variant="h5">
            {`${firstName} ${lastName}`}
          </Typography>
          <Grid container spacing={1}>
            {skills.sort().map((skill) => (
              <Grid item key={skill}>
                <Tooltip arrow title={skill}>
                  <Chip
                    color="secondary"
                    classes={{
                      label: classes.chipLabel,
                      root: classes.chipRoot,
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
            component={Link}
            size="small"
            to={`/profile/${id}`}
          >
            View Profile
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
