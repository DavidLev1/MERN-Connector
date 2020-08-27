import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import { sortObjsArrByProperty } from '../../utils/sortings/objsArr';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    // Run getProfiles method once only when component loaded
    getProfiles();
  }, [getProfiles]);

  sortObjsArrByProperty(profiles, 'user.name');

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large-text-primary'>People</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i>
            Browse and connect with people
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
