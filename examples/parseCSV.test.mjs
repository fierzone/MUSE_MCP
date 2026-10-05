import { parseCSV } from './parseCSV.mjs'

const csv = 'name,note,city\r\n"Nguyen, Van A","Says ""hi""",Hanoi\nBob,plain,"Ho Chi Minh City"'
const rows = parseCSV(csv)
console.log(JSON.stringify(rows))

let pass = true
const eq = (a, b, msg) => { if (a !== b) { pass = false; console.log(`FAIL ${msg}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`) } }

eq(rows.length, 2, 'row count')
eq(rows[0].name, 'Nguyen, Van A', 'comma inside quotes')
eq(rows[0].note, 'Says "hi"', 'doubled-quote escape')
eq(rows[0].city, 'Hanoi', 'plain field')
eq(rows[1].city, 'Ho Chi Minh City', 'quoted last field')
eq(rows[1].note, 'plain', 'unquoted field')

console.log(pass ? 'ALL_PASS' : 'HAS_FAILURES')
process.exit(pass ? 0 : 1)
