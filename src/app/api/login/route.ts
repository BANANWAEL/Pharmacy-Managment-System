import { NextResponse } from "next/server";
import { USERS } from "@/lib/fake-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // محاكاة تأخير الشبكة (للتجربة فقط)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = USERS.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (role !== user.role) {
      return NextResponse.json(
        { message: `This account is not authorized as a ${role}` },
        { status: 403 }
      );
    }

    // منطق الموظف (Pending Approval)
    if (user.role === "employee") {
      return NextResponse.json({
        status: "pending_approval",
        message: "Waiting for admin approval...",
      });
    }

    // منطق المدير (Success)
    return NextResponse.json({
      status: "success",
      token: "fake-jwt-token-123", // محاكاة التوكن
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}