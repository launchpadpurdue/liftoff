import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';

import {
    Container, createStyles, Grid, Theme, Typography, withStyles, WithStyles
} from '@material-ui/core';

import { filterMembers, FixMeLater, Member, MemberQuery } from '../../constants';
import NavBar from '../navigation/NavBar';
import { MemberCard, SkeletonCard } from '../utils/Cards';
import { EmptyData, EmptyQuery, Footer, Header, QueryBar } from '../utils/Utlities';

const menteeStyles = (theme: Theme) =>
  createStyles({
    cardGrid: {
      padding: theme.spacing(8, 4, 8, 4)
    }
  });

interface MenteeGalleryProps extends WithStyles<typeof menteeStyles> {
  mentees: Array<Member>;
}
type MenteeGalleryData = Partial<MenteeGalleryProps>;
type MenteeGalleryState = {
  query: MemberQuery;
};
class MenteeGallery extends Component<MenteeGalleryProps, MenteeGalleryState> {
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
    const { classes, mentees } = this.props;
    const { query } = this.state;
    const dataLoaded: boolean = isLoaded(mentees),
      dataEmpty: boolean = isEmpty(mentees);
    const filteredMembers = filterMembers(mentees, query);
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
            Meet the Mentees
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
              message="No mentees have signed up yet but come back soon to meet
              them all!"
            />
          )}
          {dataLoaded && !dataEmpty && filteredMembers.length === 0 && (
            <EmptyQuery
              title="No mentees found"
              message="No mentees were found that matched your query"
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
const mapStateToProps = (state: FixMeLater): MenteeGalleryData => {
  return {
    mentees: state.firestore.ordered.users
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "users",
      where: ["role", "==", "Mentee"]
    }
  ]),
  withStyles(menteeStyles)
)(MenteeGallery);
