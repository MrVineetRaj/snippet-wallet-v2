import { useUser } from "../context/user.context";

const UserConsole = () => {
  const { isSignedIn, fetchUser, user } = useUser();

  return (
    <div className="mt-8">
      {isSignedIn ? (
        <div>
          <img src={user?.avatar} alt="" />
          <h1>Welcome, {user?.avatar}</h1>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          <button onClick={() => fetchUser()}>Refresh User Data</button>
        </div>
      ) : (
        <div className="">
          <h1>Please sign in to access your console</h1>
          <button onClick={() => fetchUser()}>Sign In</button>
        </div>
      )}
    </div>
  );
};

export default UserConsole;
