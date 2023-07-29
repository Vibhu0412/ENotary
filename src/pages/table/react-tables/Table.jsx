import Icon from '@/components/ui/Icon';
import { MaterialReactTable } from 'material-react-table';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';

const Table = ({
  col,
  onRowClick,
  renderTopToolbarActions,
  renderRowActionMenuItems,
  getData,
}) => {
  const [isRead, _] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => col, []);

  const fetchData = async () => {
    if (data.length) {
      setIsRefetching(true);
    } else {
      setIsLoading(true);
    }

    try {
      const filterObj = {};

      columnFilters.forEach(filter => {
        filterObj[filter.id] = filter.value;
      });

      // Get data from API. pass filters, pagination, sorting
      const response = await getData(filterObj, pagination, sorting?.[0]);

      setData(oldData => [...response?.data?.records]);
      setTotalRecords(response?.data?.totalCount);
    } catch (error) {
      console.error(error);
      setHasError(true);
      return;
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }

    setIsError(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters]);

  return (
    <MaterialReactTable
      autoResetPageIndex={false}
      state={{
        pagination,
        isLoading,
        sorting,
        showProgressBars: isRefetching,
        showAlertBanner: hasError,
        columnFilters,
      }}
      rowCount={totalRecords}
      pageCount={Math.ceil(totalRecords / pagination.pageSize)}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      columns={columns}
      onColumnFiltersChange={setColumnFilters}
      data={data}
      enableRowSelection
      enableRowActions
      enableFullScreenToggle={false}
      enableColumnActions={false}
      positionActionsColumn="last"
      muiToolbarAlertBannerProps={
        hasError
          ? {
              color: 'error',
              children: 'Error loading data',
            }
          : undefined
      }
      muiTableHeadRowProps={{
        sx: {
          '--tw-bg-opacity': 1,
          fontFamily: 'Inter, sans-serif',
          backgroundColor: 'rgb(226 232 240 / var(--tw-bg-opacity))',
          fontWeight: '600',
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          backgroundColor: '#64748b',
          // fontC: 'white',
          fontWeight: '600',
          fontSize: '.75rem',
          lineHeight: '1rem',
          textTransform: 'uppercase',
          '--tw-text-opacity': 1,
          color: 'white',
          borderColor: 'rgb(241 245 249 / var(--tw-border-opacity))',
          paddingTop: '1.25rem',
          paddingRight: '1.5rem',
          paddingBottom: '1.25rem',
          paddingLeft: '1.5rem',
          fontFamily: 'Inter, sans-serif',
          ' & .Mui-TableHeadCell-Content': {
            position: 'relative',
            top: '5px',
          },
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          '--tw-border-opacity': 1,
          borderColor: 'rgb(241 245 249 / var(--tw-border-opacity))',
          fontFamily: 'Inter, sans-serif',
          '--tw-text-opacity': 1,
          color: 'rgb(71 85 105 / var(--tw-text-opacity))',
          paddingLeft: '1.5rem',
        },
      }}
      muiSelectCheckboxProps={{
        sx: {
          '--tw-text-opacity': 1,
          color: '#000',
        },
      }}
      muiTableBodyRowProps={row => ({
        sx: {
          backgroundColor: isRead ? 'rgba(25, 118, 210, 0.08)' : '',
        },
        onClick: e => {
          return onRowClick(row.row);
        },
      })}
      renderBottomToolbar={props => {
        return <Pagination table={props.table} />;
      }}
      renderRowActionMenuItems={renderRowActionMenuItems}
      renderTopToolbarCustomActions={renderTopToolbarActions}
      manualFiltering
      manualSorting
      manualPagination
    />
  );
};

const Pagination = ({ table }) => {
  const totalPage = table.getPageCount();
  const totalRecords = table.options.rowCount;

  const previousPage = () => {
    table.setPageIndex(table.options?.state.pagination.pageIndex);
    table.previousPage();
  };

  const nextPage = () => {
    table.setPageIndex(table.options?.state.pagination.pageIndex);
    table.options?.state.pagination.pageIndex + 1 < totalPage
      ? table.nextPage()
      : null;
  };

  const gotoPage = page => {
    table.setPageIndex(page);
  };

  const gotoLastPage = () => {
    table.setPageIndex(totalPage - 1);
  };

  const gotoFirstPage = () => {
    table.setPageIndex(0);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          margin: '5px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          flex: '2',
        }}
      >
        <select
          onChange={e => table.setPageSize(e.target.value)}
          className="form-control py-2 w-max"
        >
          <option value="10">Show 10</option>
          <option value="15">Show 15</option>
          <option value="20">Show 20</option>
        </select>
        <div className="m-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Page{' '}
            <span>
              {table.options?.state.pagination.pageIndex + 1} of {totalPage}
            </span>
          </span>
        </div>
        <div className="m-2 ml-6">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Records: <span>{totalRecords}</span>
          </span>
        </div>
      </Box>
      <Box sx={{ flex: '.5' }}>
        <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={` ${
                table.options?.state.pagination.pageIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => gotoFirstPage()}
              disabled={table.options?.state.pagination.pageIndex === 0}
            >
              <Icon icon="heroicons:chevron-double-left-solid" />
            </button>
          </li>
          <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={`${
                table.options?.state.pagination.pageIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              onClick={() => previousPage()}
              disabled={
                table.options?.state.pagination.pageIndex === 0 ? true : false
              }
            >
              Prev
            </button>
          </li>
          {table.getPageOptions().map((page, pageIdx) => (
            <li key={pageIdx}>
              <button
                href="#"
                aria-current="page"
                className={` ${
                  pageIdx === table.options?.state.pagination.pageIndex
                    ? 'bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium '
                    : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal  '
                }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                onClick={() => gotoPage(pageIdx)}
              >
                {page + 1}
              </button>
            </li>
          ))}
          <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={`${
                table.options?.state.pagination.pageIndex + 1 < totalPage
                  ? 'cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => nextPage()}
              disabled={
                table.options?.state.pagination.pageIndex + 1 < totalPage
                  ? false
                  : true
              }
            >
              Next
            </button>
          </li>
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              onClick={() => gotoLastPage()}
              disabled={
                table.options?.state.pagination.pageIndex + 1 === totalPage
              }
              className={` ${
                table.options?.state.pagination.pageIndex + 1 === totalPage
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Icon icon="heroicons:chevron-double-right-solid" />
            </button>
          </li>
        </ul>
      </Box>
    </div>
  );
};

export default Table;
