import { authOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectionToDatabase();

    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || !videos.length) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    await connectionToDatabase();
    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { message: "all fields are required" },
        { status: 400 }
      );
    }
    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformations: {
        height: body.transformations?.height ?? 480,
        width: body.transformations?.width ?? 640,
        quality: body.transformations?.quality ?? 100,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create video" },
      { status: 500 }
    );
  }
}
