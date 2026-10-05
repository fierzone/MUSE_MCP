export function parseCSV(text) {
const rows = [];
let row = [];
let field = "";
let inQuotes = false;
let i = 0;

const endField = () => {
row.push(field);
field = "";
};

const endRow = () => {
endField();
// skip completely blank lines
if (!(row.length === 1 && row[0] === "")) rows.push(row);
row = [];
};

while (i < text.length) {
const c = text[i];

if (inQuotes) {
  if (c === '"') {
    if (text[i + 1] === '"') {
      field += '"'; // escaped (doubled) quote
      i += 2;
    } else {
      inQuotes = false;
      i += 1;
    }
  } else {
    field += c;
    i += 1;
  }
} else if (c === '"') {
  inQuotes = true;
  i += 1;
} else if (c === ",") {
  endField();
  i += 1;
} else if (c === "\r") {
  endRow();
  i += text[i + 1] === "\n" ? 2 : 1; // CRLF or lone CR
} else if (c === "\n") {
  endRow();
  i += 1;
} else {
  field += c;
  i += 1;
}

}

// trailing data not terminated by a line ending
if (field !== "" || row.length > 0) endRow();

if (rows.length === 0) return [];

const headers = rows[0];
return rows.slice(1).map((r) => {
const obj = {};
for (let j = 0; j < headers.length; j++) {
obj[headers[j]] = j < r.length ? r[j] : "";
}
return obj;
});
}
