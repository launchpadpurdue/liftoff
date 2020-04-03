import React, { Fragment } from 'react';

import { Box, Divider, List, makeStyles, Paper, Typography } from '@material-ui/core';

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

export default function ListCard(props: ListCardProps) {
  const { list = [], title, emptyListText, footer, renderListItem } = props;
  const classes = listCardStyles();
  return (
    <Paper>
      {title && (
        <Fragment>
          <Box px={4} py={2}>
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
            <Typography align="center" variant="body1">
              {emptyListText}
            </Typography>
          </Box>
        )}
      </Box>
      {footer && (
        <Fragment>
          <Divider />
          <Box display="flex" justifyContent="center" py={2}>
            {footer}
          </Box>
        </Fragment>
      )}
    </Paper>
  );
}
