import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Nutrition } from "@/lib/models/Nutrition";
import { User } from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    const query: any = { userId: session.user.id };
    if (dateStr) {
      const start = new Date(dateStr);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateStr);
      end.setHours(23, 59, 59, 999);
      query.logDate = { $gte: start, $lte: end };
    }

    const meals = await Nutrition.find(query).sort({ logDate: -1 }).lean();

    // Aggregate daily totals
    const dailyTotals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.totalCalories || 0;
        acc.protein += meal.totalProtein || 0;
        acc.carbs += meal.totalCarbs || 0;
        acc.fat += meal.totalFat || 0;
        acc.waterMl += meal.waterMl || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 }
    );

    return NextResponse.json({ meals, dailyTotals });
  } catch (error) {
    console.error("Nutrition GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    // Calculate totals from food items
    const foodItems = body.foodItems || [];
    const totals = foodItems.reduce(
      (acc: any, item: any) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const meal = await Nutrition.create({
      userId: session.user.id,
      logDate: body.logDate || new Date(),
      mealType: body.mealType,
      foodItems,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      waterMl: body.waterMl || 0,
      notes: body.notes,
    });

    // Award 3 XP for logging a meal
    await User.findByIdAndUpdate(session.user.id, { $inc: { xp: 3 } });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Nutrition POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
