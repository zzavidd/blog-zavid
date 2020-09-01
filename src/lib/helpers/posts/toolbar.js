import React, { useState } from 'react';

import { Post } from 'classes';
import { AdminButton } from 'components/button';
import { Field, FieldRow, Select } from 'components/form';
import { Icon } from 'components/icon';
import { Responsive, Toolbar, ToolbarToggle } from 'components/layout';
import { Slider } from 'components/transitioner';
import css from 'styles/pages/Posts.module.scss';

const sortOptions = [
  { value: 'createTime', label: 'Sort by Creation Time' },
  { value: 'title', label: 'Sort by Title' },
  { value: 'type', label: 'Sort by Type' },
  { value: 'status', label: 'Sort by Status' }
];

export default ({ options, handleOptionSelection }) => {
  const [filtersVisible, setFilterVisibility] = useState(false);

  const toggleFilterVisibility = () => {
    setFilterVisibility(!filtersVisible);
  };

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
          <Slider
            determinant={filtersVisible}
            duration={300}
            direction={'up'}
            style={{ display: filtersVisible ? 'block' : 'none' }}>
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
          </Slider>
        </Toolbar>
      }
    />
  );
};

const toolbarWidgets = (options, handleOptionSelection) => {
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
          items={Post.typeList}
          value={options.type}
          onChange={handleOptionSelection}
          placeholder={'Filter by type...'}
          isPlaceholderSelectable={true}
        />
      ),
      STATUS: (
        <FilterDropdown
          name={'status'}
          items={Post.statusList}
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

const FilterDropdown = (props) => {
  return <Select {...props} className={css['post-filter']} isRound={true} />;
};
