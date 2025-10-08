import { useEffect, useState } from "react";

const Pagination = ({
  recordsCount,
  startIndex,
  setStartIndex,
  endIndex,
  setEndIndex,
}) => {
  const [isPrev, setIsPrev] = useState(true);
  const [isNext, setIsNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCount, setSelectedCount] = useState(2);
  useEffect(() => {
    if (+endIndex >= recordsCount) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [recordsCount]);
  return (
    <>
      Page Size:
      <select
        value={selectedCount} // ...force the select's value to match the state variable...
        onChange={(e) => {
          setCurrentPage(1);
          setSelectedCount(e.target.value);
          setStartIndex(0);
          setEndIndex(e.target.value);
          setIsPrev(true);
          if (e.target.value >= recordsCount) {
            setIsNext(true);
          } else {
            setIsNext(false);
          }
        }}
      >
        <option value={2}>2</option>
        <option value={4}>4</option>
        <option value={6}>6</option>
      </select>
      <button
        onClick={() => {
          console.log("Before StartIndex", startIndex, "EndIndex", endIndex);
          {
            startIndex - selectedCount <= 0
              ? setStartIndex(0)
              : setStartIndex(startIndex - selectedCount);
          }
          setEndIndex(endIndex - selectedCount);
          console.log("After StartIndex", startIndex, "EndIndex", endIndex);
          setIsNext(false);
          setCurrentPage((p) => p - 1);
          if (startIndex - selectedCount <= 0) {
            setIsPrev(true);
          }
        }}
        disabled={isPrev}
      >
        {" < "}
      </button>
      {currentPage} of {Math.ceil(recordsCount / selectedCount)}
      <button
        onClick={() => {
          setStartIndex(+startIndex + +selectedCount);
          setEndIndex(+endIndex + +selectedCount);
          setIsPrev(false);
          setCurrentPage((p) => p + 1);
          if (+endIndex + +selectedCount >= recordsCount) {
            setIsNext(true);
          }
        }}
        disabled={isNext}
      >
        {" > "}
      </button>
    </>
  );
};

export default Pagination;
