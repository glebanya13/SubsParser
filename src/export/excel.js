import ExcelJS from 'exceljs';

export async function saveUsernamesToExcel(users, filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Usernames');
  sheet.columns = [
    { header: 'username', key: 'username', width: 30 },
  ];

  const validUsers = users.filter(u => u.username && u.username.trim() !== '');
  
  console.log(`Total users: ${users.length}, Valid usernames: ${validUsers.length}`);

  for (const u of validUsers) {
    sheet.addRow({ username: u.username.trim() });
  }

  await workbook.xlsx.writeFile(filePath);
}
