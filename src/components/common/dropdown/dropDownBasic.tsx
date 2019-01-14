import onClickOutside from 'react-onclickoutside';
import React from 'react';
import PropTypes from 'prop-types';

export const DropdownBasic = onClickOutside(({ handleClickInside, children }) => (
    <div onClick={handleClickInside}>{children}</div>
));

DropdownBasic.proptypes = {
    handleClickOutside: PropTypes.func.isRequired,
    handleClickInside: PropTypes.func.isRequired,
};