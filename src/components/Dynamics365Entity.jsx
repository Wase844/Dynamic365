import React, { useState, useEffect } from "react";
import {
  Bold,
  Edit,
  PlusSquare,
  Save,
  Trash2,
  UserPlus,
  XSquare,
  marginTop,
} from "react-feather";
const Dynamics365Entity = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    EmployeeID: "",
    FirstName: "",
    LastName: "",
  });

  const handleIdChange = (e) => {
    setFormData({
      ...formData,
      EmployeeID: e.target.value,
    });
  };

  const handleFirstNameChange = (e) => {
    setFormData({
      ...formData,
      FirstName: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setFormData({
      ...formData,
      LastName: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return `${user.EmployeeID} ${user.FirstName} ${user.LastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });
  useEffect(() => {
    fetch(
      "https://prod-18.centralindia.logic.azure.com:443/workflows/8914fa7350f94fe8b84adc952553ac25/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3_V8DMnqi4F0L0jn6M9mqo8AlqAgqaRZMGEAT13KV7Y",
      { method: "POST" }
    )
      .then((res) => res.json())

      .then(
        (data) => {
          setIsLoaded(true);

          setUsers(data);
        },
        (error) => {
          setIsLoaded(true);

          setError(error);
        }
      );
  }, []);
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const handleEdit = (user) => {
      setSelectedUser(user);
      setIsEditMode(true);
      setFormData({
        EmployeeID: user.EmployeeID,
        FirstName: user.FirstName,
        LastName: user.LastName,
      });
    };

    const handleSave = () => {
      const updatedUsers = users.map((user) => {
        if (user.EmployeeID === selectedUser.EmployeeID) {
          return {
            ...user,
            EmployeeID: formData.EmployeeID,
            FirstName: formData.FirstName,
            LastName: formData.LastName,
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      setSelectedUser(null);
      setIsEditMode(false);

      // Create an object with the data you want to send
      const postData = {
        EmployeeID: formData.EmployeeID,
        FirstName: formData.FirstName,
        LastName: formData.LastName,
      };

      // Send a POST request with the data
      fetch(
        "https://prod-17.centralindia.logic.azure.com:443/workflows/e8c1736d2ab348aa844a90b5d28c3ebd/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GNM306yW-gcH8TVxEzpV7KV6S4-sD-dzjs4_Q9vKITs",
        {
          method: "POST",
          body: JSON.stringify(postData), // Convert the data to a JSON string
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here
          console.log(data);
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
    };

    const handleCancel = () => {
      // Clear the form and exit edit mode.
      setSelectedUser(null);
      setIsEditMode(false);
    };
    const handleAdd = () => {
      // Implement logic to add a new user to the users state.
      const newUser = {
        EmployeeID: formData.EmployeeID,
        FirstName: formData.FirstNme,
        LastName: formData.LastName,
      };
      setUsers([...users, newUser]);
      setFormData({
        EmployeeID: "",
        FirstName: "",
        LastName: "",
      });
    };
    const handleDelete = () => {
      if (!selectedUser) {
        return;
      }
      // Implement logic to delete the selected user.
      // Update the users state without the deleted user.
      const updatedUsers = users.filter(
        (user) => user.EmployeeID !== selectedUser.EmployeeID
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
      setIsEditMode(false);
    };

    return (
      <div style={{ marginLeft: "190px", marginTop: "-20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          class="form-control"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginLeft: "-80px"}}
          
        />
        <button class="btn btn-success d-grid gap-2 col-6 mx-auto" type="button">

        <UserPlus
          size="30px"
          onClick={handleAdd}
          cursor="pointer"
          style={{ marginLeft: "50px" }}
          
        />
        </button>
        </div>
        {isEditMode ? (
          // Render the edit form when isEditMode is true
          <div>
            <input
              type="text"
              placeholder="Edit Employee ID"
              value={formData.EmployeeID}
              onChange={handleIdChange}
              name="Employee ID"
              style={{ marginBottom: "10px" }} // Add margin to create a gap
            />
            <input
              type="text"
              placeholder="Edit First Name"
              value={formData.FirstName}
              onChange={handleFirstNameChange}
              name="FirstName"
              style={{ marginBottom: "10px" }} // Add margin to create a gap
            />
            <input
              type="text"
              placeholder="Edit Last Name"
              value={formData.LastName}
              onChange={handleLastNameChange}
              name="LastName"
              style={{ marginBottom: "10px" }} // Add margin to create a gap
            />
            {/* Add input fields for FirstName and LastName */}
            {/* save and Cancel */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                class="btn btn-success"
                onClick={handleSave}
                style={{ cursor: "pointer" }}
              >
                <span style={{ padding: "3px" }}>
                  <Save />
                </span>{" "}
                Save
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onClick={handleCancel}
                style={{ cursor: "pointer" }}
              >
                <span style={{ padding: "3px" }}>
                  <XSquare />
                </span>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Render the user list when isEditMode is false
          <div style={{ width: "400px", marginLeft: "-80px" }}>
           <table class="table table-hover" style={{ width: "500px", margin: "15 auto"}}>
  <thead>
    <tr marginLeft="20px">
      <th>EmployeeID</th>
      <th>FirstName</th>
      <th>LastName</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredUsers.map((user) => (
      <tr key={user.EmployeeID}>
        <td>{user.EmployeeID}</td>
        <td>{user.FirstName}</td>
        <td>{user.LastName}</td>
        <td>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit(user)}
              class="btn btn-success"
            >
              <Edit
                size="20px"
                onClick={() => handleEdit(user)}
                style={{
                  cursor: "pointer",
                  marginTop: "-8px",
                  paddingTop: "4px",
                }}
              />
            </button>
            <button
              style={{ cursor: "pointer", marginLeft: "30px" }}
              onClick={() => handleDelete(user)}
              class="btn btn-danger"
            >
              <Trash2
                size="20px"
                onClick={() => handleDelete(selectedUser)}
                style={{
                  cursor: "pointer",
                  marginTop: "-8px",
                  paddingTop: "4px",
                }}
              />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        )}
      </div>
    );
  }
};
export default Dynamics365Entity;
