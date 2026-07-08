import {NextResponse} from 'next/server'

/**
 * Mock form endpoint — replace with your own webhook/service.
 * See README for configuration instructions.
 */
export async function POST() {
  return NextResponse.json({success: true, message: 'Form submitted (mock)'})
}
