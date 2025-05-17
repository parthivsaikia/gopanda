import { Form } from "react-router";

export default function SignupPage() {
  return (
    <div>
      <Form>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label htmlFor="username">Userame</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>{" "}
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>{" "}
        <div>
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input type="tel" name="mobileNumber" id="mobileNumber" />
        </div>{" "}
        <div>
          <label htmlFor="state">State</label>
          <input type="text" name="state" id="state" />
        </div>{" "}
        <div>
          <label htmlFor="country">Country</label>
          <input type="text" name="country" id="country" />
        </div>{" "}
        <div>
          <div>
            <input type="radio" name="role" id="customer" value={`Customer`} />
            <label htmlFor="customer">Customer</label>
          </div>
          <div>
            <input
              type="radio"
              name="role"
              id="travelAgent"
              value={`TravelAgent`}
            />
            <label htmlFor="travelAgent">Travel Agent</label>
          </div>
        </div>
      </Form>
    </div>
  );
}
