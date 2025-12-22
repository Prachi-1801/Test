import { Autocomplete, TextField } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  { key: 1, label: "Oliver Hansen" },
  { key: 2, label: "Van Henry" },
  { key: 3, label: "April Tucker" },
  { key: 5, label: "Ralph Hubbard" },
  { key: 4, label: "Omar Alexander" },
  { key: 6, label: "Carlos Abbott" },
  { key: 7, label: "Miriam Wagner" },
  { key: 8, label: "Bradley Wilkerson" },
  { key: 9, label: "Virginia Andrews" },
  { key: 10, label: "Kelly Snyder" },
];

export default function MultipleSelectChip() {
  return (
    <Autocomplete
      // disableCloseOnSelect
      multiple
      id="tags-outlined"
      options={names}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField {...params} label="filterSelectedOptions" />
      )}
    />
  );
}
