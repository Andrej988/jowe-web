import React, { forwardRef, type HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// import { CLink } from '../link/CLink';
import { Link } from 'react-router-dom';

export interface CBreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The `href` attribute for the inner `<CLink>` component.
   */
  href?: string;
}

export const CBreadcrumbItemModified = forwardRef<HTMLLIElement, CBreadcrumbItemProps>(
  ({ children, active, className, href, ...rest }, ref) => {
    return (
      <li
        className={classNames(
          'breadcrumb-item',
          {
            active,
          },
          className,
        )}
        {...((active ?? false) && { 'aria-current': 'page' })}
        {...rest}
        ref={ref}
      >
        {href != null ? (
          <Link to={href} style={{ color: 'var(--bs-breadcrumb-item-active-color)' }}>
            {children}
          </Link>
        ) : (
          children
        )}
      </li>
    );
  },
);

CBreadcrumbItemModified.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
};

CBreadcrumbItemModified.displayName = 'CBreadcrumbItemModified';
