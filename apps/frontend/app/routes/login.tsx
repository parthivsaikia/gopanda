import { Form } from "react-router";

export default function LoginPage() {
  return (
    <div>
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
      </Form>
    </div>
  );
}
