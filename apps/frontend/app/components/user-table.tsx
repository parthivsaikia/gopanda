export default function UserDataTable({
  data,
}: {
  data: {
    id: string;
    name: string;
    age: number;
    verified: boolean;
  }[];
}) {
  return (
    <div className="w-full p-6">
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                Age
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                Verified
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-4 align-middle">{row.name}</td>
                <td className="p-4 align-middle">{row.age}</td>
                <td className="p-4 align-middle">
                  {row.verified ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
