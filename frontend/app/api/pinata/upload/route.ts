import { NextRequest, NextResponse } from 'next/server'
import { pinata } from '@/pinata/pinata'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    console.log("file:",file)
    // Convert File to the format Pinata expects if needed
    const upload = await pinata.upload.public.file(file)
    
    return NextResponse.json({
      success: true,
      cid: upload.cid,
      uploadedAt: upload.created_at,
    })
  } catch (error: any) {
    console.error('IPFS Upload Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload to IPFS',
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}