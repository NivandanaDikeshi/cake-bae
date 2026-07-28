import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";


export async function POST(
  req: NextRequest
) {

  try {

    const body = await req.json();


    const image = body.image;


    if (!image) {

      return NextResponse.json(
        {
          success: false,
          message: "Image is required",
        },
        {
          status: 400,
        }
      );

    }



    // Upload image to Cloudinary

    const result = await cloudinary.uploader.upload(
      image,
      {
        folder: "cakebae",

        resource_type: "image",

        transformation: [
          {
            width: 800,
            height: 800,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      }
    );



    return NextResponse.json(
      {
        success: true,

        url: result.secure_url,

        public_id: result.public_id,

      },
      {
        status: 200,
      }
    );



  } catch (error: any) {


    console.error(
      "Cloudinary Upload Error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          error.message ||
          "Image upload failed",

      },
      {
        status: 500,
      }
    );


  }

}