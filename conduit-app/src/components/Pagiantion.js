function Pagiantion(props) {
    let {
      articlesCount,
      articlesPerPage,
      activePageIndex,
      updateCurrentPageIndex,
    } = props;
    let numberOfPages = Math.ceil(articlesCount / articlesPerPage);
  
    let pagesArray = [];
    for (let i = 1; i <= numberOfPages; i++) {
      pagesArray.push(i);
    }
    return (
      <>
        <div className="pagination">
          {activePageIndex !== 1 && numberOfPages !== 0 && (
            <p
              onClick={() =>
                updateCurrentPageIndex(
                  activePageIndex - 1 < 1 ? 1 : activePageIndex - 1
                )
              }
            >
              {"< Prev"}
            </p>
          )}
  
          {pagesArray.map((page, i) => {
            return (
              <span
                key={page}
                className={
                  activePageIndex === page
                    ? "pagination-count1"
                    : "pagination-count2"
                }
                onClick={() => updateCurrentPageIndex(page)}
              >
                {page}
              </span>
            );
          })}
          {activePageIndex !== numberOfPages && numberOfPages !== 0 && (
            <p
              onClick={() =>
                updateCurrentPageIndex(
                  activePageIndex + 1 > numberOfPages
                    ? numberOfPages
                    : activePageIndex + 1
                )
              }
            >
              {"Next >"}
            </p>
          )}
        </div>
      </>
    );
  }
  export default Pagiantion;