import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function currentUser() {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if(!token) throw new Error("token not found");
  
  const decode = verifyToken(token);
  if(!decode) throw new Error("token not valid");
  
  return decode.userId;

}