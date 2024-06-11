#ref-table {
  width: 100%; /* Or set a specific width */
  border-collapse: collapse; /* Remove extra spacing between cells */
  margin: 20px auto; /* Center the table with some margin */
  font-family: "Radikal"; /* Consistent font for the table */
  table-layout: fixed; /* This is the key addition */
  background-color: #ffffff; /* White with 80% opacity (adjust as needed) */
}


#ref-table th, #ref-table td {
  padding: 8px;
  text-align: center;
  overflow: hidden; /* Prevent content from overflowing the cell */
  text-overflow: ellipsis; /* Add ellipsis (...) if content is too long */
  white-space: nowrap; /* Prevent text from wrapping */
  color: #340040; /* Text color for headers */
}


#ref-table th {
  background-color: #e1e0e0; /* Blue with 90% opacity (adjust color and opacity as needed) */
}

#ref-table tr:last-child td { /* Selects the 21th row */
  border-bottom: 1px solid #c1c1c1; 
}

#ref-table td:nth-child(2),
#ref-table td:nth-child(3) {  /* Target the 2nd cell in each row */
  text-align: left; 
  padding-left: 80px;
}

#ref-table td:nth-child(2),
#ref-table td:nth-child(1) {  /* Target the 2nd cell in each row */
  font-weight: bold; 
}

/* Table Row Hover Effect */
#ref-table tr:hover {
  background-color: #e4e2e2; /* Light gray background on hover */
}