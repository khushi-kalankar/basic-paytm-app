import { useEffect, useState } from "react";
import axios from "axios";
import { SendMoneyButton } from "./SendMoneyButton";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
      .then((response) => {
        setUsers(response.data.user);
      });
  }, [filter]);

  return (
    <div>
      <div className="font-bold text-lg mt-3 ml-3 ">Users</div>
      <div mx-3 my-2>
        <input
          onClick={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className=" w-full px-2 py-1 border rounded-md border-slate-200 mx-2 "
        />
      </div>
      <div>
        {users.map((user) => (
          <User user={user} />
        ))}
      </div>
    </div>
  );
};

function User({ user }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full bg-gray-800 h-10 w-10 flex justify-center my-3 mx-3">
          <div className="flex justify-center flex-col h-full text-xl font-semibold text-white  ">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center mb-2">
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-4">
        <SendMoneyButton
          onClick={(e) => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
