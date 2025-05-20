import { Form } from "react-router";

export default function TourCreateForm() {
  return (
    <div>
      <Form method="post" action="/new-tour">
        <div>
          <label>Minimum People</label>
          <input type="text" id="minimumPeople" name="minimumPeople" />
        </div>
        <div>
          <label>Cost per person</label>
          <input type="number" id="price" name="price" />
        </div>
        <div>
          <label>Start Date</label>
          <input type="date" id="startDate" name="startDate" />
        </div>
        <div>
          <label>End Date</label>
          <input type="date" id="endDate" name="endDate" />
        </div>
        <button type="submit">Create Tour</button>
      </Form>
    </div>
  );
}
