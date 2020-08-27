import React, { Fragment } from 'react';
import spinner from './spinner.gif';
//import waitGif from './wait.gif';

export default () => {
  return (
    <Fragment>
      <img
        src={spinner}
        // style={{ width: '200px', margin: 'auto', display: 'block' }}
        style={{
          minHeight: '100%',
          minWidth: '100%',
          width: '100%',
          height: 'auto',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
        alt='Loading...'
      />
    </Fragment>
  );
};
