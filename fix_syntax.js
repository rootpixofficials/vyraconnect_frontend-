const fs = require('fs');

// Fix Reports
let reports = fs.readFileSync('app/admin/reports/page.tsx', 'utf8');
reports = reports.replace(/\\`/g, '`');
reports = reports.replace(/\\\$/g, '$');
reports = reports.replace(/\\\\n/g, '\\n');
fs.writeFileSync('app/admin/reports/page.tsx', reports);

// Fix Vehicles
let vehicles = fs.readFileSync('app/admin/vehicles/page.tsx', 'utf8');
vehicles = vehicles.replace(/\\`/g, '`');
vehicles = vehicles.replace(/\\\$/g, '$');
fs.writeFileSync('app/admin/vehicles/page.tsx', vehicles);

console.log('Fixed syntax errors.');
