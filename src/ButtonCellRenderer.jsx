const ButtonCellRenderer = (props) => {
  const handleButtonClick = () => {
    // Access the row data via props.data
    console.log("Row data:", props.data);
    // Perform actions with the row data, e.g., open a modal, navigate
  };

  return <button onClick={handleButtonClick}>View Details</button>;
};

export default ButtonCellRenderer;
