import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase';
// Redux Imports
import { compose } from 'redux';

// Material UI Imports
import {
    Container, createStyles, Grid, Theme, Typography, WithStyles, withStyles
} from '@material-ui/core';

import { FixMeLater, Member } from '../../constants';
import NavBar from '../navigation/NavBar';
// Local Imports
import { MemberCard, SkeletonCard } from '../utils/Cards';
import { EmptyData, Footer, Header, MemberQuery, QueryBar } from '../utils/Utlities';

const organizerStyles = (theme: Theme) =>
  createStyles({
    cardGrid: {
      padding: theme.spacing(8, 4, 8, 4)
    }
  });

interface OrganizerGalleryProps extends WithStyles<typeof organizerStyles> {
  organizers: Array<Member>;
}
type OrganizerGalleryState = {
  query: MemberQuery;
};
class OrganizerGallery extends Component<OrganizerGalleryProps, {}> {
  state = { query: { name: "", skills: [] } };

  onQuery = (query: MemberQuery) => {
    this.setState({
      query: {
        name: query.name.replace(/\s/g, "").toLowerCase(),
        skills: query.skills
      }
    });
  };

  filter = (members: Array<Member>, query: MemberQuery) =>
    members.filter((member: Member) => {
      const text = (member.firstName + member.lastName)
        .replace(/\s/g, "")
        .toLowerCase();
      if (query.skills.length === 0) {
        return text.includes(query.name);
      }
      for (const skill of query.skills) {
        if (member.skills.includes(skill)) {
          return text.includes(query.name);
        }
      }
      return false;
    });

  render() {
    const { classes, organizers } = this.props;
    const dataLoaded: boolean = isLoaded(organizers),
      dataEmpty: boolean = isEmpty(organizers);
    return (
      <React.Fragment>
        <NavBar />
        <main>
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
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
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
            {dataLoaded && !dataEmpty && (
              <Fragment>
                <Grid container spacing={4}>
                  {this.filter(organizers, this.state.query).map(user => (
                    <MemberCard key={user.id} member={user} />
                  ))}
                </Grid>
              </Fragment>
            )}
          </Container>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: FixMeLater): FixMeLater => {
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
  ])
)(withStyles(organizerStyles)(OrganizerGallery));
