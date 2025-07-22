import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { gameName, description } = await request.json()

    if (!gameName || !description) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }

    // In a real application, you would send this data to a service like:
    // - Your email via an email API (e.g., Resend, SendGrid)
    // - A database (e.g., Firebase Firestore)
    // - A project management tool (e.g., create a Trello card or GitHub issue)

    console.log("New Game Suggestion Received:")
    console.log("Game Name:", gameName)
    console.log("Description:", description)

    return NextResponse.json({ message: "Suggestion received successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing suggestion:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
