import React, { Fragment } from 'react';

import { Box, Divider, List, makeStyles, Paper, Typography } from '@material-ui/core';

import MemberCard from './Cards/MemberCard';
import ProfileCard from './Cards/ProfileCard';
import SkeletonCard from './Cards/SkeletonCard';

const listCardStyles = makeStyles({
  list: {
    overflow: "auto",
  },
});

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
