import { Icon } from '@material-ui/core';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';

const PageRefresher = () => {
  const history = useHistory();
  const location = useLocation();

  console.log(location);
  return (
    <Button
      className="d-flex align-items-center"
      variant="light"
      onClick={() => history.replace(`${location.pathname}${location.search}`)}>
      <Icon>sync</Icon>
    </Button>
  );
};

export default PageRefresher;
