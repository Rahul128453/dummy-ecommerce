import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type LoginForm = {
    email: string;
    password: string;
};

const Login = () => {
    const { register, handleSubmit } = useForm<LoginForm>();
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ use context

    const onSubmit = async (data: LoginForm) => {
        const response = await fetch(
            `http://localhost:5000/users?email=${data.email}&password=${data.password}`
        );

        const user = await response.json();

        if (user.length === 0) {
            alert("Invalid credentials");
            return;
        }

        // ✅ Use context instead of localStorage directly
        login(user[0]);

        alert("Login successful!");
        navigate("/");
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Login</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    placeholder="Email"
                    {...register("email", { required: true })}
                    className="w-full border px-4 py-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: true })}
                    className="w-full border px-4 py-2 rounded"
                />

                <button className="w-full bg-black text-white py-2 rounded">
                    Login
                </button>
                <p>new user? <Link to="/register" className="text-blue-500">Register here</Link></p>
            </form>
        </div>
    );
};

export default Login;