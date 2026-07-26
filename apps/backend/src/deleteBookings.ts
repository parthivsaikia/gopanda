import prismaInstance from "@repo/db";

export const deleteBooking = async () => {
  await prismaInstance.booking.deleteMany();
  await prismaInstance.$disconnect();
};

const deletePayments = async () => {
  await prismaInstance.payment.deleteMany();
  await prismaInstance.$disconnect();
};

const deletePaymentTransactions = async () => {
  await prismaInstance.paymentTransaction.deleteMany();
  await prismaInstance.refund.deleteMany();
  await prismaInstance.$disconnect();
};

deleteBooking();
deletePayments();
deletePaymentTransactions();
