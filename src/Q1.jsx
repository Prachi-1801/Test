const transactions = [
  { user: "Alice", type: "credit", amount: 200, category: "food" },
  { user: "Bob", type: "debit", amount: 100, category: "travel" },
  { user: "Alice", type: "credit", amount: 300, category: "shopping" },
  { user: "Alice", type: "debit", amount: 150, category: "food" },
  { user: "Bob", type: "credit", amount: 400, category: "food" },
  { user: "Alice", type: "credit", amount: 100, category: "food" },
];

const Test1 = () => {
  console.log(
    "Test",
    transactions.filter((item) => item.type == "credit").reduce((obj,transaction)=>{
        
    },{})
  );
};

export default Test1;
