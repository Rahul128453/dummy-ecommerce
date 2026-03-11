import { useState } from "react";

const Contact = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setSuccess("Message sent successfully ✅");

            setForm({
                name: "",
                email: "",
                message: ""
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto p-10">

            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    rows={4}
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded"
                >
                    Send Message
                </button>

            </form>

            {success && <p className="text-green-600 mt-4">{success}</p>}

        </div>
    );
};

export default Contact;