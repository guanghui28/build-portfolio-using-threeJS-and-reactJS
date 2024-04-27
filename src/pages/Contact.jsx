import React, { Suspense, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Canvas } from "@react-three/fiber";
import Fox from "../models/Fox";
import Loader from "../components/Loader";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

const Contact = () => {
    const formRef = useRef(null);
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState("idle");
    const { alert, showAlert, hideAlert } = useAlert();

    const handleChange = (e) => {
        setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
    };
    const handleFocus = () => {
        setCurrentAnimation("walk");
    };
    const handleBlur = () => {
        setCurrentAnimation("idle");
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setCurrentAnimation("hit");
        emailjs
            .send(
                import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
                {
                    from_name: form.name,
                    to_name: "GuangHui",
                    from_email: form.email,
                    to_email: "phamquanghuy2809@gmail.com",
                    message: form.message,
                },
                import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
            )
            .then(() => {
                setIsLoading(false);
                showAlert({
                    text: "Message sent successfully!",
                    type: "success",
                });

                setTimeout(() => {
                    hideAlert({
                        text: "I didn't receive your message",
                        type: "danger",
                    });
                    setForm({ name: "", email: "", message: "" });
                    setCurrentAnimation("idle");
                }, 3000);
            })
            .catch((err) => {
                setIsLoading(false);
                setCurrentAnimation("idle");
                console.log(err);
            });
    };
    return (
        <section className="relative flex lg:flex-row flex-col max-container h-[100vh]">
            {alert.show && <Alert {...alert} />}
            <div className="flex-1 min-w-[50%] flex flex-col">
                <h1 className="head-text">Get in touch</h1>
                <form
                    className="flex flex-col gap-7 mt-14 w-full"
                    onSubmit={handleSubmit}
                >
                    <label className="text-black-500 font-semibold">
                        Name
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            className="input"
                            required
                            value={form.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </label>
                    <label className="text-black-500 font-semibold">
                        Email
                        <input
                            type="email"
                            name="email"
                            placeholder="john@gm.com"
                            className="input"
                            required
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </label>
                    <label className="text-black-500 font-semibold">
                        Your message
                        <textarea
                            type="text"
                            name="message"
                            placeholder="Let's me know how I can help you"
                            className="textarea"
                            required
                            value={form.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </label>
                    <button
                        type="submit"
                        className="btn"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    >
                        {isLoading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
            <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
                <Canvas
                    camera={{
                        position: [0, 0, 5],
                        fov: 75,
                        near: 0.1,
                        far: 1000,
                    }}
                >
                    <Suspense fallback={<Loader />}>
                        <directionalLight
                            intensity={2.5}
                            position={[0, 0, 1]}
                        />
                        <ambientLight intensity={0.5} />
                        <Fox
                            currentAnimation={currentAnimation}
                            position={[0.5, 0.5, 0]}
                            rotation={[12.6, -0.6, 0]}
                            scale={[0.5, 0.5, 0.5]}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
};

export default Contact;
