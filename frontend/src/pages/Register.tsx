import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
};

const Register = () => {
    const { register, handleSubmit } = useForm<RegisterForm>();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterForm) => {
        // Check if user already exists
        const checkUser = await fetch(
            `http://localhost:5000/users?email=${data.email}`
        );
        const existingUser = await checkUser.json();

        if (existingUser.length > 0) {
            alert("User already exists!");
            return;
        }

        await fetch("http://localhost:5000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        alert("Registered Successfully!");
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Register</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    placeholder="Name"
                    {...register("name", { required: true })}
                    className="w-full border px-4 py-2 rounded"
                />

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
                    Register
                </button>
                <p>Already have an account? <Link to="/login" className="text-blue-500">Login here</Link></p>
            </form>
        </div>
    );
};

export default Register;