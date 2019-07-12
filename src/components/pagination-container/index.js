import React, { useEffect, useState, useRef, useReducer } from 'react';

const paginationReducer = (oldState, action) => {
  switch (action.type) {
    case 'next':
      return {
        page: oldState.page + 1,
        totalPages: oldState.totalPages,
        announce: `Showing page ${oldState.page + 1} of ${oldState.totalPages}`,
      };
    case 'previous':
      return {
        page: oldState.page - 1,
        totalPages: oldState.totalPages,
        announce: `Showing page ${oldState.page - 1} of ${oldState.totalPages}`,
      };
    case 'expand':
      return {
        expanded: true,
        totalPages: oldState.totalPages,
        announce: 'Showing all pages',
      };
    case 'restart':
      return {
        ...oldState,
        page: 1,
        announce: `Showing page 1 of ${action.totalPages}`,
      };
    default:
      return {};
  }
};

function PaginationController({ enabled, items, itemsPerPage, children }) {
  const numItems = items.length;
  const numPages = Math.ceil(items.length / itemsPerPage);

  const [state, dispatchState] = useReducer(paginationReducer, {
    page: 1,
    totalPages: numPages,
    announce: '',
    expanded: false,
  });
  const prevButtonRef = useRef();
  const nextButtonRef = useRef();

  const canPaginate = enabled && !state.expanded && itemsPerPage < numItems;

  const onNextButtonClick = () => {
    if (state.page + 1 === numPages) {
      prevButtonRef.current.focus();
    }

    dispatchState({ type: 'next' });
  };

  const onPreviousButtonClick = () => {
    if (state.page - 1 === 1) {
      nextButtonRef.current.focus();
    }

    dispatchState({ type: 'previous' });
  };

  if (canPaginate) {
    const startIdx = (state.page - 1) * itemsPerPage;
    items = items.slice(startIdx, startIdx + itemsPerPage);
  }

  useEffect(() => {
    dispatchState({ type: 'restart', totalPages: numPages });
  }, [numItems]);

  return (
    <>
      {children(items)}
      {canPaginate && (
        <div className={styles.viewControls}>
          <div className={styles.paginationControls}>
            <Button ref={prevButtonRef} type="tertiary" disabled={state.page === 1} onClick={onPreviousButtonClick}>
              <Image alt="Previous" className={styles.paginationArrow} src={arrowSrc} />
            </Button>
            {state.announce && <LiveMessage message={state.announce} aria-live="assertive" />}
            <div data-cy="page-numbers" className={styles.pageNumbers}>
              {state.page} / {numPages}
            </div>
            <Button ref={nextButtonRef} type="tertiary" disabled={state.page === numPages} onClick={onNextButtonClick}>
              <Image alt="Next" className={classNames(styles.paginationArrow, styles.next)} src={arrowSrc} />
            </Button>
          </div>
          <Button data-cy="show-all" type="tertiary" onClick={() => dispatchState({ type: 'expand' })}>
            Show all <Badge>{numItems}</Badge>
          </Button>
        </div>
      )}
    </>
  );
};