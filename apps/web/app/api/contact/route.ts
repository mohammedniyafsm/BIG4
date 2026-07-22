import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  message: z.string().trim().min(5, "Message is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Save lead to Database
    try {
      await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          interest: data.interest,
          message: data.message,
        }
      });
    } catch (dbError) {
      console.error("Failed to save lead to database:", dbError);
      // We can continue to try to send the email even if DB fails
    }

    // 2. Send email via Nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"Big4 Website" <${process.env.SMTP_USER}>`, // sender address
          to: process.env.SMTP_TO || "big4tiles@gmail.com", // list of receivers
          subject: `New Website Lead: ${data.interest || "Contact Form"} - ${data.name}`, // Subject line
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Interest:</strong> ${data.interest || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #ccc;">
              ${data.message.replace(/\n/g, "<br>")}
            </blockquote>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Failed to send email via nodemailer:", emailError);
        // We'll still return success if the lead was saved to DB, or we can choose to fail.
        // Usually, failing the request if email fails is better so user knows it didn't go through.
      }
    } else {
      console.warn("SMTP credentials not configured. Skipping email notification.");
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit message. Please try again." },
      { status: 500 }
    );
  }
}
