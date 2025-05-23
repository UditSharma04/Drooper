import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {userId} = await auth()
        if(!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // parse request body
        const body = await request.json()
        const {imagekit, userId: bodyUserId} = body

        // userId from backend should match userId from request body (frontend)
        // this is to prevent unauthenticated users from uploading files to other users

        if(userId !== bodyUserId) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        if(!imagekit || !imagekit.url) {
            return NextResponse.json(
                {error: "Invalid file upload data"},
                {status: 401}
            );
        }

        const fileData = {
            name: imagekit.name || "Untitled",
            path: imagekit.filePath || `/drooper/${userId}/${imagekit.name}`,
            size: imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null, // Root level by default
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const [newFile] = await db.insert(files).values(fileData).returning()
        return NextResponse.json(newFile, {status: 201})
        
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to save info to db"},
            {status: 500}
        );
    }
}