export const createPaginationResponse = (
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  items: any
) => {
  return {
    totalItems: totalItems,
    pageNumber: pageNumber,
    pageSize: pageSize,
    next:
      totalItems > pageNumber * pageSize
        ? `/appointments/search?pageNumber=${
            pageNumber + 1
          }&pageSize=${pageSize}`
        : null,
    prev:
      pageNumber > 1
        ? `/appointments/search?pageNumber=${
            pageNumber - 1
          }&pageSize=${pageSize}`
        : null,
    items: items,
  };
};
