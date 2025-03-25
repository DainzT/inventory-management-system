import React from "react";
import { useParams } from "react-router-dom";

const items = [
  { id: 1, name: "Item 1", fleet: "f/b-donya-donya-2x" },
  { id: 2, name: "Item 2", fleet: "f/b-dona-librada" },
  { id: 3, name: "Item 3", fleet: "f/b-donya-donya-2x" },
  { id: 4, name: "Item 4", fleet: "f/b-dona-librada" },
];

const Summary: React.FC = () => {
  const { fleetName } = useParams<{ fleetName: string }>();
  
  // Decode the fleetName to handle special characters like /
  const decodedFleetName = fleetName ? decodeURIComponent(fleetName) : '';

  const filteredItems =
    decodedFleetName === "all-fleets"
      ? items
      : items.filter((item) => item.fleet === decodedFleetName);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Fleet: {decodedFleetName.replace("f/b-", "").replace(/-/g, " ")}
      </h1>
      {filteredItems.length > 0 ? (
        <ul>
          {filteredItems.map((item) => (
            <li key={item.id} className="mb-2 p-2 bg-gray-100 rounded">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found for this fleet.</p>
      )}
    </div>
  );
};

export default Summary;