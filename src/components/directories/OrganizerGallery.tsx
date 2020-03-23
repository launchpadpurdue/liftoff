import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';

import {
    Container, createStyles, Grid, Theme, Typography, WithStyles, withStyles
} from '@material-ui/core';

import { filterMembers, FixMeLater, Member, MemberQuery } from '../../constants';
import NavBar from '../navigation/NavBar';
import { MemberCard, SkeletonCard } from '../utils/Cards';
import { EmptyData, EmptyQuery, Footer, Header, QueryBar } from '../utils/Utlities';

const organizerStyles = (theme: Theme) =>
  createStyles({
    cardGrid: {
      padding: theme.spacing(8, 4, 8, 4)
    }
  });

interface OrganizerGalleryProps extends WithStyles<typeof organizerStyles> {
  organizers: Array<Member>;
}
type OrganizerGalleryData = Partial<OrganizerGalleryProps>;
type OrganizerGalleryState = {
  query: MemberQuery;
};
class OrganizerGallery extends Component<
  OrganizerGalleryProps,
  OrganizerGalleryState
> {
  state = { query: { name: "", skills: [] } };

  onQuery = (query: MemberQuery) => {
    this.setState({
      query: {
        name: query.name.replace(/\s/g, "").toLowerCase(),
        skills: query.skills
      }
    });
  };

  render() {
    const { classes, organizers } = this.props;
    const { query } = this.state;
    const dataLoaded: boolean = isLoaded(organizers),
      dataEmpty: boolean = isEmpty(organizers);
    const filteredMembers = filterMembers(organizers, query);
    return (
      <Fragment>
        <NavBar />
        <Header>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Meet the Organizers
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Something short and leading about the collection below—its contents,
            the creator, etc. Make it short and sweet, but not too short so
            folks don&apos;t simply skip over it entirely.
          </Typography>
        </Header>
        {dataLoaded && !dataEmpty && <QueryBar onQuery={this.onQuery} />}
        <Container className={classes.cardGrid} maxWidth="md">
          {!dataLoaded && (
            <Grid container spacing={4}>
              {[1, 2, 3].map(num => (
                <SkeletonCard key={num} />
              ))}
            </Grid>
          )}
          {dataLoaded && dataEmpty && (
            <EmptyData
              title="Come back soon!"
              message="No organizers have signed up yet but come back soon to meet
            them all!"
            />
          )}
          {dataLoaded && !dataEmpty && filteredMembers.length === 0 && (
            <EmptyQuery
              title="No organizers found"
              message="No organizers were found that matched your query"
            />
          )}
          {dataLoaded && !dataEmpty && filteredMembers.length > 0 && (
            <Grid container spacing={4}>
              {filteredMembers.map(user => (
                <MemberCard key={user.id} member={user} />
              ))}
            </Grid>
          )}
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state: FixMeLater): OrganizerGalleryData => {
  return {
    organizers: state.firestore.ordered.users
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "users",
      where: ["role", "==", "Organizer"]
    }
  ]),
  withStyles(organizerStyles)
)(OrganizerGallery);
