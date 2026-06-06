import { generateToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongobd";
import UserModel from "@/models/User.models";
import { IloginUser } from "@/types/User.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try{
    await connectDB();
    
    const body:IloginUser = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const isUserExist = await UserModel.findOne({ email });

    if (!isUserExist) {
      return NextResponse.json<APIResponse>({
        message: "User does not exist",
        success: false,
      }, { status: 404 });
    }

    if (!isUserExist.comparePassword(password)) {
      return NextResponse.json<APIResponse>({
        message: "Invalid credentials",
        success: false,
      }, { status: 401 });
    }

    const token = generateToken({ userId: isUserExist._id.toString() });

    const response = NextResponse.json<APIResponse>({
      message: "User logged in successfully",
      success: true,
      data: { 
        user: {
          _id: isUserExist._id,
          name: isUserExist.name,
          email: isUserExist.email,
          mobile: isUserExist.mobile,
        },
        token,
       },
    }, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return response;

  }catch(error){
    console.error("Error in registration:", error);
    return NextResponse.json<APIResponse>({
      message: "Error in registration",
      success: false,
      error: String(error),
    }, { 
      status: 500 
    })
  }
}