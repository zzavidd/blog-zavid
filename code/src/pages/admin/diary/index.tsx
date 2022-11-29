import {
  faArrowDown,
  faArrowUp,
  faPenAlt,
  faPlus,
  faStar,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

import { Modal } from 'components/Modal';
import Contexts from 'constants/contexts';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import { QueryOrder } from 'constants/types';
import Utils from 'constants/utils';
import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import SSR from 'private/ssr';
import ModalStyle from 'styles/Components/Modal.styles';
import { AdminList as AL } from 'styles/Pages/Admin.styles';
import { ButtonVariant } from 'styles/Variables.styles';

const FIELDS = [
  { title: 'ID', property: 'id', align: 'right' },
  { title: 'Title', property: 'title', align: 'left' },
  { title: 'Date Published', property: 'date', align: 'center' },
  { title: 'Status', property: 'status', align: 'center' },
  { title: 'Favourite?', property: 'isFavourite', align: 'center' },
] as const;

// eslint-disable-next-line react/function-component-definition
const DiaryAdmin: NextPageWithLayout<DiaryAdminProps> = ({ pageProps }) => {
  const [state, setState] = useState<DiaryAdminState>({
    diaryEntries: pageProps.diaryEntries,
    selectedDiaryEntry: {},
    deleteModalVisible: false,
    sort: {
      property: 'id',
      ascending: false,
    },
  });
  const dispatch = Utils.createDispatch(setState);
  const Alerts = useContext(Contexts.Alerts);

  function promptDelete(entry: DiaryDAO) {
    dispatch({ deleteModalVisible: true, selectedDiaryEntry: entry });
  }

  /**
   * Deletes the selected diary entry;
   */
  async function deleteDiaryEntry() {
    const { id, date } = state.selectedDiaryEntry;

    try {
      await Utils.request('/api/diary', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      Alerts.success(
        `You've deleted the diary entry for ${ZDate.format(date!)}.`,
      );
      dispatch({ deleteModalVisible: false });
    } catch (e: any) {
      Alerts.error(e.message);
    }
  }

  function sortDiaryEntries(property: keyof DiaryDAO) {
    dispatch({
      sort: {
        property,
        ascending: !state.sort.ascending,
      },
    });
  }

  useEffect(() => {
    const diaryEntries = pageProps.diaryEntries.sort((a, b) => {
      const valueA = a[state.sort.property] as string | number;
      const valueB = b[state.sort.property] as typeof valueA;
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else {
        return valueA.toString().localeCompare(valueB.toString(), 'en', {
          ignorePunctuation: true,
        });
      }
    });

    if (state.sort.ascending) {
      diaryEntries.reverse();
    }
    dispatch({ diaryEntries });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProps.diaryEntries, state.sort]);

  return (
    <AdminGateway>
      <AL.Container>
        <AL.Main>
          <AL.Heading>List of Diary Entries</AL.Heading>
          <AL.TableBox>
            <AL.Table>
              <AL.TableHead>
                <AL.TableRow>
                  {FIELDS.map(({ title, property, align }) => {
                    const icon = state.sort.ascending ? faArrowUp : faArrowDown;
                    return (
                      <AL.TableHeaderCell
                        align={align}
                        key={property}
                        onClick={() => sortDiaryEntries(property)}>
                        <span>{title}</span>
                        {property === state.sort.property ? (
                          <AL.SortIcon icon={icon} />
                        ) : null}
                      </AL.TableHeaderCell>
                    );
                  })}
                  <AL.TableHeaderCell colSpan={2}>
                    <Link href={'/admin/diary/add'}>
                      <AL.AddLink>
                        <AL.AddIcon icon={faPlus} />
                        <span>Add Entry</span>
                      </AL.AddLink>
                    </Link>
                  </AL.TableHeaderCell>
                </AL.TableRow>
              </AL.TableHead>
              <tbody>
                {state.diaryEntries.map((entry) => {
                  return (
                    <AL.TableRow key={entry.id}>
                      <AL.TableCell align={'right'}>
                        {entry.entryNumber}
                      </AL.TableCell>
                      <AL.TableCell>{entry.title}</AL.TableCell>
                      <AL.TableCell align={'center'}>
                        {ZDate.format(entry.date)}
                      </AL.TableCell>
                      <AL.TableCell align={'center'}>
                        {entry.status}
                      </AL.TableCell>
                      <AL.TableCell align={'center'}>
                        {entry.isFavourite ? (
                          <FontAwesomeIcon icon={faStar} />
                        ) : null}
                      </AL.TableCell>
                      <Link
                        href={`/admin/diary/edit/${entry.id}`}
                        passHref={true}>
                        <AL.TableCell align={'center'}>
                          <AL.Icon icon={faPenAlt} />
                        </AL.TableCell>
                      </Link>
                      <AL.TableCell
                        align={'center'}
                        onClick={() => promptDelete(entry)}>
                        <AL.Icon icon={faTrash} />
                      </AL.TableCell>
                    </AL.TableRow>
                  );
                })}
              </tbody>
            </AL.Table>
          </AL.TableBox>
          <Modal
            visible={state.deleteModalVisible}
            body={
              <p>
                Are you sure you want to delete the diary entry #
                {state.selectedDiaryEntry?.entryNumber}?
              </p>
            }
            footer={
              <React.Fragment>
                <ModalStyle.FooterButton
                  variant={ButtonVariant.DELETE}
                  onClick={deleteDiaryEntry}>
                  Delete
                </ModalStyle.FooterButton>
                <ModalStyle.FooterButton
                  variant={ButtonVariant.CANCEL}
                  onClick={() => dispatch({ deleteModalVisible: false })}>
                  Cancel
                </ModalStyle.FooterButton>
              </React.Fragment>
            }
          />
        </AL.Main>
      </AL.Container>
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<
  DiaryAdminProps
> = async () => {
  const diaryEntries = JSON.parse(
    await SSR.Diary.getAll({
      sort: {
        field: 'date',
        order: QueryOrder.DESCENDING,
      },
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: 'List of Diary Entries',
      },
      pageProps: {
        diaryEntries,
      },
    },
  };
};

DiaryAdmin.getLayout = Layout.addHeaderOnly;
export default DiaryAdmin;

interface DiaryAdminProps {
  pathDefinition: PathDefinition;
  pageProps: {
    diaryEntries: DiaryDAO[];
  };
}

interface DiaryAdminState {
  diaryEntries: DiaryDAO[];
  selectedDiaryEntry: DiaryDAO | Record<string, never>;
  deleteModalVisible: boolean;
  sort: {
    property: keyof DiaryDAO;
    ascending: boolean;
  };
}
