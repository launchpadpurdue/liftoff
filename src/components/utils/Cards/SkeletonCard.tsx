import React from 'react';

import { Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { cardStyles } from '../../../constants';

export default function SkeletonCard() {
  const classes = cardStyles();
  return (
    <Grid item md={4} sm={6} xs={12}>
      <Card className={classes.card}>
        <Skeleton className={classes.cardMedia} variant="rect" />
        <CardContent className={classes.cardContent}>
          <Typography component="h2" gutterBottom variant="h5">
            <Skeleton animation="wave" variant="text" />
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Skeleton
                animation="wave"
                height={32}
                variant="circle"
                width={32}
              />
            </Grid>
            <Grid item>
              <Skeleton
                animation="wave"
                height={32}
                variant="circle"
                width={32}
              />
            </Grid>
            <Grid item>
              <Skeleton
                animation="wave"
                height={32}
                variant="circle"
                width={32}
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
