import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST() {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // We want to sign a request for an upload.
        // We can enforce folder usage here if we want.
        const folder = 'stackpage-user-uploads';

        // The signature must be based on the parameters we'll send to the upload API
        // We are generating a signature for: 'folder' and 'timestamp'.
        const signature = cloudinary.utils.api_sign_request({
            timestamp,
            folder,
        }, process.env.CLOUDINARY_API_SECRET!);

        return NextResponse.json({
            signature,
            timestamp,
            folder,
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY
        });
    } catch (error) {
        console.error('Cloudinary Sign Error:', error);
        return NextResponse.json({ error: 'Failed to sign request' }, { status: 500 });
    }
}
