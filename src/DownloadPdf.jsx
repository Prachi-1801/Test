import { Height } from "@mui/icons-material";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts;

export const getTableDocDefinition = (data) => {
  const tableRows = data.map((item) => [
    item.name,
    item.email,
    item.address,
    item.contact,
    item.birthDate,
    item.nominee,
  ]);
  return {
    info: { title: "test" },
    pageSize: {
      height: 530,
      width: 600,
    },
    content: [
      {
        table: {
          headerRows: 1, // Specifies that the first row is a header
          widths: ["auto", "auto", "auto", "auto", "auto", "auto"], // Column widths (e.g., auto-width or fixed width)
          body: [
            // Table Header
            ["Name", "Email", "Address", "Contact", "BirthDate", "Nominee"],
            // Table Rows
            ...tableRows,
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10], // top, right, bottom, left
      },
    },
  };
};

export const generateTablePdf = (docDefinition) => {
  const pdf = pdfMake.createPdf(docDefinition); //.open({}, window); //download("MyDocument.pdf");
  return pdf;
};

export const getDocDefinition = (item) => {
  return {
    pageSize: {
      height: 530,
      width: 600,
    },
    content: [
      { text: item.name },
      { text: item.email },
      { text: item.address },
      { text: item.contact },
      { text: item.birthDate },
      { text: item.nominee },
    ],
  };
};

const generatePdf = (docDefinition) => {
  const pdf = pdfMake.createPdf(docDefinition);
  return pdf;
};

export default generatePdf;
