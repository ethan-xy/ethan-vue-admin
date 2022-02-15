import {reactive, watch} from 'vue'

const tableDataDefault = () => {
  const tableData = reactive({
    data: [],
    pagination: {
      currentPage: 1,
      pageSize: 15,
      pageCount: 0,
      from: 1,
      lastPage: 1,
      to: 1
    },
    nowRow: {
      index: 0,
      row: {}
    },
    queryParams: {},
    loading: false
  })

  watch(tableData.queryParams, () => {
    tableData.pagination.currentPage = 1
  })

  tableData.getQueryParams = () => {
    return {...tableData.queryParams, page: tableData.pagination.currentPage}
  }

  return tableData
}


const tableDataFormat = (response, tableData) => {
  tableData.data = response.data.data

  let meta = response.data.meta
  tableData.pagination = {
    currentPage: meta.current_page,
    pageSize: meta.per_page,
    total: meta.total,
    from: meta.from,
    lastPage: meta.last_page,
    to: meta.to
  }

  tableData.loading = false
}

export {tableDataDefault, tableDataFormat}