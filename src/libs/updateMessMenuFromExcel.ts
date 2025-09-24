import connectToDatabase from "@/libs/mongodb";
import MessMenu from "@/models/MessMenu";
import XLSX from "xlsx";

async function updateMessMenuFromExcel(filePath: string) {
  // Connect to MongoDB using your existing connection utility
  await connectToDatabase();

  // Read Excel
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  // Transform Excel rows into menu array
  const menu = data.map((row: any) => ({
    day: row.Day,
    meals: {
      breakfast: row.Breakfast.split(",").map((s: string) => s.trim()),
      lunch: row.Lunch.split(",").map((s: string) => s.trim()),
      dinner: row.Dinner.split(",").map((s: string) => s.trim()),
    },
  }));

  // Update the existing mess menu document or create a new one
  const existing = await MessMenu.findOne();
  if (existing) {
    existing.menu = menu;
    await existing.save();
    console.log("Mess menu updated successfully!");
  } else {
    await MessMenu.create({ menu });
    console.log("Mess menu created successfully!");
  }

  process.exit(0);
}

// Run the script
updateMessMenuFromExcel("./MessMenu.xlsx").catch((err) => {
  console.error("Error updating mess menu:", err);
  process.exit(1);
});
