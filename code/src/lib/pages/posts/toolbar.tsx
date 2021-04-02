import classnames from 'classnames';
import React, { useState, useEffect } from 'react';

import { PostStatic, ReactSelectChangeEvent } from 'classes';
import { AdminButton } from 'src/components/button';
import { Field, FieldRow, Select, SelectProps } from 'src/components/form';
import { Toolbar, ToolbarToggle } from 'src/components/layout';
import { Icon, Responsive } from 'src/lib/library';
import { PostFiltersState } from 'src/lib/reducers';
import css from 'src/styles/pages/Posts.module.scss';

const sortOptions = [
  { value: 'createTime', label: 'Sort by Creation Time' },
  { value: 'title', label: 'Sort by Title' },
  { value: 'type', label: 'Sort by Type' },
  { value: 'status', label: 'Sort by Status' }
];

export default ({ options, handleOptionSelection }: Toolbar) => {
  const [isFiltersVisible, setFilterVisibility] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);

  useEffect(() => {
    if (isInitialState) {
      setIsInitialState(false);
    }
  }, [isFiltersVisible]);

  const toggleFilterVisibility = () => {
    setFilterVisibility(!isFiltersVisible);
  };

  const state = isInitialState
    ? 'initial'
    : isFiltersVisible
    ? 'visible'
    : 'hidden';
  const filterClasses = classnames(
    css[`post-toolbar__filters`],
    css[`post-toolbar__filters--${state}`]
  );

  const TOOLBAR = toolbarWidgets(options, handleOptionSelection);
  return (
    <Responsive
      defaultView={
        <Toolbar>
          <FieldRow>
            <Field md={4}>{TOOLBAR.ADD_BUTTON}</Field>
            <Field md={2}>{TOOLBAR.FILTERS.FIELD}</Field>
            <Field md={1}>{TOOLBAR.FILTERS.ORDER}</Field>
            <Field md={2}>{TOOLBAR.FILTERS.TYPE}</Field>
            <Field md={2}>{TOOLBAR.FILTERS.STATUS}</Field>
            <Field md={1}>{TOOLBAR.FILTERS.LIMIT}</Field>
          </FieldRow>
        </Toolbar>
      }
      mobileView={
        <Toolbar className={css['post-toolbar-mobile']}>
          <div className={css['post-toolbar-firstrow']}>
            {TOOLBAR.ADD_BUTTON}
            <ToolbarToggle toggle={toggleFilterVisibility}>
              <Icon name={'chevron-up'} />
            </ToolbarToggle>
          </div>
          {/* <Slider
            determinant={filtersVisible}
            duration={300}
            direction={'up'}
            style={{ display: filtersVisible ? 'block' : 'none' }}> */}
          <div className={filterClasses}>
            <FieldRow>
              <Field>{TOOLBAR.FILTERS.FIELD}</Field>
            </FieldRow>
            <FieldRow>
              <Field xs={6}>{TOOLBAR.FILTERS.ORDER}</Field>
              <Field xs={6}>{TOOLBAR.FILTERS.TYPE}</Field>
            </FieldRow>
            <FieldRow>
              <Field xs={6}>{TOOLBAR.FILTERS.STATUS}</Field>
              <Field xs={6}>{TOOLBAR.FILTERS.LIMIT}</Field>
            </FieldRow>
          </div>
          {/* </Slider> */}
        </Toolbar>
      }
    />
  );
};

const toolbarWidgets = (
  options: PostFiltersState,
  handleOptionSelection: (event: ReactSelectChangeEvent) => void
) => {
  const navigateToCreateForm = () => {
    location.href = '/admin/posts/add';
  };
  return {
    ADD_BUTTON: (
      <AdminButton onClick={navigateToCreateForm}>Add New Post</AdminButton>
    ),
    FILTERS: {
      FIELD: (
        <FilterDropdown
          name={'field'}
          items={sortOptions}
          value={options.field}
          onChange={handleOptionSelection}
        />
      ),
      ORDER: (
        <FilterDropdown
          name={'order'}
          items={['ASC', 'DESC']}
          value={options.order}
          onChange={handleOptionSelection}
        />
      ),
      TYPE: (
        <FilterDropdown
          name={'type'}
          items={PostStatic.TYPES}
          value={options.type}
          onChange={handleOptionSelection}
          placeholder={'Filter by type...'}
          isPlaceholderSelectable={true}
        />
      ),
      STATUS: (
        <FilterDropdown
          name={'status'}
          items={PostStatic.STATUSES}
          value={options.status}
          onChange={handleOptionSelection}
          placeholder={'Filter by status...'}
          isPlaceholderSelectable={true}
        />
      ),
      LIMIT: (
        <FilterDropdown
          name={'limit'}
          items={[10, 20, 50, 100]}
          value={options.limit}
          onChange={handleOptionSelection}
          placeholder={'Show All'}
          isPlaceholderSelectable={true}
        />
      )
    }
  };
};

const FilterDropdown = (props: SelectProps) => {
  return <Select {...props} className={css['post-filter']} isRound={true} />;
};

interface Toolbar {
  options: PostFiltersState;
  handleOptionSelection: (event: ReactSelectChangeEvent) => void;
}
