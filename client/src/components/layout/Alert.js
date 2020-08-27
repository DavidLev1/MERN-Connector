import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  // 'alerts' gets 'state.alert' value (state.alert has msg, alertType and id)
  // and it's now become a prop of 'Alert' component
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
