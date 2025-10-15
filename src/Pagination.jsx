import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const Pagination = ({
  recordsCount,
  startIndex,
  setStartIndex,
  endIndex,
  setEndIndex,
  selectedCount,
  setSelectedCount,
}) => {
  const [isPrev, setIsPrev] = useState(true);
  const [isNext, setIsNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (+endIndex >= recordsCount) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [recordsCount]);
  return (
    <>
      <Box display={"flex"} justifyContent={"center"} gap={"15px"}>
        <div style={{ display: "flex", gap: "10px" }}>
          <Typography>Page Size </Typography>
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
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              {
                startIndex - selectedCount <= 0
                  ? setStartIndex(0)
                  : setStartIndex(startIndex - selectedCount);
              }
              setEndIndex(endIndex - selectedCount);
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
          <Typography>
            {currentPage} of {Math.ceil(recordsCount / selectedCount)}
          </Typography>
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
        </div>
      </Box>
    </>
  );
};

export default Pagination;
