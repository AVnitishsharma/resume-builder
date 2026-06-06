import { generateToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongobd";
import UserModel from "@/models/User.models";
import { IregisterUser } from "@/types/User.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try{
    await connectDB();
    
    const body:IregisterUser = await req.json();
    const { name, email, password, mobile } = body;

    if (!name || !email || !password || !mobile) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const isUserExist = await UserModel.findOne({ email });

    if (isUserExist) {
      return NextResponse.json<APIResponse>({
        message: "User already exists",
        success: false,
      }, { status: 409 });
    }

    const newUser = await UserModel.create({ 
      name, email, password, mobile 
    });

    const token = generateToken({ userId: newUser._id.toString() });

    const response = NextResponse.json<APIResponse>({
      message: "User registered successfully",
      success: true,
      data: { 
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
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