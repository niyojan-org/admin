// Dummy API route for payment status simulation
export async function GET(request) {
  // Simulate random success or failure
  const isSuccess = Math.random() > 0.5;
  await new Promise((res) => setTimeout(res, 1000)); // Simulate network delay
  if (isSuccess) {
    return Response.json({
      status: "success",
      paymentId: "pay_123456",
      amount: 4999,
      currency: "INR",
      method: "UPI",
      date: "2025-10-17T12:34:56Z",
      message: "Payment successful!"
    });
  } else {
    return Response.json({
      status: "failed",
      paymentId: "pay_654321",
      amount: 4999,
      currency: "INR",
      method: "UPI",
      date: "2025-10-17T12:34:56Z",
      message: "Payment failed. Please try again."
    }, { status: 400 });
  }
}
