import { createOrder } from "./create-order";
const callCreateOrder = async () => {
  const order = await createOrder({ amount: "1000", currency: "INR" });
  return order;
};

callCreateOrder();
