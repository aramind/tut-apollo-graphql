import { useState } from "react";
import "./App.css";

import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);
  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USER_BY_ID, { variables: { id: "2" } });

  // use mutation
  const [createUser] = useMutation(CREATE_USER);

  const handleCreateUser = async () => {
    createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
    });
  };
  if (getUsersLoading) return <p>Data loading...</p>;
  if (getUsersError || getUserByIdError) return <p>{error.message} </p>;

  return (
    <>
      <div>
        <input
          placeholder="Name..."
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Age..."
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleCreateUser}>CREATE USER</button>
      </div>

      <h1>Users</h1>
      <div>
        {getUserByIdLoading ? (
          <p>Loading user</p>
        ) : (
          <div className="row">
            <h3>Chosen User: </h3>
            <h3>{getUserByIdData.getUserById.name}</h3>
          </div>
        )}
      </div>
      <div>
        {getUsersData.getUsers.map((user) => (
          <div className="">
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Is this user married?: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
