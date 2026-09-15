import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }
  return getFirestore();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const offsets = body.offsets;
    
    if (!offsets || !Array.isArray(offsets)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("settings").doc("hero").set({ offsets });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving hero settings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
