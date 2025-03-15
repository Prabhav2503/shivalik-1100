// app/api/mess-menu/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import MessMenu from "@/app/models/MessMenu";
import { connect } from "http2";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Find the latest mess menu (or create a default one if none exists)
    let messMenu = await MessMenu.findOne().sort({ _id: -1 });
    
    // If no mess menu exists, create a default one
    if (!messMenu) {
      const defaultMenu = {
        menu: [
          {
            day: "Monday",
            meals: {
              breakfast: ["Bread", "Butter", "Jam", "Milk", "Tea"],
              lunch: ["Rice", "Dal", "Vegetable Curry", "Salad", "Curd"],
              dinner: ["Chapati", "Paneer Dish", "Rice", "Dal", "Sweet"],
            },
          },
          {
            day: "Tuesday",
            meals: {
              breakfast: ["Idli", "Sambhar", "Coconut Chutney", "Coffee"],
              lunch: ["Rice", "Sambar", "Rasam", "Papad", "Buttermilk"],
              dinner: ["Chapati", "Vegetable Curry", "Rice", "Dal", "Fruit"],
            },
          },
          {
            day: "Wednesday",
            meals: {
              breakfast: ["Poha", "Upma", "Boiled Eggs", "Tea"],
              lunch: ["Rice", "Rajma Curry", "Mixed Vegetable", "Raita"],
              dinner: ["Chapati", "Chicken Curry", "Rice", "Dal", "Ice Cream"],
            },
          },
          {
            day: "Thursday",
            meals: {
              breakfast: ["Dosa", "Sambhar", "Coconut Chutney", "Coffee"],
              lunch: ["Rice", "Dal", "Kadhai Paneer", "Salad", "Fruit"],
              dinner: ["Chapati", "Egg Curry", "Rice", "Dal", "Kheer"],
            },
          },
          {
            day: "Friday",
            meals: {
              breakfast: ["Paratha", "Curd", "Pickle", "Tea"],
              lunch: ["Rice", "Dal Makhani", "Vegetable Curry", "Papad"],
              dinner: ["Chapati", "Veg Biryani", "Raita", "Sweet"],
            },
          },
          {
            day: "Saturday",
            meals: {
              breakfast: ["Vada", "Sambhar", "Coconut Chutney", "Coffee"],
              lunch: ["Rice", "Dal", "Vegetable Curry", "Raita", "Pickle"],
              dinner: ["Chapati", "Mushroom Curry", "Rice", "Dal", "Fruit"],
            },
          },
          {
            day: "Sunday",
            meals: {
              breakfast: ["Puri", "Aloo Sabzi", "Sweet", "Tea"],
              lunch: ["Special Thali", "Pulao", "Paneer Dish", "Dessert"],
              dinner: ["Chapati", "Special Curry", "Rice", "Dal", "Ice Cream"],
            },
          },
        ],
      };
      
      messMenu = await MessMenu.create(defaultMenu);
    }
    
    return NextResponse.json(messMenu);
  } catch (error) {
    console.error("Error fetching mess menu:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate the request body
    if (!body._id || !body.menu || !Array.isArray(body.menu)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    // Validate each day's menu structure
    for (const day of body.menu) {
      if (!day.day || !day.meals) {
        return NextResponse.json(
          { error: "Invalid day menu structure" },
          { status: 400 }
        );
      }
      
      // Check meals structure
      const meals = day.meals;
      if (!Array.isArray(meals.breakfast) || !Array.isArray(meals.lunch) || !Array.isArray(meals.dinner)) {
        return NextResponse.json(
          { error: "Invalid meals structure" },
          { status: 400 }
        );
      }
    }
    
    // Update the mess menu
    const updatedMenu = await MessMenu.findByIdAndUpdate(
      body._id,
      { menu: body.menu },
      { new: true, runValidators: true }
    );
    
    if (!updatedMenu) {
      return NextResponse.json(
        { error: "Mess menu not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error("Error updating mess menu:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}